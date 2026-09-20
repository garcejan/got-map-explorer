import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance, pixelsToMiles } from '../src/engine/scale';

const connectedIds = new Set<string>();
for (const r of ROADS) {
  connectedIds.add(r.from);
  connectedIds.add(r.to);
}
for (const s of SEA_LANES) {
  connectedIds.add(s.from);
  connectedIds.add(s.to);
}

const isolated = Object.values(NODES).filter(n => !connectedIds.has(n.id));

for (const n of isolated.slice(0, 20)) {
  let nearestId = '';
  let minDist = Infinity;
  for (const cid of connectedIds) {
    const cnode = NODES[cid];
    if (!cnode) continue;
    const d = pixelDistance(n.coords, cnode.coords);
    if (d < minDist) {
      minDist = d;
      nearestId = cid;
    }
  }
  const miles = Math.round(pixelsToMiles(minDist));
  console.log(`${n.name} (${n.region}) -> nearest connected ${NODES[nearestId].name} (${miles} mi, ${minDist.toFixed(0)} px)`);
}
