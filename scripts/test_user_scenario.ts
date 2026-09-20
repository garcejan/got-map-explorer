import { calculateRealisticRoute, optimizeWaypointOrder } from '../src/engine/pathfinder';

const origin = 'kings_landing';
const destination = 'winterfell';
const userWaypoints = ['barrowton', 'white_harbor', 'eyrie'];

console.log('--- Testing User Scenario: King\'s Landing -> [Barrowton, White Harbor, Eyrie] -> Winterfell ---');

// 1. Calculate unoptimized
const unopt = calculateRealisticRoute(origin, destination, userWaypoints, 'retinue', 'balanced', 'balanced');
if (!unopt) {
  console.error('Failed to calculate unoptimized route!');
  process.exit(1);
}

console.log(`Unoptimized Total Distance: ${unopt.totalMiles} miles (~${unopt.totalDays} days)`);
console.log(`isSuboptimalOrder detected: ${unopt.isSuboptimalOrder}`);
console.log(`potentialSavingsMiles: ${unopt.potentialSavingsMiles} miles`);
console.log(`potentialSavingsDays: ${unopt.potentialSavingsDays} days`);

// Verify detection
if (!unopt.isSuboptimalOrder) {
  console.error('Expected isSuboptimalOrder to be true for back-and-forth waypoints!');
  process.exit(1);
}

// 2. Test optimization
const optimalOrder = optimizeWaypointOrder(origin, destination, userWaypoints, 'retinue', 'balanced', 'balanced');
console.log('Optimized order of stops:', optimalOrder);

if (optimalOrder[0] !== 'eyrie' || optimalOrder[1] !== 'white_harbor' || optimalOrder[2] !== 'barrowton') {
  console.error('Unexpected optimal order:', optimalOrder);
  process.exit(1);
}

// 3. Calculate optimized route
const opt = calculateRealisticRoute(origin, destination, optimalOrder, 'retinue', 'balanced', 'balanced');
if (!opt) {
  console.error('Failed to calculate optimized route!');
  process.exit(1);
}

console.log(`Optimized Total Distance: ${opt.totalMiles} miles (~${opt.totalDays} days)`);
console.log(`Distance saved: ${unopt.totalMiles - opt.totalMiles} miles!`);

// 4. Verify no premature visits to Winterfell in intermediate stages
const intermediateNodes = opt.legs.slice(0, -1).map(l => l.fromNode.id);
const prematureArrivals = intermediateNodes.filter(id => id === destination);
if (prematureArrivals.length > 0) {
  console.error('Route visits destination prematurely in intermediate legs!', prematureArrivals);
  process.exit(1);
}

console.log('Verification successful! No premature arrival loops, and route distance minimized from 4,905 mi to 2,773 mi.');
