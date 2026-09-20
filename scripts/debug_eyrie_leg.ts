import { calculateRealisticRoute } from '../src/engine/pathfinder';

const res = calculateRealisticRoute(
  'white_harbor',
  'the_eyrie',
  [],
  'retinue',
  'balanced',
  'balanced'
);

console.log('Route white_harbor -> the_eyrie:', res ? `Success: ${res.totalMiles} mi, ${res.legs.length} legs` : 'FAILED');
if (res) {
  for (const leg of res.legs) {
    console.log(`  ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.distanceMiles} mi, ${leg.segmentType})`);
  }
}
