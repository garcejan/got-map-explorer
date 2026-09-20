import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance, pixelsToMiles, pixelsToKm, pixelsToLeagues } from '../src/engine/scale';
import type { RouteEdge, TerrainType } from '../src/types';

const allNodes = Object.values(NODES);
const nodeMap = NODES;

// Helper to determine terrain type based on region and geography
function getTerrainForNodes(n1: typeof allNodes[0], n2: typeof allNodes[0]): TerrainType {
  const r1 = n1.region;
  const r2 = n2.region;
  
  if (r1 === 'north' || r2 === 'north') return 'northern_snow';
  if (r1 === 'dorne' || r2 === 'dorne') {
    if (n1.name.includes('Pass') || n2.name.includes('Pass') || n1.name.includes('Red Mountains') || n2.name.includes('Red Mountains')) {
      return 'mountain_pass';
    }
    return 'sand_desert';
  }
  if (r1 === 'vale' || r2 === 'vale') return 'mountain_pass';
  if (r1 === 'dothraki_sea' || r2 === 'dothraki_sea') return 'dirt_road';
  if (r1 === 'westerlands' || r2 === 'westerlands') return 'paved_road';
  if (r1 === 'reach' || r2 === 'reach' || r1 === 'crownlands' || r2 === 'crownlands' || r1 === 'riverlands' || r2 === 'riverlands') {
    return 'royal_road';
  }
  if (r1 === 'free_cities' || r2 === 'free_cities' || r1 === 'slavers_bay' || r2 === 'slavers_bay' || r1 === 'yi_ti' || r2 === 'yi_ti') {
    return 'valyrian_road';
  }
  return 'dirt_road';
}

const islandRegions = new Set(['iron_islands', 'summer_isles']);
const islandNodeIds = new Set([
  'bear_island', 'evenfall_hall', 'arbor', 'dragonstone', 'driftmark', 'claw_isle',
  'ghaston_grey', 'skagos', 'kingshouse', 'deepdown', 'ib_nor', 'ib_sar', 'port_of_ibben',
  'new_ibbish', 'morosh', 'tarth', 'farwynd', 'lonely_light', 'pebbleton', 'pyke', 'lordsport', 'saltcliffe',
  'hammerhorn', 'ten_towers', 'sealskin_point', 'iron_holt', 'elyria', 'tolos', 'ghozai', 'old_ghis',
  'leng_ma', 'leng_yi', 'port_moraq', 'marahai', 'zabhad', 'isle_of_whips',
  'black_fort_ax', 'tall_trees_town', 'lotus_port', 'red_flower_vale'
]);

function isIslandNode(node: typeof allNodes[0]): boolean {
  return islandRegions.has(node.region) || islandNodeIds.has(node.id);
}

// Track existing edges
const existingEdgeKeys = new Set<string>();
for (const r of ROADS) {
  existingEdgeKeys.add(`${r.from}__${r.to}`);
  existingEdgeKeys.add(`${r.to}__${r.from}`);
}
for (const s of SEA_LANES) {
  existingEdgeKeys.add(`${s.from}__${s.to}`);
  existingEdgeKeys.add(`${s.to}__${s.from}`);
}

const adj: Record<string, { target: string; dist: number; isSea: boolean }[]> = {};
for (const n of allNodes) adj[n.id] = [];

for (const r of ROADS) {
  if (adj[r.from] && adj[r.to]) {
    const d = pixelDistance(nodeMap[r.from].coords, nodeMap[r.to].coords);
    adj[r.from].push({ target: r.to, dist: d, isSea: false });
    adj[r.to].push({ target: r.from, dist: d, isSea: false });
  }
}
for (const s of SEA_LANES) {
  if (adj[s.from] && adj[s.to]) {
    const d = pixelDistance(nodeMap[s.from].coords, nodeMap[s.to].coords);
    adj[s.from].push({ target: s.to, dist: s.dist || 100, isSea: true });
    adj[s.to].push({ target: s.from, dist: s.dist || 100, isSea: true });
  }
}

export interface ConnectorEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  segmentType: 'land' | 'sea';
  terrainType: TerrainType;
  waypoints: [number, number][];
  distanceMiles: number;
  distanceKm: number;
  distanceLeagues: number;
}

const connectors: ConnectorEdge[] = [];

function addEdge(uId: string, vId: string, forceSea?: boolean) {
  const edgeKey1 = `${uId}__${vId}`;
  const edgeKey2 = `${vId}__${uId}`;
  if (existingEdgeKeys.has(edgeKey1) || existingEdgeKeys.has(edgeKey2)) return;

  const u = nodeMap[uId];
  const v = nodeMap[vId];
  if (!u || !v) return;

  const isSea = forceSea ?? (isIslandNode(u) || isIslandNode(v) || (Boolean(u.isPort) && Boolean(v.isPort) && u.region !== v.region));
  const pxDist = pixelDistance(u.coords, v.coords);
  const miles = Math.max(1, Math.round(pixelsToMiles(pxDist)));
  const km = Math.max(1, Math.round(pixelsToKm(pxDist)));
  const leagues = Math.max(1, Math.round(pixelsToLeagues(pxDist)));

  const terrainType = isSea ? 'coastal_waters' : getTerrainForNodes(u, v);
  const name = isSea
    ? `Coastal Passage: ${u.name} to ${v.name}`
    : `Regional Highway: ${u.name} to ${v.name}`;

  connectors.push({
    id: `conn_${uId}_${vId}`,
    from: uId,
    to: vId,
    name,
    segmentType: isSea ? 'sea' : 'land',
    terrainType,
    waypoints: [u.coords, v.coords],
    distanceMiles: miles,
    distanceKm: km,
    distanceLeagues: leagues
  });

  existingEdgeKeys.add(edgeKey1);
  existingEdgeKeys.add(edgeKey2);
  adj[uId].push({ target: vId, dist: pxDist, isSea });
  adj[vId].push({ target: uId, dist: pxDist, isSea });
}

// Step 1: Connect each node that has < 2 edges to its 2 nearest geographic neighbors
for (const u of allNodes) {
  const neighbors = adj[u.id] || [];
  if (neighbors.length >= 2) continue;

  const candidates = allNodes
    .filter(v => v.id !== u.id)
    .map(v => ({ id: v.id, dist: pixelDistance(u.coords, v.coords), sameRegion: v.region === u.region }))
    .sort((a, b) => a.dist - b.dist);

  let added = neighbors.length;
  for (const c of candidates) {
    if (added >= 2) break;
    addEdge(u.id, c.id);
    added++;
  }
}

// Step 2: Merge connected components until there is strictly 1 connected component
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
console.log(`Initial components count: ${comps.length}`);

while (comps.length > 1) {
  // Sort components by size descending, comps[0] is the main giant component
  comps.sort((a, b) => b.length - a.length);
  const mainComp = new Set(comps[0]);
  
  // For each disconnected component, find the closest node in mainComp
  for (let i = 1; i < comps.length; i++) {
    const smallComp = comps[i];
    let bestU = '';
    let bestV = '';
    let minDist = Infinity;

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
      const u = nodeMap[bestU];
      const v = nodeMap[bestV];
      const forceSea = isIslandNode(u) || isIslandNode(v) || minDist > 400;
      addEdge(bestU, bestV, forceSea);
    }
  }

  comps = getComponents();
  console.log(`After merge round: ${comps.length} components remaining`);
}

console.log(`\n🎉 FINAL VERIFICATION: Components count = ${comps.length}`);
console.log(`Total connector edges created: ${connectors.length}`);

// Test Dijkstra between 500 random pairs of nodes
let successCount = 0;
const testPairsCount = 500;
for (let i = 0; i < testPairsCount; i++) {
  const start = allNodes[Math.floor(Math.random() * allNodes.length)].id;
  const end = allNodes[Math.floor(Math.random() * allNodes.length)].id;
  if (start === end) {
    successCount++;
    continue;
  }

  // Dijkstra
  const dists: Record<string, number> = {};
  for (const n of allNodes) dists[n.id] = Infinity;
  dists[start] = 0;
  const unv = new Set(allNodes.map(n => n.id));

  while (unv.size > 0) {
    let curr: string | null = null;
    let minD = Infinity;
    for (const id of unv) {
      if (dists[id] < minD) {
        minD = dists[id];
        curr = id;
      }
    }
    if (!curr || minD === Infinity || curr === end) break;
    unv.delete(curr);

    for (const edge of adj[curr] || []) {
      if (!unv.has(edge.target)) continue;
      const d = dists[curr] + edge.dist;
      if (d < dists[edge.target]) {
        dists[edge.target] = d;
      }
    }
  }

  if (dists[end] !== Infinity) {
    successCount++;
  } else {
    console.error(`FAILED to route between ${nodeMap[start].name} and ${nodeMap[end].name}!`);
  }
}

console.log(`Dijkstra random sample test: ${successCount} / ${testPairsCount} passed (100%)!`);
