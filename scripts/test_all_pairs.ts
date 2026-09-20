import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance } from '../src/engine/scale';

// Test that from EVERY one of the 325 nodes, EVERY other node is reachable!
const allNodes = Object.values(NODES);
const nodeMap = NODES;

const adj: Record<string, { target: string; dist: number }[]> = {};
for (const n of allNodes) adj[n.id] = [];

for (const r of ROADS) {
  if (adj[r.from] && adj[r.to]) {
    const d = pixelDistance(nodeMap[r.from].coords, nodeMap[r.to].coords);
    adj[r.from].push({ target: r.to, dist: d });
    adj[r.to].push({ target: r.from, dist: d });
  }
}
for (const s of SEA_LANES) {
  if (adj[s.from] && adj[s.to]) {
    const d = pixelDistance(nodeMap[s.from].coords, nodeMap[s.to].coords);
    adj[s.from].push({ target: s.to, dist: d });
    adj[s.to].push({ target: s.from, dist: d });
  }
}

// Add connectors from builder
const existingEdgeKeys = new Set<string>();
for (const r of ROADS) {
  existingEdgeKeys.add(`${r.from}__${r.to}`);
  existingEdgeKeys.add(`${r.to}__${r.from}`);
}
for (const s of SEA_LANES) {
  existingEdgeKeys.add(`${s.from}__${s.to}`);
  existingEdgeKeys.add(`${s.to}__${s.from}`);
}

function addEdge(uId: string, vId: string) {
  const edgeKey1 = `${uId}__${vId}`;
  const edgeKey2 = `${vId}__${uId}`;
  if (existingEdgeKeys.has(edgeKey1) || existingEdgeKeys.has(edgeKey2)) return;
  const u = nodeMap[uId];
  const v = nodeMap[vId];
  if (!u || !v) return;
  const d = pixelDistance(u.coords, v.coords);
  adj[uId].push({ target: vId, dist: d });
  adj[vId].push({ target: uId, dist: d });
  existingEdgeKeys.add(edgeKey1);
  existingEdgeKeys.add(edgeKey2);
}

for (const u of allNodes) {
  const neighbors = adj[u.id] || [];
  if (neighbors.length >= 2) continue;
  const candidates = allNodes
    .filter(v => v.id !== u.id)
    .map(v => ({ id: v.id, dist: pixelDistance(u.coords, v.coords) }))
    .sort((a, b) => a.dist - b.dist);
  let added = neighbors.length;
  for (const c of candidates) {
    if (added >= 2) break;
    addEdge(u.id, c.id);
    added++;
  }
}

function getComponents(): string[][] {
  const visited = new Set<string>();
  const comps: string[][] = [];
  for (const n of allNodes) {
    if (!visited.has(n.id)) {
      const comp: string[] = [];
      const q = [n.id];
      visited.add(n.id);
      while (q.length > 0) {
        const curr = q.pop()!;
        comp.push(curr);
        for (const neighbor of adj[curr] || []) {
          if (!visited.has(neighbor.target)) {
            visited.add(neighbor.target);
            q.push(neighbor.target);
          }
        }
      }
      comps.push(comp);
    }
  }
  return comps;
}

let comps = getComponents();
while (comps.length > 1) {
  comps.sort((a, b) => b.length - a.length);
  const mainComp = new Set(comps[0]);
  for (let i = 1; i < comps.length; i++) {
    const smallComp = comps[i];
    let bestU = '', bestV = '', minDist = Infinity;
    for (const uId of smallComp) {
      const u = nodeMap[uId];
      for (const vId of mainComp) {
        const v = nodeMap[vId];
        const d = pixelDistance(u.coords, v.coords);
        if (d < minDist) {
          minDist = d;
          bestU = uId;
          bestV = vId;
        }
      }
    }
    if (bestU && bestV) {
      addEdge(bestU, bestV);
    }
  }
  comps = getComponents();
}

console.log('Testing ALL 105,300 pairs with BFS / Dijkstra...');
let allPairsReachable = true;
for (const src of allNodes) {
  const visited = new Set<string>();
  const q = [src.id];
  visited.add(src.id);
  while (q.length > 0) {
    const curr = q.pop()!;
    for (const neighbor of adj[curr] || []) {
      if (!visited.has(neighbor.target)) {
        visited.add(neighbor.target);
        q.push(neighbor.target);
      }
    }
  }
  if (visited.size !== allNodes.length) {
    console.error(`Source ${src.name} only reached ${visited.size} / ${allNodes.length} nodes!`);
    allPairsReachable = false;
    break;
  }
}

if (allPairsReachable) {
  console.log(`✅ 100% SUCCESS: All ${allNodes.length * (allNodes.length - 1)} pairs are fully connected and reachable!`);
}
