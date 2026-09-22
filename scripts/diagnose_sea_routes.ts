import { calculateRealisticRoute } from '../src/engine/pathfinder';

const pairs: [string, string][] = [
  ['spicetown', 'volantis'],
  ['volantis', 'qarth'],
  ['qarth', 'leng_yi'],
  ['leng_yi', 'asshai'],
  ['spicetown', 'braavos'],
  ['braavos', 'port_of_ibben'],
  ['port_of_ibben', 'nefer'],
  ['volantis', 'tall_trees_town'],
  ['tall_trees_town', 'sunspear']
];

for (const [from, to] of pairs) {
  const rSea = calculateRealisticRoute(from, to, [], 'fleet', 'sea_only', 'balanced');
  const rBal = calculateRealisticRoute(from, to, [], 'fleet', 'balanced', 'balanced');
  console.log(`${from} -> ${to}: sea_only=${!!rSea}, balanced=${!!rBal}`);
}
