import fs from 'fs';
import path from 'path';
import { NODES } from '../src/data/nodes';

// Direct custom overrides based on our canonical audit
const KNOWN_OVERRIDES: Record<string, string> = {
  // Variations & cleanups
  whitetree: 'White_Tree',
  darry: 'House_Darry',
  lychester: 'Lychester',
  nutten: 'Nutton',
  pinkmaiden: 'Pinkmaiden',
  baelish_keep: 'Baelish_keep',
  coldwater_burn: 'Coldwater',
  gates_of_the_moon: 'Bloody_Gate',
  rambton: 'Rambton',
  sweetport_sound: 'Sweetport',
  old_stonebridge: 'Old_Stone_Bridge',
  wyl: 'Wyl',
  saltshore: 'Salt_Shore',
  hermitage: 'High_Hermitage',
  valyria: 'Old_Valyria',
  asshai: 'Asshai',
  sarhoy: 'Rhoynar',
  
  // Regional & seat contexts where standalone article does not exist on show wiki
  deepdown: 'Skagos',
  kingshouse: 'Skagos',
  breakstone_hill: 'The_North',
  goldgrass: 'Barrowton',
  hags_mire: 'House_Frey',
  ramsford: 'House_Frey',
  mudgrave: 'House_Vance',
  sevenstreams: 'House_Vance',
  breakwater: 'Sisterton',
  sealskin_point: 'Iron_Islands',
  volmark: 'Harlaw',
  ebonhead: 'Summer_Isles',
  tall_trees_town: 'Summer_Isles',
  ib_nor: 'Ibben',
  ib_sar: 'Ibben',
  new_ibbish: 'Ibben',
  vaes_aresak: 'Ibben',
  lorassyon: 'Lorath',
  morosh: 'Lorath',
  lhorulu: 'Rhoyne',
  nefer: 'Jogos_Nhai',
  adakhakileki: 'Dothraki_Sea',
  essaria: 'Free_Cities',
  ghardaa: 'Bone_Mountains',
  bonetown: 'Bone_Mountains',
  hazdahn_mo: 'Ghiscar',
  hornoth: 'Kingdom_of_Sarnor',
  kasath: 'Kingdom_of_Sarnor',
  kyth: 'Kingdom_of_Sarnor',
  mardosh: 'Kingdom_of_Sarnor',
  rathylar: 'Kingdom_of_Sarnor',
  sallosh: 'Kingdom_of_Sarnor',
  sarnath: 'Kingdom_of_Sarnor',
  kayakayanaya: 'Hyrkoon',
  samyriana: 'Hyrkoon',
  kosrak: 'Lhazar',
  lhazosh: 'Lhazareen',
  vaes_efe: 'Vaes_Dothrak',
  vaes_jini: 'Dothraki_Sea',
  vaes_leisi: 'Dothraki_Sea',
  vaes_leqse: 'Dothraki_Sea',
  vaes_mejhah: 'Dothraki_Sea',
  vaes_orvik: 'Dothraki_Sea',
  vaes_qosar: 'Dothraki_Sea',
  vaes_shirosi: 'Dothraki_Sea',
  vaes_tolorro: 'Red_Waste',
  yinishar: 'Dothraki_Sea',
  vaes_qolahn: 'Dothraki_Sea',
  kdath: 'Dothraki_Sea',
  si_qo: 'Yi_Ti',
  tiqui: 'Yi_Ti',
  turrani: 'Leng',
  trader_town: 'Yi_Ti',
  port_yhos: 'Summer_Sea',
  vahar: 'Great_Moraq',
  // The-prefixed and alternate settlements
  the_dreadfort: 'Dreadfort',
  nightfort: 'Nightfort',
  shadow_tower: 'Shadow_Tower',
  quiet_isle: 'Quiet_Isle',
  the_twins: 'Twins',
  bloody_gate: 'Bloody_Gate',
  eyrie: 'Eyrie',
  the_crag: 'Crag',
  golden_tooth: 'Golden_Tooth',
  the_whispers: 'Whispers',
  the_arbor: 'Arbor',
  the_tor: 'Tor',
  water_gardens: 'Water_Gardens',
  vaes_graddakh: 'Sar_Mell',
  five_forts: 'Five_Forts',
  faros: 'Great_Moraq',
  black_fort: 'Ax_Isle',
  port_lotus: 'Summer_Isles',
  gogossos: 'Sothoryos',
  yeen: 'Sothoryos',
  zamettar: 'Sothoryos'
};

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function verifyAllSettlementUrls() {
  const nodes = Object.values(NODES);
  console.log(`Verifying wiki URLs for all ${nodes.length} nodes...`);

  // Build tentative title for each node
  const nodeToTitle: Record<string, string> = {};
  for (const node of nodes) {
    if (KNOWN_OVERRIDES[node.id]) {
      nodeToTitle[node.id] = KNOWN_OVERRIDES[node.id];
    } else {
      // Default canonical clean title
      let clean = node.name.replace(/\(.*?\)/g, '').trim();
      nodeToTitle[node.id] = clean.replace(/ /g, '_');
    }
  }

  // Get all unique titles to check against MediaWiki API
  const uniqueTitles = Array.from(new Set(Object.values(nodeToTitle)));
  console.log(`Checking ${uniqueTitles.length} unique titles on Fandom...`);

  const chunks = chunkArray(uniqueTitles, 45);
  const titleStatus: Record<string, { pageid: number; title: string; missing: boolean }> = {};

  for (let i = 0; i < chunks.length; i++) {
    const ch = chunks[i];
    const url = `https://gameofthrones.fandom.com/api.php?action=query&titles=${encodeURIComponent(ch.join('|'))}&format=json&redirects=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'GoTMapExplorer/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    
    // Track redirects
    const redirects = new Map<string, string>();
    if (json.query?.redirects) {
      for (const r of json.query.redirects) {
        redirects.set(r.from.toLowerCase(), r.to);
      }
    }

    for (const p of Object.values(json.query?.pages || {}) as any[]) {
      if (p.missing !== undefined) {
        titleStatus[p.title.toLowerCase()] = { pageid: -1, title: p.title, missing: true };
      } else {
        titleStatus[p.title.toLowerCase()] = { pageid: p.pageid, title: p.title, missing: false };
      }
    }
  }

  // Verify every node
  let missingCount = 0;
  let successCount = 0;
  const verifiedMap: Record<string, { name: string; wikiTitle: string; wikiUrl: string; pageid: number }> = {};

  for (const node of nodes) {
    const proposed = nodeToTitle[node.id];
    // Check in titleStatus (case insensitive)
    const hit = titleStatus[proposed.toLowerCase().replace(/_/g, ' ')];

    if (hit && !hit.missing) {
      successCount++;
      const canonicalTitle = hit.title;
      const wikiUrl = `https://gameofthrones.fandom.com/wiki/${encodeURIComponent(canonicalTitle.replace(/ /g, '_'))}`;
      verifiedMap[node.id] = {
        name: node.name,
        wikiTitle: canonicalTitle,
        wikiUrl,
        pageid: hit.pageid
      };
    } else {
      console.error(`❌ Missing page for node ${node.id} ("${node.name}") with proposed "${proposed}"!`);
      missingCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Verified valid Fandom pages: ${successCount} / ${nodes.length} (${((successCount / nodes.length) * 100).toFixed(1)}%)`);
  console.log(`Missing pages: ${missingCount}`);
  console.log(`========================================\n`);

  if (missingCount === 0) {
    // Save verified mapping
    const outPath = path.resolve('./scripts/data/verified_settlement_wikis.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(verifiedMap, null, 2), 'utf-8');
    console.log(`Saved 100% verified wiki mapping to: ${outPath}`);
  }
}

verifyAllSettlementUrls().catch(err => console.error(err));
