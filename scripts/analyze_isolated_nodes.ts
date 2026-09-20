import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';

const connected = new Set<string>();
for (const r of ROADS) {
  connected.add(r.from);
  connected.add(r.to);
}
for (const s of SEA_LANES) {
  connected.add(s.from);
  connected.add(s.to);
}

const isolated = Object.values(NODES).filter(n => !connected.has(n.id));
console.log(`Isolated nodes count: ${isolated.length} / ${Object.keys(NODES).length}`);

// Group by region
const byRegion: Record<string, typeof isolated> = {};
for (const n of isolated) {
  if (!byRegion[n.region]) byRegion[n.region] = [];
  byRegion[n.region].push(n);
}

for (const [region, nodes] of Object.entries(byRegion)) {
  console.log(`Region: ${region} (${nodes.length} isolated nodes)`);
  console.log(`  Sample: ${nodes.slice(0, 5).map(n => `${n.name} [${n.type}, isPort=${n.isPort || false}]`).join(', ')}`);
}
