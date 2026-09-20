import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { pixelDistance, pixelsToMiles, pixelsToKm, pixelsToLeagues } from '../src/engine/scale';
import type { RouteEdge, TerrainType } from '../src/types';

// Let us analyze what connections are needed so that EVERY node has at least 1-3 connections
// to its nearest neighbors in its region or along coasts/rivers.

const allNodeList = Object.values(NODES);
const allNodes: Record<string, typeof allNodeList[0]> = NODES;

// Helper to determine terrain type based on region and geography
function getTerrainForNodes(n1: typeof allNodeList[0], n2: typeof allNodeList[0]): TerrainType {
  const r1 = n1.region;
  const r2 = n2.region;
  
  if (r1 === 'north' || r2 === 'north') return 'northern_snow';
  if (r1 === 'dorne' || r2 === 'dorne') {
    if (n1.name.includes('Pass') || n2.name.includes('Pass')) return 'mountain_pass';
    return 'sand_desert';
  }
  if (r1 === 'vale' || r2 === 'vale') return 'mountain_pass';
  if (r1 === 'dothraki_sea' || r2 === 'dothraki_sea') return 'dirt_road';
  if (r1 === 'westerlands' || r2 === 'westerlands') {
    return 'paved_road';
  }
  if (r1 === 'reach' || r2 === 'reach' || r1 === 'crownlands' || r2 === 'crownlands' || r1 === 'riverlands' || r2 === 'riverlands') {
    return 'royal_road';
  }
  if (r1 === 'free_cities' || r2 === 'free_cities' || r1 === 'slavers_bay' || r2 === 'slavers_bay' || r1 === 'yi_ti' || r2 === 'yi_ti') {
    return 'valyrian_road';
  }
  return 'dirt_road';
}

console.log('Total nodes to connect:', allNodeList.length);
