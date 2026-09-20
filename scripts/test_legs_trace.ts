import { calculateRealisticRoute } from '../src/engine/pathfinder';

const r = calculateRealisticRoute('kings_landing', 'winterfell', ['eyrie', 'white_harbor', 'barrowton'], 'retinue', 'balanced', 'balanced');
if (r) {
  console.log('Total miles:', r.totalMiles);
  for (const leg of r.legs) {
    console.log(`  ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.edge.name}, ${leg.distanceMiles} mi, ${leg.transitDays}d)`);
  }
}
