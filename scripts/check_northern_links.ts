import { NODES } from '../src/data/nodes';
import { pixelDistance, pixelsToMiles } from '../src/engine/scale';

const barrowton = NODES['barrowton'];
const moatCailin = NODES['moat_cailin'];
const whiteHarbor = NODES['white_harbor'];
const winterfell = NODES['winterfell'];
const crossroads = NODES['crossroads_inn'];
const eyrie = NODES['eyrie'];

console.log('Barrowton coords:', barrowton.coords);
console.log('Moat Cailin coords:', moatCailin.coords);
console.log('White Harbor coords:', whiteHarbor.coords);
console.log('Winterfell coords:', winterfell.coords);

console.log('Barrowton -> Moat Cailin dist:', Math.round(pixelsToMiles(pixelDistance(barrowton.coords, moatCailin.coords))), 'miles');
console.log('Barrowton -> White Harbor dist:', Math.round(pixelsToMiles(pixelDistance(barrowton.coords, whiteHarbor.coords))), 'miles');
console.log('Moat Cailin -> White Harbor dist:', Math.round(pixelsToMiles(pixelDistance(moatCailin.coords, whiteHarbor.coords))), 'miles');
console.log('Crossroads -> Eyrie dist:', Math.round(pixelsToMiles(pixelDistance(crossroads.coords, eyrie.coords))), 'miles');
