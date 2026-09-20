import { NODES } from '../src/data/nodes';
import { calculateRealisticRoute } from '../src/engine/pathfinder';

const allNodes = Object.values(NODES);
const sampleNodes = [
  'barrowton',
  'bear_island',
  'hazdahn_mo',
  'harrenhal',
  'castle_cerwyn',
  'crasters_keep',
  'evenfall_hall',
  'lordsport',
  'tall_trees_town',
  'bonetown',
  'winterfell',
  'kings_landing',
  'meereen',
  'qarth'
];

console.log('Testing specific previously isolated settlements:');
for (const id of sampleNodes) {
  const dest = id === 'kings_landing' ? 'winterfell' : 'kings_landing';
  const res = calculateRealisticRoute(id, dest, [], 'retinue', 'balanced', 'balanced');
  if (!res) {
    console.error(`❌ FAILED to route from ${NODES[id]?.name} to ${NODES[dest]?.name}!`);
  } else {
    console.log(`✅ ${NODES[id]?.name} -> ${NODES[dest]?.name}: ${res.totalMiles} mi, ${res.totalDays} days, ${res.legs.length} legs`);
  }
}

console.log('\nTesting waypoints with previously isolated nodes:');
const waypointRes = calculateRealisticRoute(
  'winterfell',
  'meereen',
  ['barrowton', 'harrenhal', 'hazdahn_mo'],
  'retinue',
  'balanced',
  'balanced'
);
if (!waypointRes) {
  console.error('❌ FAILED multi-stop route with waypoints!');
} else {
  console.log(`✅ Multi-stop Route: Winterfell -> Barrowton -> Harrenhal -> Hazdahn Mo -> Meereen: ${waypointRes.totalMiles} mi, ${waypointRes.totalDays} days, ${waypointRes.legs.length} legs`);
}

console.log('\nTesting 200 random node pairs across all 325 settlements:');
let failedCount = 0;
for (let i = 0; i < 200; i++) {
  const n1 = allNodes[Math.floor(Math.random() * allNodes.length)].id;
  const n2 = allNodes[Math.floor(Math.random() * allNodes.length)].id;
  const res = calculateRealisticRoute(n1, n2, [], 'retinue', 'balanced', 'balanced');
  if (!res && n1 !== n2) {
    console.error(`❌ FAILED: ${NODES[n1].name} -> ${NODES[n2].name}`);
    failedCount++;
  }
}

if (failedCount === 0) {
  console.log('🎉 200/200 random pairs successfully calculated realistic routes! 100% success rate!');
} else {
  console.error(`Failures: ${failedCount} / 200`);
}
