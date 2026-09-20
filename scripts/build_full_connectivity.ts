import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance, pixelsToMiles, pixelsToKm, pixelsToLeagues } from '../src/engine/scale';
import type { RouteEdge, TerrainType } from '../src/types';

// Check all current connected components
const allNodes = Object.values(NODES);
const allNodeIds = Object.keys(NODES);

console.log(`Analyzing graph for all ${allNodes.length} nodes...`);

// Let's see all islands and port nodes
const portNodes = allNodes.filter(n => n.isPort || n.type === 'port');
console.log(`Port / coastal nodes: ${portNodes.length}`);

// Region classification of nodes
const regions = new Set(allNodes.map(n => n.region));
console.log(`Regions:`, Array.from(regions));
