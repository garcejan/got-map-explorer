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
  // ================= THE WALL =================
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

  // ================= THE KINGSROAD: NORTHERN SECTION =================
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
      [1500, 2770],
      [1370, 2655]
    ]
  },
  {
    id: 'road_winterfell_torrhens',
    from: 'winterfell',
    to: 'torrhens_square',
    name: "Lake Road to Torrhen's Square",
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
      [1615, 2957],
      [1670, 3070],
      [1740, 3180],
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

  // ================= THE NECK & RIVERLANDS =================
  {
    id: 'road_kingsroad_neck_direct',
    from: 'moat_cailin',
    to: 'crossroads_inn',
    name: 'The Kingsroad (Causeway through the Neck)',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1670, 3392],
      [1675, 3500],
      [1685, 3620],
      [1700, 3750],
      [1715, 3860],
      [1745, 3960],
      [1790, 4070],
      [1838, 4161]
    ]
  },
  {
    id: 'road_kingsroad_neck_causeway',
    from: 'moat_cailin',
    to: 'the_twins',
    name: 'The Causeway of the Neck',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1580, 3445],
      [1560, 3530],
      [1540, 3620],
      [1525, 3710],
      [1500, 3810]
    ]
  },
  {
    id: 'road_the_neck_greywater',
    from: 'moat_cailin',
    to: 'greywater_watch',
    name: 'Crannog Bog Secret Channels',
    terrainType: 'swamp_causeway',
    waypoints: [
      [1580, 3445],
      [1510, 3560],
      [1420, 3680]
    ]
  },
  {
    id: 'road_kingsroad_twins_crossroads',
    from: 'the_twins',
    to: 'crossroads_inn',
    name: 'The Kingsroad (Trident Crossing)',
    terrainType: 'royal_road',
    waypoints: [
      [1500, 3810],
      [1540, 3910],
      [1590, 4010],
      [1630, 4070],
      [1670, 4120]
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

  // ================= THE VALE OF ARRYN =================
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
      [2150, 4020],
      [2280, 4050],
      [2419, 4070]
    ]
  },

  // ================= THE WESTERLANDS =================
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
      [1015, 4450],
      [970, 4550],
      [935, 4620],
      [920, 4680]
    ]
  },
  {
    id: 'road_ocean_road_crakehall_highgarden',
    from: 'crakehall',
    to: 'highgarden',
    name: 'The Ocean Road (Reach Section)',
    terrainType: 'royal_road',
    waypoints: [
      [920, 4680],
      [950, 4770],
      [980, 4850],
      [1080, 4920],
      [1190, 4980],
      [1290, 5020]
    ]
  },

  // ================= CROWNLANDS & THE GOLDROAD =================
  {
    id: 'road_kingsroad_crossroads_kings_landing',
    from: 'crossroads_inn',
    to: 'kings_landing',
    name: 'The Kingsroad (Crownlands)',
    terrainType: 'royal_road',
    waypoints: [
      [1838, 4161],
      [1845, 4200],
      [1875, 4250],
      [1875, 4300],
      [1885, 4340],
      [1880, 4420],
      [1885, 4460],
      [1920, 4550],
      [1949, 4616]
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
      [2070, 4420],
      [2030, 4520],
      [1985, 4600],
      [1955, 4670]
    ]
  },

  // ================= THE REACH & THE ROSEROAD =================
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
      [1520, 4800],
      [1450, 4880],
      [1370, 4950],
      [1290, 5020]
    ]
  },
  {
    id: 'road_roseroad_highgarden_oldtown',
    from: 'highgarden',
    to: 'oldtown',
    name: 'The Roseroad (Honeywine Section)',
    terrainType: 'royal_road',
    waypoints: [
      [1290, 5020],
      [1220, 5130],
      [1140, 5230],
      [1060, 5310],
      [990, 5380]
    ]
  },

  // ================= STORMLANDS & DORNE PASSES =================
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
    name: "Storm's End Spur",
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
      [2150, 5000],
      [2030, 5020],
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
      [1850, 5130],
      [1800, 5250],
      [1784, 5397]
    ]
  },
  {
    id: 'road_princes_pass_highgarden_starfall',
    from: 'highgarden',
    to: 'starfall',
    name: "The Prince's Pass (Tower of Joy)",
    terrainType: 'mountain_pass',
    waypoints: [
      [1290, 5020],
      [1370, 5100],
      [1440, 5160],
      [1475, 5210],
      [1480, 5280],
      [1400, 5370],
      [1320, 5450]
    ]
  },
  {
    id: 'road_yronwood_sunspear',
    from: 'yronwood',
    to: 'sunspear',
    name: 'Greenblood River Road',
    terrainType: 'desert_waste',
    waypoints: [
      [1740, 5320],
      [1860, 5420],
      [1990, 5500],
      [2130, 5580],
      [2220, 5620],
      [2280, 5630]
    ]
  },
  {
    id: 'road_starfall_sunspear',
    from: 'starfall',
    to: 'sunspear',
    name: 'Dornish South Coast Trail',
    terrainType: 'desert_waste',
    waypoints: [
      [1320, 5450],
      [1500, 5530],
      [1750, 5560],
      [2010, 5580],
      [2280, 5630]
    ]
  },

  // ================= ESSOS: VALYRIAN FUSED-STONE HIGHWAYS =================
  {
    id: 'road_valyrian_pentos_norvos',
    from: 'pentos',
    to: 'norvos',
    name: 'Valyrian Fused Highway (Pentos to Norvos)',
    terrainType: 'paved_highway',
    waypoints: [
      [2990, 4670],
      [3130, 4550],
      [3270, 4440],
      [3410, 4330],
      [3550, 4230]
    ]
  },
  {
    id: 'road_valyrian_norvos_qohor',
    from: 'norvos',
    to: 'qohor',
    name: 'Valyrian Fused Highway (Norvos to Qohor)',
    terrainType: 'paved_highway',
    waypoints: [
      [3550, 4230],
      [3650, 4340],
      [3760, 4460],
      [3880, 4590]
    ]
  },
  {
    id: 'road_rhoyne_highway_norvos_volantis',
    from: 'norvos',
    to: 'volantis',
    name: 'The Great Rhoyne Valyrian Road',
    terrainType: 'paved_highway',
    waypoints: [
      [3550, 4230],
      [3530, 4770],
      [3560, 5130],
      [3670, 5320],
      [3700, 5420],
      [3710, 5460]
    ]
  },
  {
    id: 'road_braavos_pentos',
    from: 'braavos',
    to: 'pentos',
    name: 'Braavosi Coast Track',
    terrainType: 'dirt_track',
    waypoints: [
      [2870, 3630],
      [2880, 3950],
      [2850, 4250],
      [2920, 4500],
      [2990, 4670]
    ]
  },
  {
    id: 'road_pentos_myr',
    from: 'pentos',
    to: 'myr',
    name: 'Flatlands Highway',
    terrainType: 'royal_road',
    waypoints: [
      [2990, 4670],
      [3050, 4850],
      [3120, 5050],
      [3220, 5260]
    ]
  },
  {
    id: 'road_myr_tyrosh',
    from: 'myr',
    to: 'tyrosh',
    name: 'Disputed Lands Highway',
    terrainType: 'dirt_track',
    waypoints: [
      [3220, 5260],
      [3080, 5330],
      [2930, 5390],
      [2790, 5440]
    ]
  },
  {
    id: 'road_myr_volantis',
    from: 'myr',
    to: 'volantis',
    name: 'Orange Shore Valyrian Road',
    terrainType: 'paved_highway',
    waypoints: [
      [3220, 5260],
      [3380, 5400],
      [3540, 5480],
      [3710, 5460]
    ]
  },

  // ================= THE DEMON ROAD & SLAVER'S BAY =================
  {
    id: 'road_demon_road_volantis_mantarys',
    from: 'volantis',
    to: 'mantarys',
    name: 'The Demon Road (Sea of Sighs)',
    terrainType: 'mountain_pass',
    waypoints: [
      [3710, 5460],
      [3950, 5480],
      [4180, 5490],
      [4440, 5450]
    ]
  },
  {
    id: 'road_demon_road_mantarys_bhorash',
    from: 'mantarys',
    to: 'bhorash',
    name: 'The Demon Road (Black Cliffs)',
    terrainType: 'mountain_pass',
    waypoints: [
      [4440, 5450],
      [4650, 5410],
      [4870, 5370]
    ]
  },
  {
    id: 'road_demon_road_bhorash_meereen',
    from: 'bhorash',
    to: 'meereen',
    name: 'The Demon Road (Approach to Meereen)',
    terrainType: 'paved_highway',
    waypoints: [
      [4870, 5370],
      [5100, 5360],
      [5360, 5370]
    ]
  },
  {
    id: 'road_slavers_coast_meereen_yunkai',
    from: 'meereen',
    to: 'yunkai',
    name: "Slaver's Coast Coastal Road",
    terrainType: 'royal_road',
    waypoints: [
      [5360, 5370],
      [5400, 5430],
      [5430, 5500]
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
      [5320, 5600],
      [5340, 5700],
      [5216, 5834]
    ]
  },

  // ================= DOTHRAKI SEA, QARTH & THE FAR EAST =================
  {
    id: 'road_dothraki_sea_qohor_vaes_dothrak',
    from: 'qohor',
    to: 'vaes_dothrak',
    name: 'The Horselord Steppes',
    terrainType: 'dirt_track',
    waypoints: [
      [3945, 4580],
      [4600, 4550],
      [5400, 4480],
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
      [7150, 6350],
      [7500, 6480],
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
      [8100, 6500],
      [8350, 6430],
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
      [8400, 6420],
      [8650, 6750],
      [8850, 7100],
      [9050, 7450]
    ]
  }
];

export const ROADS: RouteEdge[] = RAW_ROADS.map(createRoadEdge);
