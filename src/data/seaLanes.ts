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
  {
    id: 'sea_bay_of_seals',
    from: 'eastwatch',
    to: 'white_harbor',
    name: 'Bay of Seals Coastal Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [2070, 2248],
      [2064, 2191],
      [2152, 2063],
      [2568, 2287],
      [2392, 3302],
      [1880, 3478],
      [1848, 3414],
      [1848, 3300]
    ]
  },
  {
    id: 'sea_white_harbor_gulltown',
    from: 'white_harbor',
    to: 'gulltown',
    name: 'The Bite to Gulltown Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1848, 3300],
      [1872, 3478],
      [2488, 3526],
      [2576, 4038],
      [2432, 4086],
      [2419, 4070]
    ]
  },
  {
    id: 'sea_white_harbor_braavos',
    from: 'white_harbor',
    to: 'braavos',
    name: 'Narrow Sea Northern Trade Crossing',
    terrainType: 'coastal_sea',
    waypoints: [
      [1848, 3300],
      [1872, 3478],
      [2512, 3526],
      [2900, 3717]
    ]
  },
  {
    id: 'sea_braavos_lorath',
    from: 'braavos',
    to: 'lorath',
    name: 'Braavosi Coast to Lorath (Shivering Sea)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2900, 3717],
      [3032, 3638],
      [3288, 3832]
    ]
  },
  {
    id: 'sea_gulltown_pentos',
    from: 'gulltown',
    to: 'pentos',
    name: 'Narrow Sea Central Passage',
    terrainType: 'coastal_sea',
    waypoints: [
      [2419, 4070],
      [2832, 4614],
      [2848, 4606],
      [2856, 4598],
      [2893, 4593]
    ]
  },
  {
    id: 'sea_maidenpool_dragonstone',
    from: 'maidenpool',
    to: 'dragonstone',
    name: 'Bay of Crabs Channel',
    terrainType: 'coastal_sea',
    waypoints: [
      [2073, 4323],
      [2064, 4278],
      [2104, 4254],
      [2312, 4206],
      [2462, 4134],
      [2494, 4120],
      [2506, 4116],
      [2512, 4116],
      [2400, 4406],
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
      [1984, 4206],
      [2048, 4254],
      [2064, 4278],
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
      [1976, 4598],
      [2096, 4606],
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
      [2840, 4614],
      [2856, 4598],
      [2893, 4593]
    ]
  },
  {
    id: 'sea_kings_landing_storms_end',
    from: 'kings_landing',
    to: 'storms_end',
    name: 'Massey\'s Hook Coastal Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1942, 4589],
      [1976, 4598],
      [2096, 4606],
      [2384, 4454],
      [2448, 4550],
      [2352, 4966],
      [2272, 4974],
      [2264, 4966],
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
      [2264, 4966],
      [2288, 4982],
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
      [2456, 5014],
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
      [2808, 5094],
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
      [2688, 5221],
      [2688, 5301],
      [2736, 5349],
      [2736, 5389],
      [2904, 5565],
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
      [2680, 5237],
      [2680, 5333],
      [2512, 5589],
      [2424, 5597],
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
      [2424, 5597],
      [2432, 5613],
      [2328, 5693],
      [2304, 5677],
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
      [2946, 5614],
      [3016, 5573],
      [3784, 5829],
      [3872, 5701],
      [3856, 5661],
      [3825, 5632]
    ]
  },
  {
    id: 'sea_sunspear_volantis',
    from: 'sunspear',
    to: 'volantis',
    name: 'Trans-Summer Sea Commercial Highway',
    terrainType: 'fair_winds',
    waypoints: [
      [2404, 5599],
      [2424, 5597],
      [3128, 5789],
      [3612, 5784],
      [3781, 5780],
      [3840, 5777],
      [3861, 5776],
      [3872, 5774],
      [3856, 5661],
      [3825, 5632]
    ]
  },
  {
    id: 'sea_pyke_lannisport',
    from: 'pyke',
    to: 'lannisport',
    name: 'Ironman\'s Bay to Lannisport Passage',
    terrainType: 'coastal_sea',
    waypoints: [
      [1051, 4043],
      [808, 4502],
      [840, 4526],
      [984, 4494],
      [992, 4494],
      [1020, 4500]
    ]
  },
  {
    id: 'sea_lannisport_oldtown',
    from: 'lannisport',
    to: 'oldtown',
    name: 'Sunset Sea Coastal Lane',
    terrainType: 'coastal_sea',
    waypoints: [
      [1020, 4500],
      [992, 4494],
      [904, 4510],
      [808, 5445],
      [896, 5469],
      [1000, 5389],
      [1031, 5365]
    ]
  },
  {
    id: 'sea_oldtown_arbor',
    from: 'oldtown',
    to: 'the_arbor',
    name: 'Whispering Sound Lane',
    terrainType: 'fair_winds',
    waypoints: [
      [1031, 5365],
      [1000, 5389],
      [856, 5533],
      [825, 5590]
    ]
  },
  {
    id: 'sea_arbor_sunspear',
    from: 'the_arbor',
    to: 'sunspear',
    name: 'Redwyne Straits & South Dorne Pass',
    terrainType: 'coastal_sea',
    waypoints: [
      [825, 5590],
      [1480, 5797],
      [2344, 5725],
      [2432, 5613],
      [2424, 5597],
      [2404, 5599]
    ]
  },
  {
    id: 'sea_arbor_summer_isles',
    from: 'the_arbor',
    to: 'port_lotus',
    name: 'Swan Ship Passage to Summer Isles',
    terrainType: 'fair_winds',
    waypoints: [
      [825, 5590],
      [1096, 5789],
      [2656, 7588],
      [2847, 7661]
    ]
  },
  {
    id: 'sea_volantis_astapor',
    from: 'volantis',
    to: 'astapor',
    name: 'Gulf of Grief Slaver Route (Valyria Bypass)',
    terrainType: 'fair_winds',
    waypoints: [
      [3825, 5632],
      [3856, 5661],
      [4064, 6565],
      [4536, 6613],
      [4800, 6085],
      [4768, 5757],
      [4976, 5717],
      [5216, 5834]
    ]
  },
  {
    id: 'sea_astapor_yunkai',
    from: 'astapor',
    to: 'yunkai',
    name: 'Slaver\'s Bay Southern Waterway',
    terrainType: 'coastal_sea',
    waypoints: [
      [5216, 5834],
      [5240, 5461],
      [5248, 5461],
      [5288, 5494]
    ]
  },
  {
    id: 'sea_yunkai_meereen',
    from: 'yunkai',
    to: 'meereen',
    name: 'Slaver\'s Bay Northern Waterway',
    terrainType: 'coastal_sea',
    waypoints: [
      [5288, 5494],
      [5360, 5389],
      [5376, 5381],
      [5384, 5381],
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
      [4888, 5733],
      [4728, 5853],
      [4920, 6165],
      [5312, 6573],
      [5360, 6541],
      [5356, 6522]
    ]
  },
  {
    id: 'sea_volantis_qarth',
    from: 'volantis',
    to: 'qarth',
    name: 'Great Summer Sea Highway to Qarth',
    terrainType: 'fair_winds',
    waypoints: [
      [3825, 5632],
      [3856, 5661],
      [4064, 6565],
      [5104, 6661],
      [6872, 6205],
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
      [6649, 6428],
      [6626, 6491],
      [6728, 6613],
      [6768, 6589],
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
      [6884, 6196],
      [6912, 6229],
      [7200, 6301],
      [7824, 6613],
      [7841, 6592]
    ]
  },
  {
    id: 'sea_faros_leng_yi',
    from: 'faros',
    to: 'leng_yi',
    name: 'Great Moraq to Leng Trade Wind Corridor',
    terrainType: 'fair_winds',
    waypoints: [
      [6778, 6573],
      [6768, 6589],
      [6752, 6685],
      [7016, 7165],
      [8216, 6637],
      [8344, 6445],
      [8488, 6469],
      [8488, 6477],
      [8473, 6501]
    ]
  },
  {
    id: 'sea_yin_jinqi',
    from: 'yin',
    to: 'jinqi',
    name: 'Imperial Yi Ti Coast Waterway',
    terrainType: 'coastal_sea',
    waypoints: [
      [7841, 6592],
      [8208, 6677],
      [8336, 6445],
      [8552, 6365],
      [8600, 6365],
      [8626, 6365]
    ]
  },
  {
    id: 'sea_jinqi_asshai',
    from: 'jinqi',
    to: 'asshai',
    name: 'Saffron Straits Corridor to Asshai',
    terrainType: 'fair_winds',
    waypoints: [
      [8626, 6365],
      [8600, 6365],
      [8552, 6365],
      [8528, 6405],
      [8656, 6733],
      [8907, 7442]
    ]
  },
  {
    id: 'sea_leng_asshai',
    from: 'leng_yi',
    to: 'asshai',
    name: 'Jade Sea Deep Crossing to Shadow Lands',
    terrainType: 'fair_winds',
    waypoints: [
      [8473, 6501],
      [8488, 6477],
      [8656, 6573],
      [8907, 7442]
    ]
  },
  {
    id: 'sea_storms_end_sunspear',
    from: 'storms_end',
    to: 'sunspear',
    name: 'Sea of Dorne Coastal Route (Shipbreaker to Sunspear)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2253, 4945],
      [2264, 4966],
      [2288, 4982],
      [2544, 5078],
      [2472, 5413],
      [2544, 5493],
      [2456, 5597],
      [2424, 5597],
      [2404, 5599]
    ]
  },
  {
    id: 'sea_dragonstone_gulltown',
    from: 'dragonstone',
    to: 'gulltown',
    name: 'Bay of Crabs Outer Reach (Dragonstone to Gulltown)',
    terrainType: 'coastal_sea',
    waypoints: [
      [2349, 4409],
      [2432, 4374],
      [2496, 4102],
      [2419, 4070]
    ]
  },
  {
    id: 'sea_saltpans_braavos',
    from: 'saltpans',
    to: 'braavos',
    name: 'Narrow Sea Crossing (Titan\'s Daughter Route)',
    terrainType: 'coastal_sea',
    waypoints: [
      [1971, 4223],
      [1984, 4206],
      [2048, 4246],
      [2264, 4238],
      [2900, 3717]
    ]
  },
  {
    id: 'sea_gulltown_braavos',
    from: 'gulltown',
    to: 'braavos',
    name: 'Vale to Braavos Trade Crossing',
    terrainType: 'coastal_sea',
    waypoints: [
      [2419, 4070],
      [2560, 4062],
      [2900, 3717]
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
      [1000, 5389],
      [864, 5517],
      [1008, 5701],
      [1232, 5573],
      [1272, 5533],
      [1280, 5525],
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
      [1280, 5525],
      [1264, 5541],
      [1184, 5693],
      [1344, 5797],
      [2336, 5733],
      [2432, 5613],
      [2424, 5597],
      [2404, 5599]
    ]
  },
  {
    id: 'sea_braavos_port_of_ibben',
    from: 'braavos',
    to: 'port_of_ibben',
    name: 'Shivering Sea Whaling Corridor (Braavos to Port of Ibben)',
    terrainType: 'dangerous_sea',
    waypoints: [
      [2900, 3717],
      [3048, 3630],
      [6344, 3422],
      [6560, 3310],
      [6536, 3174],
      [6504, 3142],
      [6475, 3108]
    ]
  },
  {
    id: 'sea_port_of_ibben_nefer',
    from: 'port_of_ibben',
    to: 'nefer',
    name: 'Eastern Shivering Sea Pass (Port of Ibben to Nefer)',
    terrainType: 'dangerous_sea',
    waypoints: [
      [6475, 3108],
      [6504, 3142],
      [6928, 3638],
      [8344, 3766],
      [8344, 3798],
      [8400, 3910],
      [8408, 3990],
      [8552, 4230],
      [8768, 4446],
      [8768, 4494],
      [8764, 4535]
    ]
  }
];

export const SEA_LANES: RouteEdge[] = RAW_SEA_LANES.map(createSeaEdge);
