import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { REGIONAL_CONNECTORS } from '../src/data/regionalConnectors';
import { calculateRealisticRoute } from '../src/engine/pathfinder';

// Check current path from King's Landing to Winterfell with waypoints:
// [barrowton, white_harbor, eyrie]
const unoptimized = calculateRealisticRoute('kings_landing', 'winterfell', ['barrowton', 'white_harbor', 'eyrie'], 'retinue', 'balanced', 'balanced');
console.log('Unoptimized route distance:', unoptimized?.totalMiles, 'miles');

// If waypoints are in geographical sequence: [eyrie, white_harbor, barrowton] or [eyrie, barrowton, white_harbor]
const opt1 = calculateRealisticRoute('kings_landing', 'winterfell', ['eyrie', 'white_harbor', 'barrowton'], 'retinue', 'balanced', 'balanced');
console.log('Optimized order [eyrie, white_harbor, barrowton]:', opt1?.totalMiles, 'miles');

const opt2 = calculateRealisticRoute('kings_landing', 'winterfell', ['eyrie', 'barrowton', 'white_harbor'], 'retinue', 'balanced', 'balanced');
console.log('Optimized order [eyrie, barrowton, white_harbor]:', opt2?.totalMiles, 'miles');
