import { calculateRealisticRoute } from '../src/engine/pathfinder';

const res = calculateRealisticRoute(
  'kings_landing',
  'winterfell',
  ['barrowton', 'white_harbor', 'eyrie'],
  'retinue',
  'balanced',
  'balanced'
);

if (res) {
  console.log(`Total legs: ${res.legs.length}`);
  console.log(`Total miles: ${res.totalMiles}`);
  for (let i = 0; i < res.legs.length; i++) {
    const leg = res.legs[i];
    console.log(`Leg ${i + 1}: ${leg.fromNode.name} -> ${leg.toNode.name} (${leg.distanceMiles} mi, ${leg.segmentType}, edge: ${leg.edge.id} / ${leg.edge.name})`);
  }
} else {
  console.log('calculateRealisticRoute returned NULL!');
}
