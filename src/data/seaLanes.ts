import type { RouteEdge, TerrainType } from '../types';
import { NODES } from './nodes';
import { calculatePathLengthPixels, pixelsToMiles, pixelsToKm, pixelsToLeagues, sanitizeRouteWaypoints } from '../engine/scale';

interface RawSeaEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  terrainType: TerrainType;
  waypoints: [number, number][];
}

function createSeaEdge(raw: RawSeaEdge): RouteEdge {
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
    segmentType: 'sea',
    terrainType: raw.terrainType,
    waypoints,
    distanceMiles,
    distanceKm,
    distanceLeagues
  };
}

const RAW_SEA_LANES: RawSeaEdge[] = [
  // ================= THE NARROW SEA (NORTH) =================
  {
    id: 'sea_bay_of_seals',
    from: 'eastwatch',
    to: 'white_harbor',
    name: 'Bay of Seals Coastal Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1775, 2235],
      [1950, 2400],
      [2080, 2750],
      [2050, 3050],
      [1950, 3230],
      [1840, 3320]
    ]
  },
  {
    id: 'sea_white_harbor_gulltown',
    from: 'white_harbor',
    to: 'gulltown',
    name: 'The Bite to Gulltown Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1840, 3320],
      [1980, 3500],
      [2120, 3750],
      [2200, 3950],
      [2230, 4130]
    ]
  },
  {
    id: 'sea_white_harbor_braavos',
    from: 'white_harbor',
    to: 'braavos',
    name: 'Narrow Sea Northern Trade Crossing',
    terrainType: 'coastal_sea',
    waypoints: [
      [1840, 3320],
      [2100, 3400],
      [2400, 3480],
      [2650, 3550],
      [2870, 3630]
    ]
  },
  {
    id: 'sea_braavos_lorath',
    from: 'braavos',
    to: 'lorath',
    name: 'Braavosi Coast to Lorath (Shivering Sea)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2870, 3630],
      [3050, 3650],
      [3220, 3680],
      [3360, 3750]
    ]
  },
  {
    id: 'sea_gulltown_pentos',
    from: 'gulltown',
    to: 'pentos',
    name: 'Narrow Sea Central Passage',
    terrainType: 'coastal_sea',
    waypoints: [
      [2230, 4130],
      [2450, 4280],
      [2700, 4460],
      [2990, 4670]
    ]
  },

  // ================= BLACKWATER BAY & THE GULLET =================
  {
    id: 'sea_maidenpool_dragonstone',
    from: 'maidenpool',
    to: 'dragonstone',
    name: 'Bay of Crabs Channel',
    terrainType: 'coastal_sea',
    waypoints: [
      [2073, 4323],
      [2180, 4330],
      [2280, 4370],
      [2349, 4409]
    ]
  },
  {
    id: 'sea_saltpans_maidenpool',
    from: 'saltpans',
    to: 'maidenpool',
    name: 'Trident Mouth Shipping',
    terrainType: 'coastal_sea',
    waypoints: [
      [1971, 4223],
      [2020, 4270],
      [2073, 4323]
    ]
  },
  {
    id: 'sea_kings_landing_driftmark',
    from: 'kings_landing',
    to: 'driftmark',
    name: 'Blackwater Bay Channel',
    terrainType: 'coastal_sea',
    waypoints: [
      [1942, 4589],
      [2030, 4560],
      [2180, 4500],
      [2326, 4433]
    ]
  },
  {
    id: 'sea_driftmark_dragonstone',
    from: 'driftmark',
    to: 'dragonstone',
    name: 'The Gullet Strait',
    terrainType: 'coastal_sea',
    waypoints: [
      [2326, 4433],
      [2349, 4409]
    ]
  },
  {
    id: 'sea_dragonstone_pentos',
    from: 'dragonstone',
    to: 'pentos',
    name: 'The Gullet to Pentos Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [2349, 4409],
      [2500, 4480],
      [2700, 4540],
      [2893, 4593]
    ]
  },

  // ================= SHIPBREAKER BAY & THE STEPSTONES =================
  {
    id: 'sea_kings_landing_storms_end',
    from: 'kings_landing',
    to: 'storms_end',
    name: "Massey's Hook Coastal Lane",
    terrainType: 'coastal_sea',
    waypoints: [
      [1942, 4589],
      [2120, 4680],
      [2250, 4750],
      [2270, 4880],
      [2253, 4945]
    ]
  },
  {
    id: 'sea_storms_end_tarth',
    from: 'storms_end',
    to: 'tarth',
    name: 'Shipbreaker Bay Crossing',
    terrainType: 'dangerous_sea',
    waypoints: [
      [2253, 4945],
      [2330, 4935],
      [2412, 4921]
    ]
  },
  {
    id: 'sea_tarth_tyrosh',
    from: 'tarth',
    to: 'tyrosh',
    name: 'Narrow Sea to Stepstones Run',
    terrainType: 'dangerous_sea',
    waypoints: [
      [2412, 4921],
      [2500, 5020],
      [2600, 5110],
      [2700, 5195]
    ]
  },
  {
    id: 'sea_tyrosh_myr',
    from: 'tyrosh',
    to: 'myr',
    name: 'Sea of Myrth Passage',
    terrainType: 'coastal_sea',
    waypoints: [
      [2700, 5195],
      [2850, 5210],
      [2990, 5170],
      [3093, 5122]
    ]
  },
  {
    id: 'sea_tyrosh_lys',
    from: 'tyrosh',
    to: 'lys',
    name: 'The Stepstones Channel to Lys',
    terrainType: 'dangerous_sea',
    waypoints: [
      [2700, 5195],
      [2790, 5330],
      [2880, 5470],
      [2946, 5614]
    ]
  },
  {
    id: 'sea_tyrosh_sunspear',
    from: 'tyrosh',
    to: 'sunspear',
    name: 'Broken Arm Shipping Passage',
    terrainType: 'coastal_sea',
    waypoints: [
      [2700, 5195],
      [2600, 5350],
      [2500, 5480],
      [2404, 5599]
    ]
  },
  {
    id: 'sea_sunspear_planky_town',
    from: 'sunspear',
    to: 'planky_town',
    name: 'Greenblood Estuary',
    terrainType: 'coastal_sea',
    waypoints: [
      [2404, 5599],
      [2340, 5618],
      [2276, 5632]
    ]
  },
  {
    id: 'sea_lys_volantis',
    from: 'lys',
    to: 'volantis',
    name: 'Summer Sea Volantene Run',
    terrainType: 'fair_winds',
    waypoints: [
      [2980, 5840],
      [3200, 5740],
      [3450, 5620],
      [3710, 5460]
    ]
  },
  {
    id: 'sea_sunspear_volantis',
    from: 'sunspear',
    to: 'volantis',
    name: 'Trans-Summer Sea Commercial Highway',
    terrainType: 'fair_winds',
    waypoints: [
      [2280, 5630],
      [2650, 5720],
      [3150, 5720],
      [3500, 5600],
      [3710, 5460]
    ]
  },

  // ================= THE SUNSET SEA & WESTERLANDS =================
  {
    id: 'sea_pyke_lannisport',
    from: 'pyke',
    to: 'lannisport',
    name: "Ironman's Bay to Lannisport Passage",
    terrainType: 'coastal_sea',
    waypoints: [
      [930, 3960],
      [960, 4120],
      [990, 4300],
      [1015, 4450]
    ]
  },
  {
    id: 'sea_lannisport_oldtown',
    from: 'lannisport',
    to: 'oldtown',
    name: 'Sunset Sea Coastal Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1015, 4450],
      [890, 4650],
      [860, 4920],
      [890, 5180],
      [990, 5380]
    ]
  },
  {
    id: 'sea_oldtown_arbor',
    from: 'oldtown',
    to: 'the_arbor',
    name: 'Whispering Sound Lane',
    terrainType: 'fair_winds',
    waypoints: [
      [990, 5380],
      [920, 5480],
      [860, 5550],
      [800, 5600]
    ]
  },
  {
    id: 'sea_arbor_sunspear',
    from: 'the_arbor',
    to: 'sunspear',
    name: 'Redwyne Straits & South Dorne Pass',
    terrainType: 'coastal_sea',
    waypoints: [
      [800, 5600],
      [1020, 5720],
      [1350, 5780],
      [1750, 5780],
      [2100, 5710],
      [2280, 5630]
    ]
  },
  {
    id: 'sea_arbor_summer_isles',
    from: 'the_arbor',
    to: 'port_lotus',
    name: 'Swan Ship Passage to Summer Isles',
    terrainType: 'fair_winds',
    waypoints: [
      [800, 5600],
      [1150, 6000],
      [1600, 6450],
      [2280, 6950]
    ]
  },

  // ================= THE GULF OF GRIEF & SLAVER'S BAY =================
  {
    id: 'sea_volantis_astapor',
    from: 'volantis',
    to: 'astapor',
    name: 'Gulf of Grief Slaver Route (Valyria Bypass)',
    terrainType: 'fair_winds',
    waypoints: [
      [3710, 5460],
      [4100, 5850],
      [4650, 5980],
      [5100, 5880],
      [5380, 5740]
    ]
  },
  {
    id: 'sea_astapor_yunkai',
    from: 'astapor',
    to: 'yunkai',
    name: "Slaver's Bay Southern Waterway",
    terrainType: 'coastal_sea',
    waypoints: [
      [5216, 5834],
      [5180, 5660],
      [5288, 5494]
    ]
  },
  {
    id: 'sea_yunkai_meereen',
    from: 'yunkai',
    to: 'meereen',
    name: "Slaver's Bay Northern Waterway",
    terrainType: 'coastal_sea',
    waypoints: [
      [5288, 5494],
      [5240, 5430],
      [5421, 5371]
    ]
  },
  {
    id: 'sea_astapor_new_ghis',
    from: 'astapor',
    to: 'new_ghis',
    name: 'Ghiscari Strait Shipping Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [5216, 5834],
      [5440, 6050],
      [5356, 6522]
    ]
  },

  // ================= THE JADE GATES & JADE SEA =================
  {
    id: 'sea_volantis_qarth',
    from: 'volantis',
    to: 'qarth',
    name: 'Great Summer Sea Highway to Qarth',
    terrainType: 'fair_winds',
    waypoints: [
      [3825, 5632],
      [4400, 6150],
      [5200, 6300],
      [6000, 6150],
      [6884, 6196]
    ]
  },
  {
    id: 'sea_qarth_faros',
    from: 'qarth',
    to: 'faros',
    name: 'The Jade Gates Passage',
    terrainType: 'fair_winds',
    waypoints: [
      [6884, 6196],
      [6820, 6380],
      [6778, 6573]
    ]
  },
  {
    id: 'sea_qarth_yin',
    from: 'qarth',
    to: 'yin',
    name: 'Northern Jade Sea Lane to Yi Ti',
    terrainType: 'fair_winds',
    waypoints: [
      [6570, 5820],
      [6900, 6250],
      [7250, 6500],
      [7500, 6680]
    ]
  },
  {
    id: 'sea_faros_leng_yi',
    from: 'faros',
    to: 'leng_yi',
    name: 'Great Moraq to Leng Trade Wind Corridor',
    terrainType: 'fair_winds',
    waypoints: [
      [6580, 6430],
      [7150, 6550],
      [7750, 6580],
      [8300, 6530]
    ]
  },
  {
    id: 'sea_yin_jinqi',
    from: 'yin',
    to: 'jinqi',
    name: 'Imperial Yi Ti Coast Waterway',
    terrainType: 'coastal_sea',
    waypoints: [
      [7500, 6680],
      [7950, 6580],
      [8400, 6420]
    ]
  },
  {
    id: 'sea_jinqi_asshai',
    from: 'jinqi',
    to: 'asshai',
    name: 'Saffron Straits Corridor to Asshai',
    terrainType: 'fair_winds',
    waypoints: [
      [8400, 6420],
      [8650, 6800],
      [8900, 7150],
      [9050, 7450]
    ]
  },
  {
    id: 'sea_leng_asshai',
    from: 'leng_yi',
    to: 'asshai',
    name: 'Jade Sea Deep Crossing to Shadow Lands',
    terrainType: 'fair_winds',
    waypoints: [
      [8300, 6530],
      [8600, 6900],
      [8850, 7200],
      [9050, 7450]
    ]
  },
  // ================= DIRECT CORRIDORS & CROSSINGS =================
  {
    id: 'sea_storms_end_sunspear',
    from: 'storms_end',
    to: 'sunspear',
    name: 'Sea of Dorne Coastal Route (Shipbreaker to Sunspear)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2252, 4961],
      [2340, 5080],
      [2380, 5240],
      [2420, 5420],
      [2409, 5608]
    ]
  },
  {
    id: 'sea_dragonstone_gulltown',
    from: 'dragonstone',
    to: 'gulltown',
    name: 'Bay of Crabs Outer Reach (Dragonstone to Gulltown)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2255, 4425],
      [2260, 4320],
      [2245, 4220],
      [2230, 4130]
    ]
  },
  {
    id: 'sea_saltpans_braavos',
    from: 'saltpans',
    to: 'braavos',
    name: "Narrow Sea Crossing (Titan's Daughter Route)",
    terrainType: 'coastal_sea',
    waypoints: [
      [1835, 4153],
      [2050, 4170],
      [2350, 4050],
      [2650, 3850],
      [2900, 3697]
    ]
  },
  {
    id: 'sea_gulltown_braavos',
    from: 'gulltown',
    to: 'braavos',
    name: 'Vale to Braavos Trade Crossing',
    terrainType: 'coastal_sea',
    waypoints: [
      [2230, 4130],
      [2450, 3980],
      [2700, 3820],
      [2900, 3697]
    ]
  },
  {
    id: 'sea_oldtown_starfall',
    from: 'oldtown',
    to: 'starfall',
    name: 'Red Mountains Cape Route (Oldtown to Starfall)',
    terrainType: 'coastal_sea',
    waypoints: [
      [1031, 5365],
      [1080, 5460],
      [1180, 5500],
      [1290, 5475]
    ]
  },
  {
    id: 'sea_starfall_sunspear',
    from: 'starfall',
    to: 'sunspear',
    name: 'South Dornish Coastal Run (Torrentine to Sunspear)',
    terrainType: 'coastal_sea',
    waypoints: [
      [1290, 5475],
      [1550, 5650],
      [1850, 5700],
      [2150, 5660],
      [2404, 5599]
    ]
  },
];

export const SEA_LANES: RouteEdge[] = RAW_SEA_LANES.map(createSeaEdge);
