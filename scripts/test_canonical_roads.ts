import { NODES } from '../src/data/nodes';
import { calculateRealisticRoute } from '../src/engine/pathfinder';

// Check the High Road: Crossroads Inn to Eyrie
const highRoadTest = calculateRealisticRoute('crossroads_inn', 'eyrie', [], 'retinue', 'balanced', 'balanced');
console.log('Crossroads Inn -> Eyrie:');
if (highRoadTest) {
  for (const leg of highRoadTest.legs) {
    console.log(`  ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.distanceMiles} mi, ${leg.segmentType}, ${leg.edge.name})`);
  }
}

// Check Moat Cailin to White Harbor
const moatToWhite = calculateRealisticRoute('moat_cailin', 'white_harbor', [], 'retinue', 'balanced', 'balanced');
console.log('\nMoat Cailin -> White Harbor:');
if (moatToWhite) {
  for (const leg of moatToWhite.legs) {
    console.log(`  ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.distanceMiles} mi, ${leg.segmentType}, ${leg.edge.name})`);
  }
}

// Check Moat Cailin to Barrowton
const moatToBarrow = calculateRealisticRoute('moat_cailin', 'barrowton', [], 'retinue', 'balanced', 'balanced');
console.log('\nMoat Cailin -> Barrowton:');
if (moatToBarrow) {
  for (const leg of moatToBarrow.legs) {
    console.log(`  ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.distanceMiles} mi, ${leg.segmentType}, ${leg.edge.name})`);
  }
}
