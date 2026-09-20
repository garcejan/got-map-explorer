import { calculateRealisticRoute, optimizeWaypointOrder } from '../src/engine/pathfinder';

const waypoints = ['barrowton', 'white_harbor', 'eyrie'];
console.log('Original waypoints:', waypoints);

const optimized = optimizeWaypointOrder('kings_landing', 'winterfell', waypoints, 'retinue', 'balanced', 'balanced');
console.log('Optimized waypoints:', optimized);

const rUnopt = calculateRealisticRoute('kings_landing', 'winterfell', waypoints, 'retinue', 'balanced', 'balanced');
console.log('Unoptimized result:', {
  totalMiles: rUnopt?.totalMiles,
  totalDays: rUnopt?.totalDays,
  isSuboptimalOrder: rUnopt?.isSuboptimalOrder,
  potentialSavingsMiles: rUnopt?.potentialSavingsMiles,
  potentialSavingsDays: rUnopt?.potentialSavingsDays,
  stages: rUnopt?.journeyStages?.map(s => `${s.fromNode.name} -> ${s.toNode.name} (${s.distanceMiles} mi)`)
});

const rOpt = calculateRealisticRoute('kings_landing', 'winterfell', optimized, 'retinue', 'balanced', 'balanced');
console.log('Optimized result:', {
  totalMiles: rOpt?.totalMiles,
  totalDays: rOpt?.totalDays,
  isSuboptimalOrder: rOpt?.isSuboptimalOrder,
  stages: rOpt?.journeyStages?.map(s => `${s.fromNode.name} -> ${s.toNode.name} (${s.distanceMiles} mi)`)
});
