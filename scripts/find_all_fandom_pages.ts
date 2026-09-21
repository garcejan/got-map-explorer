import fs from 'fs';
import path from 'path';
import { NODES } from '../src/data/nodes';

interface MatchResult {
  id: string;
  originalName: string;
  queryTried: string[];
  matchedTitle: string | null;
  pageId: number | null;
  wikiUrl: string | null;
  status: 'exact' | 'redirect' | 'search_fallback' | 'missing';
  notes?: string;
}

// Helper to batch array into chunks of N
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

async function checkBatchTitles(titles: string[]): Promise<Record<string, { pageid: number; title: string; missing?: boolean }>> {
  if (titles.length === 0) return {};
  const titlesParam = encodeURIComponent(titles.join('|'));
  const url = `https://gameofthrones.fandom.com/api.php?action=query&titles=${titlesParam}&format=json&redirects=1`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'GoTMapExplorer/1.0 (got-map-explorer research script)' }
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  const pages = data.query?.pages || {};
  const normalizedMap = new Map<string, string>();
  const redirectsMap = new Map<string, string>();

  if (data.query?.normalized) {
    for (const item of data.query.normalized) {
      normalizedMap.set(item.from, item.to);
    }
  }
  if (data.query?.redirects) {
    for (const item of data.query.redirects) {
      redirectsMap.set(item.from, item.to);
    }
  }

  const results: Record<string, { pageid: number; title: string; missing?: boolean }> = {};
  for (const p of Object.values(pages) as any[]) {
    if (p.missing !== undefined) {
      results[p.title.toLowerCase()] = { pageid: -1, title: p.title, missing: true };
    } else {
      results[p.title.toLowerCase()] = { pageid: p.pageid, title: p.title };
    }
  }

  return results;
}

async function searchFandom(query: string): Promise<{ title: string; pageid: number } | null> {
  const url = `https://gameofthrones.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GoTMapExplorer/1.0' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hits = data.query?.search;
    if (hits && hits.length > 0) {
      return { title: hits[0].title, pageid: hits[0].pageid };
    }
  } catch (err) {
    console.error(`Search error for ${query}:`, err);
  }
  return null;
}

async function run() {
  const nodes = Object.values(NODES);
  console.log(`Analyzing ${nodes.length} nodes from NODES...`);

  // Phase 1: generate candidate titles for each node
  const candidatesMap = new Map<string, string[]>();
  for (const node of nodes) {
    const name = node.name.trim();
    const candidates: string[] = [name];

    // Strip parentheticals like "Hazdahn Mo (Vaes Diaf)" -> "Hazdahn Mo", "Vaes Diaf"
    if (name.includes('(') && name.includes(')')) {
      const match = name.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        candidates.push(match[1].trim());
        candidates.push(match[2].trim());
      }
    }

    // Strip "The " or add "The "
    if (name.startsWith('The ')) {
      candidates.push(name.substring(4).trim());
    } else {
      candidates.push(`The ${name}`);
    }

    // Specific known GoT map conventions
    if (name.includes('-by-the-Sea')) {
      candidates.push(name.replace('-by-the-Sea', ' by the Sea'));
      candidates.push(name.replace('-by-the-Sea', ''));
    }

    // e.g. "King's Landing" vs "Kings Landing"
    if (name.includes("'")) {
      candidates.push(name.replace(/'/g, ''));
    }

    // If type is castle, try "<Name> (castle)"
    if (node.type === 'castle') {
      candidates.push(`${name} (castle)`);
    }

    // Deduplicate
    const uniqueCandidates = Array.from(new Set(candidates));
    candidatesMap.set(node.id, uniqueCandidates);
  }

  // Collect all unique candidate titles across all nodes
  const allUniqueTitles = Array.from(
    new Set(Array.from(candidatesMap.values()).flat())
  );
  console.log(`Generated ${allUniqueTitles.length} unique candidate title queries. Batch querying in chunks of 50...`);

  const titleResults: Record<string, { pageid: number; title: string; missing?: boolean }> = {};
  const chunks = chunkArray(allUniqueTitles, 45);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const batchRes = await checkBatchTitles(chunk);
      Object.assign(titleResults, batchRes);
    } catch (err) {
      console.error(`Error querying chunk ${i + 1}/${chunks.length}:`, err);
    }
  }

  console.log(`Completed batch title check. Resolving matches for each node...`);

  const finalMatches: MatchResult[] = [];
  const missingNodes: (typeof nodes[0])[] = [];

  for (const node of nodes) {
    const candidates = candidatesMap.get(node.id) || [node.name];
    let matched: { title: string; pageid: number } | null = null;
    let matchType: 'exact' | 'redirect' = 'exact';

    for (const cand of candidates) {
      const entry = titleResults[cand.toLowerCase()];
      if (entry && !entry.missing) {
        matched = { title: entry.title, pageid: entry.pageid };
        matchType = entry.title.toLowerCase() === node.name.toLowerCase() ? 'exact' : 'redirect';
        break;
      }
    }

    if (matched) {
      finalMatches.push({
        id: node.id,
        originalName: node.name,
        queryTried: candidates,
        matchedTitle: matched.title,
        pageId: matched.pageid,
        wikiUrl: `https://gameofthrones.fandom.com/wiki/${encodeURIComponent(matched.title.replace(/ /g, '_'))}`,
        status: matchType
      });
    } else {
      missingNodes.push(node);
    }
  }

  console.log(`Found direct title matches for ${finalMatches.length} / ${nodes.length} nodes.`);
  console.log(`Missing direct matches: ${missingNodes.length} nodes. Attempting targeted search for missing nodes...`);

  // For missing nodes, try search API
  for (let i = 0; i < missingNodes.length; i++) {
    const node = missingNodes[i];
    console.log(`Searching [${i + 1}/${missingNodes.length}] for "${node.name}" (${node.id})...`);
    
    // Clean name for search
    const cleanName = node.name.replace(/\(.*?\)/g, '').trim();
    let hit = await searchFandom(cleanName);
    
    // If not found and had parens, try the paren part
    if (!hit && node.name.includes('(')) {
      const parenMatch = node.name.match(/\((.*?)\)/);
      if (parenMatch) {
        hit = await searchFandom(parenMatch[1].trim());
      }
    }

    // If still not found and has allegiance, try searching with region/allegiance
    if (!hit && node.allegiance) {
      hit = await searchFandom(`${cleanName} ${node.allegiance}`);
    }

    if (hit) {
      finalMatches.push({
        id: node.id,
        originalName: node.name,
        queryTried: [cleanName],
        matchedTitle: hit.title,
        pageId: hit.pageid,
        wikiUrl: `https://gameofthrones.fandom.com/wiki/${encodeURIComponent(hit.title.replace(/ /g, '_'))}`,
        status: 'search_fallback',
        notes: `Matched via search query "${cleanName}"`
      });
    } else {
      finalMatches.push({
        id: node.id,
        originalName: node.name,
        queryTried: [cleanName],
        matchedTitle: null,
        pageId: null,
        wikiUrl: null,
        status: 'missing',
        notes: 'No wiki page found via title or search'
      });
    }
    // Small delay to prevent rate-limiting
    await new Promise((r) => setTimeout(r, 100));
  }

  // Summary counts
  const exactCount = finalMatches.filter((m) => m.status === 'exact').length;
  const redirectCount = finalMatches.filter((m) => m.status === 'redirect').length;
  const searchCount = finalMatches.filter((m) => m.status === 'search_fallback').length;
  const missingCount = finalMatches.filter((m) => m.status === 'missing').length;

  console.log(`\n=== WIKI MATCH RESULTS ===`);
  console.log(`Exact matches: ${exactCount}`);
  console.log(`Redirect / Variant matches: ${redirectCount}`);
  console.log(`Search fallback matches: ${searchCount}`);
  console.log(`Missing: ${missingCount}`);
  console.log(`Total: ${finalMatches.length} / ${nodes.length}`);

  // Write out results JSON file for inspection
  const outPath = path.resolve('./scripts/data/fandom_matches.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(finalMatches, null, 2), 'utf-8');
  console.log(`\nSaved match data to: ${outPath}`);
}

run().catch((err) => console.error('Fatal error:', err));
