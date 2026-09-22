import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { REGIONAL_CONNECTORS } from '../src/data/regionalConnectors';

const allEdges = [...ROADS, ...SEA_LANES, ...REGIONAL_CONNECTORS];

for (const target of ['spicetown', 'driftmark', 'port_of_ibben', 'nefer', 'sarhoy']) {
  const edges = allEdges.filter(e => e.from === target || e.to === target);
  console.log(`Edges for ${target}:`, edges.map(e => `${e.from} -> ${e.to} (${e.segmentType}, ${e.name})`));
}
