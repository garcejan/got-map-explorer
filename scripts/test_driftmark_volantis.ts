import { calculateRealisticRoute } from '../src/engine/pathfinder';

console.log('Testing driftmark -> volantis:');
const r = calculateRealisticRoute('driftmark', 'volantis', [], 'fleet', 'sea_only', 'balanced');
console.log('driftmark -> volantis sea_only:', !!r);
if (r) {
  console.log(`Miles: ${r.totalMiles}, Days: ${r.totalTransitDays}, Legs: ${r.legs.length}`);
  for (const leg of r.legs) {
    console.log(` - ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.segmentType})`);
  }
}
