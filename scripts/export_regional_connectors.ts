import * as fs from 'fs';
import * as path from 'path';
import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance } from '../src/engine/scale';
import type { TerrainType } from '../src/types';

const allNodes = Object.values(NODES);
const nodeMap = NODES;

function getTerrainForNodes(n1: typeof allNodes[0], n2: typeof allNodes[0]): TerrainType {
  const r1 = n1.region;
  const r2 = n2.region;
  
  if (r1 === 'north' || r2 === 'north') return 'northern_snow';
  if (r1 === 'dorne' || r2 === 'dorne') {
    if (n1.name.includes('Pass') || n2.name.includes('Pass') || n1.name.includes('Red Mountains') || n2.name.includes('Red Mountains')) {
      return 'mountain_pass';
    }
    return 'desert_waste';
  }
  if (r1 === 'vale' || r2 === 'vale') return 'mountain_pass';
  if (r1 === 'dothraki_sea' || r2 === 'dothraki_sea') return 'dirt_track';
  if (r1 === 'westerlands' || r2 === 'westerlands') return 'paved_highway';
  if (r1 === 'reach' || r2 === 'reach' || r1 === 'crownlands' || r2 === 'crownlands' || r1 === 'riverlands' || r2 === 'riverlands') {
    return 'royal_road';
  }
  if (r1 === 'free_cities' || r2 === 'free_cities' || r1 === 'slavers_bay' || r2 === 'slavers_bay' || r1 === 'yi_ti' || r2 === 'yi_ti') {
    return 'paved_highway';
  }
  return 'dirt_track';
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

interface RawConnector {
  id: string;
  from: string;
  to: string;
  name: string;
  segmentType: 'land' | 'sea';
  terrainType: TerrainType;
  waypoints: [number, number][];
}

const connectors: RawConnector[] = [];

function addEdge(uId: string, vId: string, forceSea?: boolean) {
  const edgeKey1 = `${uId}__${vId}`;
  const edgeKey2 = `${vId}__${uId}`;
  if (existingEdgeKeys.has(edgeKey1) || existingEdgeKeys.has(edgeKey2)) return;

  const u = nodeMap[uId];
  const v = nodeMap[vId];
  if (!u || !v) return;

  const isSea = forceSea ?? (isIslandNode(u) || isIslandNode(v) || (Boolean(u.isPort) && Boolean(v.isPort) && u.region !== v.region));
  const terrainType: TerrainType = isSea ? 'coastal_sea' : getTerrainForNodes(u, v);
  const name = isSea
    ? `Coastal Passage: ${u.name} to ${v.name}`
    : `Regional Road: ${u.name} to ${v.name}`;

  connectors.push({
    id: `conn_${uId}_${vId}`,
    from: uId,
    to: vId,
    name,
    segmentType: isSea ? 'sea' : 'land',
    terrainType,
    waypoints: [u.coords, v.coords]
  });

  existingEdgeKeys.add(edgeKey1);
  existingEdgeKeys.add(edgeKey2);
  adj[uId].push({ target: vId, dist: pixelDistance(u.coords, v.coords), isSea });
  adj[vId].push({ target: uId, dist: pixelDistance(u.coords, v.coords), isSea });
}

// Step 1: Ensure each node has at least 2 connections
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

// Step 2: Merge components until strictly 1 component
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
      const u = nodeMap[bestU];
      const v = nodeMap[bestV];
      const forceSea = isIslandNode(u) || isIslandNode(v) || minDist > 400;
      addEdge(bestU, bestV, forceSea);
    }
  }

  comps = getComponents();
}

console.log(`Generated ${connectors.length} connectors. Components count: ${comps.length}`);

// Generate TypeScript file
const outPath = path.resolve(process.cwd(), 'src/data/regionalConnectors.ts');
const fileHeader = `import type { RouteEdge, TerrainType } from '../types';
import { NODES } from './nodes';
import { calculatePathLengthPixels, pixelsToMiles, pixelsToKm, pixelsToLeagues, sanitizeRouteWaypoints } from '../engine/scale';

interface RawConnector {
  id: string;
  from: string;
  to: string;
  name: string;
  segmentType: 'land' | 'sea';
  terrainType: TerrainType;
  waypoints: [number, number][];
}

function createConnectorEdge(raw: RawConnector): RouteEdge {
  const fromNode = NODES[raw.from];
  const toNode = NODES[raw.to];
  const fromCoords: [number, number] = fromNode ? fromNode.coords : (raw.waypoints[0] || [0, 0]);
  const toCoords: [number, number] = toNode ? toNode.coords : (raw.waypoints[raw.waypoints.length - 1] || [0, 0]);

  const waypoints = sanitizeRouteWaypoints(raw.waypoints, fromCoords, toCoords);

  const lengthPx = calculatePathLengthPixels(waypoints);
  const distanceMiles = Math.max(1, Math.round(pixelsToMiles(lengthPx)));
  const distanceKm = Math.max(1, Math.round(pixelsToKm(lengthPx)));
  const distanceLeagues = Math.max(1, Math.round(pixelsToLeagues(lengthPx)));

  return {
    id: raw.id,
    from: raw.from,
    to: raw.to,
    name: raw.name,
    segmentType: raw.segmentType,
    terrainType: raw.terrainType,
    waypoints,
    distanceMiles,
    distanceKm,
    distanceLeagues
  };
}

const RAW_CONNECTORS: RawConnector[] = ${JSON.stringify(connectors, null, 2)};

export const REGIONAL_CONNECTORS: RouteEdge[] = RAW_CONNECTORS.map(createConnectorEdge);
`;

fs.writeFileSync(outPath, fileHeader, 'utf-8');
console.log(`Successfully written ${connectors.length} connectors to ${outPath}!`);
