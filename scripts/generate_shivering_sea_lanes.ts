import fs from 'fs';
import { setWaterNavBuffers, findSeaRoute } from '../src/engine/waterNav';

const mask = fs.readFileSync('public/data/water_mask.bin');
const dist = fs.readFileSync('public/data/water_distance.bin');
setWaterNavBuffers(new Uint8Array(mask), new Uint8Array(dist));

const p1 = findSeaRoute([2900, 3717], [6475, 3108]);
console.log('Braavos -> Ibben waypoints:', p1?.length);
console.log(JSON.stringify(p1));

const p2 = findSeaRoute([6475, 3108], [8764, 4535]);
console.log('Ibben -> Nefer waypoints:', p2?.length);
console.log(JSON.stringify(p2));
