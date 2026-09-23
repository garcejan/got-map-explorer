import type { RouteEdge, TerrainType } from '../types';
import { NODES } from './nodes';
import { calculatePathLengthPixels, pixelsToMiles, pixelsToKm, pixelsToLeagues, sanitizeRouteWaypoints } from '../engine/scale';

interface RawEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  terrainType: TerrainType;
  waypoints: [number, number][];
}

function createRoadEdge(raw: RawEdge): RouteEdge {
  const fromNode = NODES[raw.from];
  const toNode = NODES[raw.to];
  const fromCoords: [number, number] = fromNode ? fromNode.coords : (raw.waypoints[0] || [0, 0]);
  const toCoords: [number, number] = toNode ? toNode.coords : (raw.waypoints[raw.waypoints.length - 1] || [0, 0]);

  const waypoints = sanitizeRouteWaypoints(raw.waypoints, fromCoords, toCoords);

  const lengthPx = calculatePathLengthPixels(waypoints);
  const distanceMiles = Math.round(pixelsToMiles(lengthPx));
  const distanceKm = Math.round(pixelsToKm(lengthPx));
  const distanceLeagues = Math.round(pixelsToLeagues(lengthPx));

  return {
    id: raw.id,
    from: raw.from,
    to: raw.to,
    name: raw.name,
    segmentType: 'land',
    terrainType: raw.terrainType,
    waypoints,
    distanceMiles,
    distanceKm,
    distanceLeagues
  };
}

const RAW_ROADS: RawEdge[] = [
  {
    id: 'road_shadow_nightfort',
    from: 'shadow_tower',
    to: 'nightfort',
    name: 'The Wall Way (Western Redoubt)',
    terrainType: 'northern_snow',
    waypoints: [
      [1714, 2285],
      [1772, 2246],
      [1857, 2246]
    ]
  },
  {
    id: 'road_nightfort_castle_black',
    from: 'nightfort',
    to: 'castle_black',
    name: 'The Wall Way (Central Patrol)',
    terrainType: 'northern_snow',
    waypoints: [
      [1857, 2246],
      [1930, 2248]
    ]
  },
  {
    id: 'road_castle_black_eastwatch',
    from: 'castle_black',
    to: 'eastwatch',
    name: 'The Wall Way (Eastern Redoubt)',
    terrainType: 'northern_snow',
    waypoints: [
      [1930, 2248],
      [2070, 2248]
    ]
  },
  {
    id: 'road_kingsroad_wall_winterfell',
    from: 'castle_black',
    to: 'winterfell',
    name: 'The Kingsroad (Gift to Winterfell)',
    terrainType: 'northern_snow',
    waypoints: [
      [1930, 2248],
      [1945, 2300],
      [1910, 2410],
      [1860, 2520],
      [1800, 2610],
      [1730, 2690],
      [1654, 2786],
      [1631, 2892]
    ]
  },
  {
    id: 'road_kingsroad_winterfell_moat_cailin',
    from: 'winterfell',
    to: 'moat_cailin',
    name: 'The Kingsroad (Barrowlands)',
    terrainType: 'royal_road',
    waypoints: [
      [1631, 2892],
      [1615, 2985],
      [1625, 3080],
      [1628, 3180],
      [1628, 3240],
      [1667, 3392]
    ]
  },
  {
    id: 'road_winterfell_deepwood',
    from: 'winterfell',
    to: 'deepwood_motte',
    name: 'Wolfswood Track',
    terrainType: 'dirt_track',
    waypoints: [
      [1631, 2892],
      [1632, 2895],
      [1368, 2671],
      [1370, 2655]
    ]
  },
  {
    id: 'road_winterfell_torrhens',
    from: 'winterfell',
    to: 'torrhens_square',
    name: 'Lake Road to Torrhen\'s Square',
    terrainType: 'dirt_track',
    waypoints: [
      [1631, 2892],
      [1510, 2970],
      [1384, 3055]
    ]
  },
  {
    id: 'road_winterfell_white_harbor',
    from: 'winterfell',
    to: 'white_harbor',
    name: 'White Knife Trade Road',
    terrainType: 'royal_road',
    waypoints: [
      [1631, 2892],
      [1632, 2895],
      [1856, 3294],
      [1856, 3302],
      [1848, 3300]
    ]
  },
  {
    id: 'road_winterfell_dreadfort',
    from: 'winterfell',
    to: 'the_dreadfort',
    name: 'Lonely Hills Road',
    terrainType: 'dirt_track',
    waypoints: [
      [1631, 2892],
      [1780, 2870],
      [1910, 2850],
      [2043, 2835]
    ]
  },
  {
    id: 'road_dreadfort_last_hearth',
    from: 'the_dreadfort',
    to: 'last_hearth',
    name: 'Last River March',
    terrainType: 'northern_snow',
    waypoints: [
      [2043, 2835],
      [2000, 2670],
      [1965, 2505]
    ]
  },
  {
    id: 'road_dreadfort_karhold',
    from: 'the_dreadfort',
    to: 'karhold',
    name: 'Weeping Coast Track',
    terrainType: 'dirt_track',
    waypoints: [
      [2043, 2835],
      [2150, 2780],
      [2250, 2720],
      [2355, 2673]
    ]
  },
  {
    id: 'road_white_harbor_moat_cailin',
    from: 'white_harbor',
    to: 'moat_cailin',
    name: 'White Harbor Coastal Approach',
    terrainType: 'royal_road',
    waypoints: [
      [1848, 3300],
      [1760, 3350],
      [1667, 3392]
    ]
  },
  {
    id: 'road_barrowton_moat_cailin',
    from: 'barrowton',
    to: 'moat_cailin',
    name: 'Barrow Road (Moat Cailin Approach)',
    terrainType: 'royal_road',
    waypoints: [
      [1340, 3257],
      [1363, 3250],
      [1515, 3320],
      [1667, 3392]
    ]
  },
  {
    id: 'road_goldgrass_moat_cailin',
    from: 'goldgrass',
    to: 'moat_cailin',
    name: 'Goldgrass Moat Cailin Causeway',
    terrainType: 'royal_road',
    waypoints: [
      [1363, 3250],
      [1515, 3320],
      [1667, 3392]
    ]
  },
  {
    id: 'road_kingsroad_neck_direct',
    from: 'moat_cailin',
    to: 'crossroads_inn',
    name: 'The Kingsroad (Causeway through the Neck)',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1667, 3392],
      [1675, 3500],
      [1685, 3620],
      [1700, 3750],
      [1715, 3860],
      [1745, 3960],
      [1790, 4070],
      [1845, 4153]
    ]
  },
  {
    id: 'road_kingsroad_neck_causeway',
    from: 'moat_cailin',
    to: 'the_twins',
    name: 'The Causeway of the Neck',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1667, 3392],
      [1560, 3530],
      [1540, 3620],
      [1525, 3710],
      [1570, 3840]
    ]
  },
  {
    id: 'road_the_neck_greywater',
    from: 'moat_cailin',
    to: 'greywater_watch',
    name: 'Crannog Bog Secret Channels',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1667, 3392],
      [1510, 3560],
      [1550, 3643]
    ]
  },
  {
    id: 'road_kingsroad_twins_crossroads',
    from: 'the_twins',
    to: 'crossroads_inn',
    name: 'The Kingsroad (Trident Crossing)',
    terrainType: 'royal_road',
    waypoints: [
      [1570, 3840],
      [1540, 3910],
      [1590, 4010],
      [1630, 4070],
      [1845, 4153]
    ]
  },
  {
    id: 'road_river_road_crossroads_riverrun',
    from: 'crossroads_inn',
    to: 'riverrun',
    name: 'The River Road',
    terrainType: 'royal_road',
    waypoints: [
      [1845, 4153],
      [1730, 4153],
      [1620, 4153],
      [1515, 4153]
    ]
  },
  {
    id: 'road_crossroads_maidenpool',
    from: 'crossroads_inn',
    to: 'maidenpool',
    name: 'Bay of Crabs Highway',
    terrainType: 'royal_road',
    waypoints: [
      [1845, 4153],
      [1950, 4240],
      [2073, 4323]
    ]
  },
  {
    id: 'road_crossroads_saltpans',
    from: 'crossroads_inn',
    to: 'saltpans',
    name: 'Trident Estuary Track',
    terrainType: 'dirt_track',
    waypoints: [
      [1845, 4153],
      [1900, 4185],
      [1971, 4223]
    ]
  },
  {
    id: 'road_high_road_bloody_gate',
    from: 'crossroads_inn',
    to: 'bloody_gate',
    name: 'The High Road (Mountains of the Moon)',
    terrainType: 'mountain_pass',
    waypoints: [
      [1845, 4153],
      [1900, 4100],
      [1970, 4055]
    ]
  },
  {
    id: 'road_bloody_gate_eyrie',
    from: 'bloody_gate',
    to: 'eyrie',
    name: 'Ascent to the Eyrie',
    terrainType: 'mountain_pass',
    waypoints: [
      [1970, 4055],
      [2015, 4015],
      [2060, 3975]
    ]
  },
  {
    id: 'road_eyrie_gulltown',
    from: 'eyrie',
    to: 'gulltown',
    name: 'Vale Lowlands Highway',
    terrainType: 'royal_road',
    waypoints: [
      [2060, 3975],
      [2064, 3974],
      [2376, 4030],
      [2408, 4054],
      [2419, 4070]
    ]
  },
  {
    id: 'road_riverrun_golden_tooth',
    from: 'riverrun',
    to: 'golden_tooth',
    name: 'Pass of the Golden Tooth',
    terrainType: 'mountain_pass',
    waypoints: [
      [1515, 4153],
      [1400, 4230],
      [1290, 4310]
    ]
  },
  {
    id: 'road_golden_tooth_deep_den',
    from: 'golden_tooth',
    to: 'deep_den',
    name: 'Westerland Hill March',
    terrainType: 'dirt_track',
    waypoints: [
      [1290, 4310],
      [1288, 4390],
      [1287, 4475]
    ]
  },
  {
    id: 'road_deep_den_casterly_rock',
    from: 'deep_den',
    to: 'casterly_rock',
    name: 'The Goldroad (Western Terminus)',
    terrainType: 'royal_road',
    waypoints: [
      [1287, 4475],
      [1160, 4470],
      [1023, 4467]
    ]
  },
  {
    id: 'road_casterly_lannisport',
    from: 'casterly_rock',
    to: 'lannisport',
    name: 'Lannisport Causeways',
    terrainType: 'paved_highway',
    waypoints: [
      [1023, 4467],
      [1020, 4500]
    ]
  },
  {
    id: 'road_ocean_road_lannisport_crakehall',
    from: 'lannisport',
    to: 'crakehall',
    name: 'The Ocean Road (North Section)',
    terrainType: 'royal_road',
    waypoints: [
      [1020, 4500],
      [1024, 4502],
      [928, 4694],
      [925, 4690]
    ]
  },
  {
    id: 'road_ocean_road_crakehall_highgarden',
    from: 'crakehall',
    to: 'highgarden',
    name: 'The Ocean Road (Reach Section)',
    terrainType: 'royal_road',
    waypoints: [
      [925, 4690],
      [950, 4770],
      [980, 4850],
      [1080, 4920],
      [1190, 4980],
      [1260, 5078]
    ]
  },
  {
    id: 'road_kingsroad_crossroads_kings_landing',
    from: 'crossroads_inn',
    to: 'kings_landing',
    name: 'The Kingsroad (Crownlands)',
    terrainType: 'royal_road',
    waypoints: [
      [1845, 4153],
      [1845, 4200],
      [1875, 4250],
      [1875, 4300],
      [1885, 4340],
      [1880, 4420],
      [1885, 4460],
      [1920, 4550],
      [1942, 4589]
    ]
  },
  {
    id: 'road_goldroad_kings_landing_deep_den',
    from: 'kings_landing',
    to: 'deep_den',
    name: 'The Goldroad',
    terrainType: 'royal_road',
    waypoints: [
      [1942, 4589],
      [1850, 4610],
      [1730, 4600],
      [1600, 4570],
      [1460, 4530],
      [1360, 4490],
      [1287, 4475]
    ]
  },
  {
    id: 'road_maidenpool_duskendale',
    from: 'maidenpool',
    to: 'duskendale',
    name: 'Claw Peninsula Coast Road',
    terrainType: 'dirt_track',
    waypoints: [
      [2073, 4323],
      [2090, 4390],
      [2115, 4468]
    ]
  },
  {
    id: 'road_duskendale_kings_landing',
    from: 'duskendale',
    to: 'kings_landing',
    name: 'Blackwater Coastal Way',
    terrainType: 'royal_road',
    waypoints: [
      [2115, 4468],
      [2112, 4470],
      [1944, 4590],
      [1942, 4589]
    ]
  },
  {
    id: 'road_roseroad_kings_landing_tumbleton',
    from: 'kings_landing',
    to: 'tumbleton',
    name: 'The Roseroad (Crownlands to Tumbleton)',
    terrainType: 'royal_road',
    waypoints: [
      [1942, 4589],
      [1850, 4660],
      [1763, 4721]
    ]
  },
  {
    id: 'road_roseroad_tumbleton_bitterbridge',
    from: 'tumbleton',
    to: 'bitterbridge',
    name: 'The Roseroad (Tumbleton to Bitterbridge)',
    terrainType: 'royal_road',
    waypoints: [
      [1763, 4721],
      [1670, 4775],
      [1572, 4828]
    ]
  },
  {
    id: 'road_roseroad_bitterbridge_highgarden',
    from: 'bitterbridge',
    to: 'highgarden',
    name: 'The Roseroad (Heart of the Reach)',
    terrainType: 'royal_road',
    waypoints: [
      [1572, 4828],
      [1450, 4880],
      [1370, 4950],
      [1260, 5078]
    ]
  },
  {
    id: 'road_roseroad_highgarden_oldtown',
    from: 'highgarden',
    to: 'oldtown',
    name: 'The Roseroad (Honeywine Section)',
    terrainType: 'royal_road',
    waypoints: [
      [1260, 5078],
      [1220, 5130],
      [1140, 5230],
      [1060, 5310],
      [1031, 5365]
    ]
  },
  {
    id: 'road_kingsroad_kings_landing_summerhall',
    from: 'kings_landing',
    to: 'summerhall',
    name: 'The Kingsroad (Kingswood to Dornish Marches)',
    terrainType: 'royal_road',
    waypoints: [
      [1942, 4589],
      [2020, 4690],
      [2070, 4770],
      [2030, 4880],
      [1909, 5023]
    ]
  },
  {
    id: 'road_kingsroad_bronzegate',
    from: 'summerhall',
    to: 'bronzegate',
    name: 'Bronzegate Approach',
    terrainType: 'royal_road',
    waypoints: [
      [1909, 5023],
      [2050, 4900],
      [2195, 4817]
    ]
  },
  {
    id: 'road_bronzegate_storms_end',
    from: 'bronzegate',
    to: 'storms_end',
    name: 'Storm\'s End Spur',
    terrainType: 'royal_road',
    waypoints: [
      [2195, 4817],
      [2253, 4945]
    ]
  },
  {
    id: 'road_storms_end_summerhall',
    from: 'storms_end',
    to: 'summerhall',
    name: 'Rainwood Highway',
    terrainType: 'dirt_track',
    waypoints: [
      [2253, 4945],
      [2256, 4942],
      [1912, 5022],
      [1909, 5023]
    ]
  },
  {
    id: 'road_boneway_summerhall_yronwood',
    from: 'summerhall',
    to: 'yronwood',
    name: 'The Boneway (Wyl Pass)',
    terrainType: 'mountain_pass',
    waypoints: [
      [1909, 5023],
      [1912, 5022],
      [1752, 5373],
      [1752, 5389],
      [1760, 5397],
      [1784, 5397]
    ]
  },
  {
    id: 'road_princes_pass_highgarden_starfall',
    from: 'highgarden',
    to: 'starfall',
    name: 'The Prince\'s Pass (Tower of Joy)',
    terrainType: 'mountain_pass',
    waypoints: [
      [1260, 5078],
      [1370, 5100],
      [1440, 5160],
      [1475, 5210],
      [1480, 5280],
      [1400, 5370],
      [1290, 5475]
    ]
  },
  {
    id: 'road_yronwood_sunspear',
    from: 'yronwood',
    to: 'sunspear',
    name: 'Greenblood River Road',
    terrainType: 'desert_waste',
    waypoints: [
      [1784, 5397],
      [1860, 5420],
      [1990, 5500],
      [2130, 5580],
      [2220, 5620],
      [2404, 5599]
    ]
  },
  {
    id: 'road_starfall_sunspear',
    from: 'starfall',
    to: 'sunspear',
    name: 'Dornish South Coast Trail',
    terrainType: 'desert_waste',
    waypoints: [
      [1290, 5475],
      [1500, 5530],
      [1750, 5560],
      [2010, 5580],
      [2404, 5599]
    ]
  },
  {
    id: 'road_valyrian_pentos_norvos',
    from: 'pentos',
    to: 'norvos',
    name: 'Valyrian Fused Highway (Pentos to Norvos)',
    terrainType: 'paved_highway',
    waypoints: [
      [2893, 4593],
      [3130, 4550],
      [3270, 4440],
      [3410, 4330],
      [3468, 4272]
    ]
  },
  {
    id: 'road_valyrian_norvos_qohor',
    from: 'norvos',
    to: 'qohor',
    name: 'Valyrian Fused Highway (Norvos to Qohor)',
    terrainType: 'paved_highway',
    waypoints: [
      [3468, 4272],
      [3650, 4340],
      [3760, 4460],
      [3945, 4580]
    ]
  },
  {
    id: 'road_rhoyne_highway_norvos_volantis',
    from: 'norvos',
    to: 'volantis',
    name: 'The Great Rhoyne Valyrian Road',
    terrainType: 'paved_highway',
    waypoints: [
      [3468, 4272],
      [3530, 4770],
      [3560, 5130],
      [3670, 5320],
      [3700, 5420],
      [3825, 5632]
    ]
  },
  {
    id: 'road_braavos_pentos',
    from: 'braavos',
    to: 'pentos',
    name: 'Braavosi Coast Track',
    terrainType: 'dirt_track',
    waypoints: [
      [2900, 3717],
      [2904, 3726],
      [2912, 3806],
      [2904, 3814],
      [2920, 3934],
      [2896, 4582],
      [2893, 4593]
    ]
  },
  {
    id: 'road_pentos_myr',
    from: 'pentos',
    to: 'myr',
    name: 'Flatlands Highway',
    terrainType: 'royal_road',
    waypoints: [
      [2893, 4593],
      [2896, 4582],
      [2904, 4582],
      [2920, 4598],
      [2944, 4638],
      [3120, 4974],
      [3120, 5118],
      [3112, 5126],
      [3093, 5122]
    ]
  },
  {
    id: 'road_myr_tyrosh',
    from: 'myr',
    to: 'tyrosh',
    name: 'Disputed Lands Highway',
    terrainType: 'dirt_track',
    waypoints: [
      [3093, 5122],
      [3140, 5180],
      [3140, 5260],
      [2950, 5320],
      [2785, 5190],
      [2768, 5190],
      [2730, 5190],
      [2700, 5195]
    ]
  },
  {
    id: 'road_myr_volantis',
    from: 'myr',
    to: 'volantis',
    name: 'Orange Shore Valyrian Road',
    terrainType: 'paved_highway',
    waypoints: [
      [3093, 5122],
      [3112, 5126],
      [3296, 5245],
      [3824, 5629],
      [3825, 5632]
    ]
  },
  {
    id: 'road_demon_road_volantis_mantarys',
    from: 'volantis',
    to: 'mantarys',
    name: 'The Demon Road (Sea of Sighs)',
    terrainType: 'mountain_pass',
    waypoints: [
      [3825, 5632],
      [3950, 5480],
      [4180, 5490],
      [4499, 5531]
    ]
  },
  {
    id: 'road_valyrian_mantarys_oros',
    from: 'mantarys',
    to: 'oros',
    name: 'Valyrian Highway (Lands of the Long Summer)',
    terrainType: 'paved_highway',
    waypoints: [
      [4499, 5531],
      [4496, 5533],
      [4504, 5669],
      [4448, 6093],
      [4447, 6110]
    ]
  },
  {
    id: 'road_valyrian_oros_tolos',
    from: 'oros',
    to: 'tolos',
    name: 'Valyrian Road (Oros to Tolos)',
    terrainType: 'paved_highway',
    waypoints: [
      [4447, 6110],
      [4448, 6093],
      [4536, 5685],
      [4576, 5621],
      [4648, 5605],
      [4664, 5605],
      [4696, 5629],
      [4728, 5661],
      [4727, 5664]
    ]
  },
  {
    id: 'road_demon_road_mantarys_bhorash',
    from: 'mantarys',
    to: 'bhorash',
    name: 'The Demon Road (Black Cliffs)',
    terrainType: 'mountain_pass',
    waypoints: [
      [4499, 5531],
      [4650, 5410],
      [4977, 5400]
    ]
  },
  {
    id: 'road_demon_road_bhorash_meereen',
    from: 'bhorash',
    to: 'meereen',
    name: 'The Demon Road (Approach to Meereen)',
    terrainType: 'paved_highway',
    waypoints: [
      [4977, 5400],
      [5100, 5360],
      [5421, 5371]
    ]
  },
  {
    id: 'road_slavers_coast_meereen_yunkai',
    from: 'meereen',
    to: 'yunkai',
    name: 'Slaver\'s Coast Coastal Road',
    terrainType: 'royal_road',
    waypoints: [
      [5421, 5371],
      [5424, 5373],
      [5344, 5477],
      [5312, 5493],
      [5288, 5493],
      [5288, 5494]
    ]
  },
  {
    id: 'road_slavers_coast_yunkai_astapor',
    from: 'yunkai',
    to: 'astapor',
    name: 'Red Brick Highway of Ghiscar',
    terrainType: 'royal_road',
    waypoints: [
      [5288, 5494],
      [5288, 5493],
      [5296, 5653],
      [5256, 5805],
      [5224, 5837],
      [5216, 5837],
      [5216, 5834]
    ]
  },
  {
    id: 'road_dothraki_sea_qohor_vaes_dothrak',
    from: 'qohor',
    to: 'vaes_dothrak',
    name: 'The Horselord Steppes',
    terrainType: 'dirt_track',
    waypoints: [
      [3945, 4580],
      [3944, 4582],
      [6232, 4414],
      [6376, 4382],
      [6392, 4350],
      [6394, 4352]
    ]
  },
  {
    id: 'road_red_waste_astapor_qarth',
    from: 'astapor',
    to: 'qarth',
    name: 'Caravan Trail of the Red Waste',
    terrainType: 'desert_waste',
    waypoints: [
      [5216, 5834],
      [5700, 5680],
      [6050, 5660],
      [6350, 5720],
      [6884, 6196]
    ]
  },
  {
    id: 'road_silk_road_qarth_yin',
    from: 'qarth',
    to: 'yin',
    name: 'The Great Silk Road of the Jade Sea',
    terrainType: 'royal_road',
    waypoints: [
      [6884, 6196],
      [6880, 6189],
      [6920, 6149],
      [7272, 6077],
      [7328, 6093],
      [7632, 6341],
      [7840, 6589],
      [7841, 6592]
    ]
  },
  {
    id: 'road_imperial_yin_jinqi',
    from: 'yin',
    to: 'jinqi',
    name: 'Imperial Golden Highway of Yi Ti',
    terrainType: 'paved_highway',
    waypoints: [
      [7841, 6592],
      [7840, 6589],
      [8296, 6365],
      [8472, 6317],
      [8600, 6317],
      [8624, 6357],
      [8624, 6365],
      [8626, 6365]
    ]
  },
  {
    id: 'road_shadow_road_jinqi_asshai',
    from: 'jinqi',
    to: 'asshai',
    name: 'Vale of Shadows Mountain Pass',
    terrainType: 'mountain_pass',
    waypoints: [
      [8626, 6365],
      [9904, 6829],
      [9984, 6901],
      [9992, 6909],
      [9992, 7181],
      [9968, 7197],
      [9624, 7316],
      [9464, 7385],
      [8920, 7440],
      [8907, 7442]
    ]
  }
];

export const ROADS: RouteEdge[] = RAW_ROADS.map(createRoadEdge);
