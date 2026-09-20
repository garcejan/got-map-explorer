import type { RouteEdge, RouteLeg, RouteResult, TravelParty, RoutingPreference, OptimizationGoal, TerrainType, JourneyStage } from '../types';
import { NODES } from '../data/nodes';
import { ROADS } from '../data/roads';
import { SEA_LANES } from '../data/seaLanes';
import { REGIONAL_CONNECTORS } from '../data/regionalConnectors';
import { TRAVEL_PARTIES, TERRAIN_MODIFIERS, PORT_TRANSITION_DAYS } from './parties';
import { toLeafletLatLng, pixelDistance, pixelsToMiles, pixelsToKm, pixelsToLeagues } from './scale';

interface GraphEdge {
  targetId: string;
  edge: RouteEdge;
  reversed: boolean;
}

// Build adjacency list
function buildGraph(): Map<string, GraphEdge[]> {
  const adj = new Map<string, GraphEdge[]>();

  for (const nodeId of Object.keys(NODES)) {
    adj.set(nodeId, []);
  }

  const allEdges: RouteEdge[] = [...ROADS, ...SEA_LANES, ...REGIONAL_CONNECTORS];

  for (const edge of allEdges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);

    adj.get(edge.from)!.push({
      targetId: edge.to,
      edge,
      reversed: false
    });

    adj.get(edge.to)!.push({
      targetId: edge.from,
      edge,
      reversed: true
    });
  }

  return adj;
}

const GRAPH = buildGraph();

interface LegCalculation {
  legs: RouteLeg[];
  totalMiles: number;
  totalKm: number;
  totalLeagues: number;
  totalDays: number;
}

/**
 * Single-leg Dijkstra pathfinding between two nodes
 */
function findSingleLeg(
  startId: string,
  endId: string,
  party: TravelParty,
  mode: RoutingPreference,
  goal: OptimizationGoal = 'balanced'
): LegCalculation | null {
  if (startId === endId) {
    return { legs: [], totalMiles: 0, totalKm: 0, totalLeagues: 0, totalDays: 0 };
  }

  // Handle Messenger Crow / Raven and Dragon direct aerial transit
  // Aerial transit is strictly allowed only if the party is capable of flight
  // and mode is not constrained to surface-only (land_only or sea_only)
  const isCrowParty = party.id === 'crow' || party.id === 'raven';
  const isDragonParty = party.id === 'dragon';
  const partyCanFly = Boolean(party.canFly || isCrowParty || isDragonParty);

  const isCrowFlight = partyCanFly && (isCrowParty || mode === 'crow_flight') && mode !== 'land_only' && mode !== 'sea_only';
  const isDragonFlight = partyCanFly && (isDragonParty || mode === 'dragon') && mode !== 'land_only' && mode !== 'sea_only';
  const canFly = isCrowFlight || isDragonFlight;

  if (canFly) {
    const isCrow = isCrowFlight;
    const startNode = NODES[startId];
    const endNode = NODES[endId];
    if (!startNode || !endNode) return null;

    const pxDist = pixelDistance(startNode.coords, endNode.coords);
    const distMiles = Math.round(pixelsToMiles(pxDist));
    const distKm = Math.round(pixelsToKm(pxDist));
    const distLeagues = Math.round(pixelsToLeagues(pxDist));
    const flightSpeed = isCrow
      ? (TRAVEL_PARTIES.crow?.landSpeedMilesPerDay || 240)
      : (party.id === 'dragon' ? party.landSpeedMilesPerDay : (TRAVEL_PARTIES.dragon?.landSpeedMilesPerDay || 520));
    const transitDays = Math.max(0.1, Number((distMiles / flightSpeed).toFixed(1)));

    const syntheticEdge: RouteEdge = {
      id: `flight_${startId}_${endId}`,
      from: startId,
      to: endId,
      name: isCrow
        ? `Direct Rookery Flight (as the Crow Flies): ${startNode.name} to ${endNode.name}`
        : `Direct Dragon Flight: ${startNode.name} to ${endNode.name}`,
      segmentType: 'flight',
      terrainType: 'royal_road',
      waypoints: [startNode.coords, endNode.coords],
      distanceMiles: distMiles,
      distanceKm: distKm,
      distanceLeagues: distLeagues,
      isCustom: true
    };

    const leg: RouteLeg = {
      edge: syntheticEdge,
      fromNode: startNode,
      toNode: endNode,
      distanceMiles: distMiles,
      distanceKm: distKm,
      distanceLeagues: distLeagues,
      transitDays,
      terrainType: 'royal_road',
      segmentType: 'flight',
      waypoints: [toLeafletLatLng(startNode.coords), toLeafletLatLng(endNode.coords)]
    };

    return {
      legs: [leg],
      totalMiles: distMiles,
      totalKm: distKm,
      totalLeagues: distLeagues,
      totalDays: transitDays
    };
  }

  // Fallback for non-flying party if mode was accidentally left as flight
  const effectiveMode = (!partyCanFly && (mode === 'crow_flight' || mode === 'dragon')) ? 'balanced' : mode;

  const costs = new Map<string, number>();
  const times = new Map<string, number>();
  const distsMiles = new Map<string, number>();
  const distsKm = new Map<string, number>();
  const distsLeagues = new Map<string, number>();
  const prevNode = new Map<string, string>();
  const prevGraphEdge = new Map<string, GraphEdge>();
  const unvisited = new Set<string>(Object.keys(NODES));

  for (const nodeId of Object.keys(NODES)) {
    costs.set(nodeId, Infinity);
    times.set(nodeId, Infinity);
    distsMiles.set(nodeId, 0);
    distsKm.set(nodeId, 0);
    distsLeagues.set(nodeId, 0);
  }

  costs.set(startId, 0);
  times.set(startId, 0);

  while (unvisited.size > 0) {
    let curr: string | null = null;
    let minCost = Infinity;

    for (const nodeId of unvisited) {
      const c = costs.get(nodeId)!;
      if (c < minCost) {
        minCost = c;
        curr = nodeId;
      }
    }

    if (!curr || minCost === Infinity || curr === endId) {
      break;
    }

    unvisited.delete(curr);
    const neighbors = GRAPH.get(curr) || [];

    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.targetId)) continue;

      const edge = neighbor.edge;

      // Mode restrictions
      if (effectiveMode === 'land_only' && edge.segmentType === 'sea') continue;
      if (effectiveMode === 'sea_only' && edge.segmentType === 'land') continue;

      // Calculate effective speed based on party type and terrain
      const baseSpeed = edge.segmentType === 'sea'
        ? party.seaSpeedMilesPerDay
        : party.landSpeedMilesPerDay;

      const terrainMod = TERRAIN_MODIFIERS[edge.terrainType]?.speedMultiplier || 1.0;
      const effectiveSpeed = baseSpeed * terrainMod;

      let segmentDays = edge.distanceMiles / effectiveSpeed;

      // Port transition penalty when switching from land to sea or vice versa
      const priorEdge = prevGraphEdge.get(curr);
      const isSwitchingMode = priorEdge && priorEdge.edge.segmentType !== edge.segmentType;
      if (isSwitchingMode) {
        segmentDays += PORT_TRANSITION_DAYS;
      }

      // Edge cost according to optimization goal
      let edgeCost = segmentDays;
      if (goal === 'shortest') {
        // Pure shortest distance in miles
        edgeCost = edge.distanceMiles;
      } else if (goal === 'fastest') {
        // Pure fastest travel days
        edgeCost = segmentDays;
      } else {
        // 'balanced': optimal route
        // Heavy land parties (wheelhouses, baggage trains, ox carts) have natural friction boarding ships for routine overland trips
        const isHeavyOverland = party.id === 'retinue' || party.id === 'army' || party.id === 'caravan';
        const seaFriction = (isHeavyOverland && edge.segmentType === 'sea') ? (edge.distanceMiles * 0.05 + 10) : 0;
        edgeCost = segmentDays + (edge.distanceMiles * 0.02) + seaFriction;
      }

      const newCost = costs.get(curr)! + edgeCost;
      const newTime = times.get(curr)! + segmentDays;

      if (newCost < costs.get(neighbor.targetId)!) {
        costs.set(neighbor.targetId, newCost);
        times.set(neighbor.targetId, newTime);
        distsMiles.set(neighbor.targetId, distsMiles.get(curr)! + edge.distanceMiles);
        distsKm.set(neighbor.targetId, distsKm.get(curr)! + edge.distanceKm);
        distsLeagues.set(neighbor.targetId, distsLeagues.get(curr)! + edge.distanceLeagues);
        prevNode.set(neighbor.targetId, curr);
        prevGraphEdge.set(neighbor.targetId, neighbor);
      }
    }
  }

  if (times.get(endId) === Infinity) {
    // If strict corridor constraint (land_only or sea_only) prevented finding a path across water/land,
    // retry with balanced multi-modal routing so a route can always be planned.
    if (effectiveMode !== 'balanced') {
      const relaxedResult = findSingleLeg(startId, endId, party, 'balanced', goal);
      if (relaxedResult) return relaxedResult;
    }

    // Direct expedition approach as ultimate safety net
    const startNode = NODES[startId];
    const endNode = NODES[endId];
    if (!startNode || !endNode) return null;

    const pxDist = pixelDistance(startNode.coords, endNode.coords);
    const distMiles = Math.max(1, Math.round(pixelsToMiles(pxDist)));
    const distKm = Math.max(1, Math.round(pixelsToKm(pxDist)));
    const distLeagues = Math.max(1, Math.round(pixelsToLeagues(pxDist)));
    const baseSpeed = Math.max(1, party.landSpeedMilesPerDay);
    const transitDays = Math.max(0.1, Number((distMiles / baseSpeed).toFixed(1)));

    const fallbackEdge: RouteEdge = {
      id: `conn_${startId}_${endId}`,
      from: startId,
      to: endId,
      name: `Expedition Route: ${startNode.name} to ${endNode.name}`,
      segmentType: 'land',
      terrainType: 'dirt_track',
      waypoints: [startNode.coords, endNode.coords],
      distanceMiles: distMiles,
      distanceKm: distKm,
      distanceLeagues: distLeagues,
      isCustom: true
    };

    return {
      legs: [{
        edge: fallbackEdge,
        fromNode: startNode,
        toNode: endNode,
        distanceMiles: distMiles,
        distanceKm: distKm,
        distanceLeagues: distLeagues,
        transitDays,
        terrainType: 'dirt_track',
        segmentType: 'land',
        waypoints: [toLeafletLatLng(startNode.coords), toLeafletLatLng(endNode.coords)]
      }],
      totalMiles: distMiles,
      totalKm: distKm,
      totalLeagues: distLeagues,
      totalDays: transitDays
    };
  }

  // Reconstruct path
  const legs: RouteLeg[] = [];
  let curr = endId;

  while (curr !== startId) {
    const pNode = prevNode.get(curr);
    const gEdge = prevGraphEdge.get(curr);
    if (!pNode || !gEdge) break;

    const fromNode = NODES[pNode];
    const toNode = NODES[curr];
    const edge = gEdge.edge;

    // Waypoints in travel direction
    const rawWaypoints = gEdge.reversed
      ? [...edge.waypoints].reverse()
      : [...edge.waypoints];

    const leafletCoords = rawWaypoints.map(wp => toLeafletLatLng(wp));

    const baseSpeed = edge.segmentType === 'sea'
      ? party.seaSpeedMilesPerDay
      : party.landSpeedMilesPerDay;
    const terrainMod = TERRAIN_MODIFIERS[edge.terrainType]?.speedMultiplier || 1.0;
    const legTransitDays = Number((edge.distanceMiles / (baseSpeed * terrainMod)).toFixed(1));

    legs.unshift({
      edge,
      fromNode,
      toNode,
      distanceMiles: edge.distanceMiles,
      distanceKm: edge.distanceKm,
      distanceLeagues: edge.distanceLeagues,
      transitDays: legTransitDays,
      terrainType: edge.terrainType,
      segmentType: edge.segmentType,
      waypoints: leafletCoords
    });

    curr = pNode;
  }

  return {
    legs,
    totalMiles: distsMiles.get(endId)!,
    totalKm: distsKm.get(endId)!,
    totalLeagues: distsLeagues.get(endId)!,
    totalDays: Number(times.get(endId)!.toFixed(1))
  };
}

/**
 * Optimize waypoint visitation sequence to minimize overall journey cost/distance
 * using branch-and-bound exact TSP solver.
 */
export function optimizeWaypointOrder(
  originId: string,
  destinationId: string,
  waypointIds: string[],
  partyId: string = 'messenger',
  mode: RoutingPreference = 'balanced',
  goal: OptimizationGoal = 'balanced'
): string[] {
  const validWaypoints = waypointIds.filter(id => id && NODES[id]);
  if (validWaypoints.length <= 1) {
    return waypointIds;
  }

  const party = TRAVEL_PARTIES[partyId] || TRAVEL_PARTIES.messenger;
  const memo = new Map<string, number>();

  const getCost = (from: string, to: string): number => {
    if (from === to) return 0;
    const key = `${from}__${to}`;
    if (memo.has(key)) return memo.get(key)!;
    const res = findSingleLeg(from, to, party, mode, goal);
    if (!res) {
      memo.set(key, 999999);
      return 999999;
    }
    const cost = goal === 'shortest'
      ? res.totalMiles
      : goal === 'fastest'
      ? res.totalDays
      : res.totalDays * 15 + res.totalMiles * 0.05;
    memo.set(key, cost);
    return cost;
  };

  let bestOrder = [...validWaypoints];
  let minCost = Infinity;

  const backtrack = (currentOrder: string[], remaining: string[], currentCost: number) => {
    if (currentCost >= minCost) return;

    if (remaining.length === 0) {
      const finalCost = currentCost + getCost(currentOrder[currentOrder.length - 1], destinationId);
      if (finalCost < minCost) {
        minCost = finalCost;
        bestOrder = [...currentOrder];
      }
      return;
    }

    const prevNode = currentOrder.length === 0 ? originId : currentOrder[currentOrder.length - 1];

    for (let i = 0; i < remaining.length; i++) {
      const nextNode = remaining[i];
      const stepCost = getCost(prevNode, nextNode);
      if (currentCost + stepCost >= minCost) continue;

      const nextRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
      currentOrder.push(nextNode);
      backtrack(currentOrder, nextRemaining, currentCost + stepCost);
      currentOrder.pop();
    }
  };

  backtrack([], validWaypoints, 0);

  // Preserve positions of valid waypoints and empty slots
  const result: string[] = [];
  let optIdx = 0;
  for (const orig of waypointIds) {
    if (orig && NODES[orig]) {
      result.push(bestOrder[optIdx++]);
    } else {
      result.push(orig);
    }
  }

  return result;
}

/**
 * Plan full journey including intermediate waypoints
 */
export function calculateRealisticRoute(
  originId: string,
  destinationId: string,
  waypointIds: string[] = [],
  partyId: string = 'messenger',
  mode: RoutingPreference = 'balanced',
  goal: OptimizationGoal = 'balanced',
  autoOptimizeWaypoints: boolean = false
): RouteResult | null {
  const origin = NODES[originId];
  const destination = NODES[destinationId];
  const party = TRAVEL_PARTIES[partyId] || TRAVEL_PARTIES.messenger;

  if (!origin || !destination) return null;

  const validWaypoints = waypointIds.filter(id => id && NODES[id]);
  let effectiveWaypoints = waypointIds;

  if (autoOptimizeWaypoints && validWaypoints.length > 1) {
    effectiveWaypoints = optimizeWaypointOrder(originId, destinationId, waypointIds, partyId, mode, goal);
  }

  const activeWaypoints = effectiveWaypoints.filter(id => id && NODES[id]);
  const itineraryNodeIds = [originId, ...activeWaypoints, destinationId];

  const allLegs: RouteLeg[] = [];
  const journeyStages: JourneyStage[] = [];
  let totalMiles = 0;
  let totalKm = 0;
  let totalLeagues = 0;
  let totalDays = 0;

  for (let i = 0; i < itineraryNodeIds.length - 1; i++) {
    const legStart = itineraryNodeIds[i];
    const legEnd = itineraryNodeIds[i + 1];

    const legResult = findSingleLeg(legStart, legEnd, party, mode, goal);
    if (!legResult) {
      return null;
    }

    allLegs.push(...legResult.legs);
    totalMiles += legResult.totalMiles;
    totalKm += legResult.totalKm;
    totalLeagues += legResult.totalLeagues;
    totalDays += legResult.totalDays;

    journeyStages.push({
      stageIndex: i + 1,
      fromNode: NODES[legStart],
      toNode: NODES[legEnd],
      distanceMiles: legResult.totalMiles,
      distanceKm: legResult.totalKm,
      distanceLeagues: legResult.totalLeagues,
      totalDays: Number(legResult.totalDays.toFixed(1)),
      legs: legResult.legs
    });
  }

  // Detect whether the user's current manual waypoint ordering causes avoidable backtracking
  let isSuboptimalOrder = false;
  let optimizedWaypointIds: string[] | undefined = undefined;
  let potentialSavingsMiles: number | undefined = undefined;
  let potentialSavingsDays: number | undefined = undefined;

  if (!autoOptimizeWaypoints && activeWaypoints.length >= 2) {
    const optimized = optimizeWaypointOrder(originId, destinationId, waypointIds, partyId, mode, goal);
    const isDifferent = optimized.some((id, idx) => id !== waypointIds[idx]);
    if (isDifferent) {
      const optResult = calculateRealisticRoute(originId, destinationId, optimized, partyId, mode, goal, true);
      if (optResult && optResult.totalMiles < totalMiles - 15) {
        isSuboptimalOrder = true;
        optimizedWaypointIds = optimized;
        potentialSavingsMiles = Math.round(totalMiles - optResult.totalMiles);
        potentialSavingsDays = Number(Math.max(0.1, totalDays - optResult.totalDays).toFixed(1));
      }
    }
  }

  // Build continuous coordinate list
  const allCoordinates: [number, number][] = [];
  for (let i = 0; i < allLegs.length; i++) {
    const leg = allLegs[i];
    if (i === 0) {
      allCoordinates.push(...leg.waypoints);
    } else {
      // Avoid duplicate junction points
      allCoordinates.push(...leg.waypoints.slice(1));
    }
  }

  let landMiles = 0;
  let seaMiles = 0;
  const terrainDistances = new Map<TerrainType, number>();

  for (const leg of allLegs) {
    if (leg.segmentType === 'sea') {
      seaMiles += leg.distanceMiles;
    } else {
      landMiles += leg.distanceMiles;
    }

    const currentDist = terrainDistances.get(leg.terrainType) || 0;
    terrainDistances.set(leg.terrainType, currentDist + leg.distanceMiles);
  }

  const terrainBreakdown = Array.from(terrainDistances.entries()).map(([terrain, miles]) => {
    const mod = TERRAIN_MODIFIERS[terrain];
    const pct = totalMiles > 0 ? Math.round((miles / totalMiles) * 100) : 0;
    return {
      terrain,
      label: mod?.label || terrain,
      miles,
      percentage: pct,
      color: mod?.color || '#dfb15b'
    };
  }).sort((a, b) => b.miles - a.miles);

  // Detect regional hazards
  const hazards: string[] = [];
  if (party.id === 'crow' || party.id === 'raven') {
    hazards.push('Aerial Message Hazards: Ironborn falcons, winter gale crosswinds, and starvation over open water.');
  }
  if (allLegs.some(l => l.edge.terrainType === 'swamp_causeway')) {
    hazards.push('The Neck Causeway: Treacherous bog conditions, fever, and hidden crannogmen ambush points.');
  }
  if (allLegs.some(l => l.edge.terrainType === 'mountain_pass')) {
    hazards.push('Mountain Passes: Threat of rockfalls, freezing passes, and mountain clan raiders.');
  }
  if (allLegs.some(l => l.edge.terrainType === 'northern_snow')) {
    hazards.push('Northern Frost: Deep winter snowdrifts and sub-zero blizzards.');
  }
  if (allLegs.some(l => l.edge.terrainType === 'dangerous_sea')) {
    hazards.push('Perilous Waters: Pirate sails off the Stepstones and sudden Shipbreaker Bay squalls.');
  }
  if (allLegs.some(l => l.edge.id.includes('demon_road'))) {
    hazards.push('The Demon Road: Cursed ruins, demon mists, and skinchangers of Mantarys.');
  }
  if (allLegs.some(l => l.edge.terrainType === 'desert_waste')) {
    hazards.push('Arid Waste: Extreme heat and scarce water wells along the sun-bleached dunes.');
  }

  return {
    routeFound: true,
    totalMiles,
    totalKm,
    totalLeagues,
    totalDays: Number(totalDays.toFixed(1)),
    landMiles,
    seaMiles,
    legs: allLegs,
    journeyStages,
    allCoordinates,
    terrainBreakdown,
    origin,
    destination,
    waypointsVisited: activeWaypoints.map(id => NODES[id]).filter(Boolean),
    party,
    mode,
    optimizationGoal: goal,
    hazards,
    isSuboptimalOrder,
    optimizedWaypointIds,
    potentialSavingsMiles,
    potentialSavingsDays
  };
}

/**
 * Compare alternative routing strategies
 */
export function calculateRouteAlternatives(
  originId: string,
  destinationId: string,
  partyId: string
): {
  balanced: RouteResult | null;
  shortest: RouteResult | null;
  overland: RouteResult | null;
  maritime: RouteResult | null;
  crow: RouteResult | null;
  dragon: RouteResult | null;
} {
  // If active party is an aerial traveler (crow or dragon), evaluate surface corridors using retinue
  const surfacePartyId = (partyId === 'crow' || partyId === 'dragon') ? 'retinue' : partyId;

  return {
    balanced: calculateRealisticRoute(originId, destinationId, [], surfacePartyId, 'balanced', 'balanced'),
    shortest: calculateRealisticRoute(originId, destinationId, [], surfacePartyId, 'balanced', 'shortest'),
    overland: calculateRealisticRoute(originId, destinationId, [], surfacePartyId, 'land_only', 'balanced'),
    maritime: calculateRealisticRoute(originId, destinationId, [], surfacePartyId, 'sea_only', 'balanced'),
    crow: calculateRealisticRoute(originId, destinationId, [], 'crow', 'crow_flight', 'balanced'),
    dragon: calculateRealisticRoute(originId, destinationId, [], 'dragon', 'dragon', 'balanced')
  };
}
