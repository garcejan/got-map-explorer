import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { calculateRealisticRoute } from '../src/engine/pathfinder';

console.log('Total nodes in NODES:', Object.keys(NODES).length);

// 1. Check for special characters in node IDs
const problematicIds: string[] = [];
for (const id of Object.keys(NODES)) {
  if (/[^a-zA-Z0-9_-]/.test(id)) {
    problematicIds.push(id);
  }
}
console.log('Nodes with special characters in ID:', problematicIds);

// 2. Check edges connected to nodes
const connectedNodes = new Set<string>();
for (const road of ROADS) {
  connectedNodes.add(road.from);
  connectedNodes.add(road.to);
}
for (const sea of SEA_LANES) {
  connectedNodes.add(sea.from);
  connectedNodes.add(sea.to);
}

const allNodeIds = Object.keys(NODES);
const isolatedNodes = allNodeIds.filter(id => !connectedNodes.has(id));
console.log('Total connected nodes in road/sea graph:', connectedNodes.size);
console.log('Total isolated nodes with 0 road/sea edges:', isolatedNodes.length);
console.log('Sample isolated nodes:', isolatedNodes.slice(0, 30));

// 3. Test graph connectivity components
const adj: Record<string, string[]> = {};
for (const id of allNodeIds) adj[id] = [];
for (const road of ROADS) {
  if (adj[road.from] && adj[road.to]) {
    adj[road.from].push(road.to);
    adj[road.to].push(road.from);
  }
}
for (const sea of SEA_LANES) {
  if (adj[sea.from] && adj[sea.to]) {
    adj[sea.from].push(sea.to);
    adj[sea.to].push(sea.from);
  }
}

const visited = new Set<string>();
const components: string[][] = [];

for (const id of allNodeIds) {
  if (!visited.has(id)) {
    const comp: string[] = [];
    const q = [id];
    visited.add(id);
    while (q.length > 0) {
      const curr = q.pop()!;
      comp.push(curr);
      for (const neighbor of adj[curr] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          q.push(neighbor);
        }
      }
    }
    components.push(comp);
  }
}

console.log('Connected components count:', components.length);
components.sort((a, b) => b.length - a.length);
console.log('Top component sizes:', components.slice(0, 10).map(c => c.length));
for (let i = 1; i < Math.min(10, components.length); i++) {
  console.log(`Component ${i} (${components[i].length} nodes):`, components[i].slice(0, 5));
}
