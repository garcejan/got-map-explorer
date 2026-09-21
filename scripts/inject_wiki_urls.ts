import fs from 'fs';
import path from 'path';

const verifiedPath = path.resolve('./scripts/data/verified_settlement_wikis.json');
const nodesPath = path.resolve('./src/data/nodes.ts');

const verifiedMap = JSON.parse(fs.readFileSync(verifiedPath, 'utf-8'));
let nodesContent = fs.readFileSync(nodesPath, 'utf-8');

let updatedCount = 0;

for (const [nodeId, info] of Object.entries(verifiedMap) as [string, any][]) {
  const wikiUrl = info.wikiUrl;
  
  // Find node definition block: e.g. "  nodeId: {"
  const nodeDefRegex = new RegExp(`(\\b${nodeId}:\\s*\\{[\\s\\S]*?\\n\\s*\\},)`, 'm');
  const match = nodesContent.match(nodeDefRegex);

  if (!match) {
    console.error(`Could not find block for nodeId: ${nodeId}`);
    continue;
  }

  const block = match[1];

  // If already has wikiUrl, skip or replace
  let newBlock: string;
  if (block.includes('wikiUrl:')) {
    newBlock = block.replace(/wikiUrl:\s*".*?",?/, `wikiUrl: "${wikiUrl}",`);
  } else if (block.includes('loreSnippet:')) {
    // Insert after loreSnippet
    newBlock = block.replace(
      /(loreSnippet:\s*".*?",?\n)/,
      `$1    wikiUrl: "${wikiUrl}",\n`
    );
  } else {
    // Insert before closing brace
    newBlock = block.replace(
      /(\n\s*\},)/,
      `\n    wikiUrl: "${wikiUrl}",$1`
    );
  }

  if (newBlock !== block) {
    nodesContent = nodesContent.replace(block, newBlock);
    updatedCount++;
  }
}

console.log(`Updated ${updatedCount} nodes with wikiUrl in src/data/nodes.ts`);
fs.writeFileSync(nodesPath, nodesContent, 'utf-8');
