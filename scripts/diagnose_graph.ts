import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';

console.log('Roads count:', ROADS.length);
console.log('Sea lanes count:', SEA_LANES.length);

const connected = new Set<string>();
for (const r of ROADS) {
  connected.add(r.from);
  connected.add(r.to);
}
for (const s of SEA_LANES) {
  connected.add(s.from);
  connected.add(s.to);
}

console.log('Connected nodes:', connected.size);
console.log('Total nodes:', Object.keys(NODES).length);
