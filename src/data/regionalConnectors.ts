import type { RouteEdge, TerrainType } from '../types';
import { NODES } from './nodes';
import { calculatePathLengthPixels, pixelsToMiles, pixelsToKm, pixelsToLeagues, sanitizeRouteWaypoints } from '../engine/scale';

interface RawConnector {
  id: string;
  from: string;
  to: string;
  name: string;
  segmentType: 'land' | 'sea';
  terrainType: TerrainType;
  waypoints: [number, number][];
}

function createConnectorEdge(raw: RawConnector): RouteEdge {
  const fromNode = NODES[raw.from];
  const toNode = NODES[raw.to];
  const fromCoords: [number, number] = fromNode ? fromNode.coords : (raw.waypoints[0] || [0, 0]);
  const toCoords: [number, number] = toNode ? toNode.coords : (raw.waypoints[raw.waypoints.length - 1] || [0, 0]);

  const waypoints = sanitizeRouteWaypoints(raw.waypoints, fromCoords, toCoords);

  const lengthPx = calculatePathLengthPixels(waypoints);
  const distanceMiles = Math.max(1, Math.round(pixelsToMiles(lengthPx)));
  const distanceKm = Math.max(1, Math.round(pixelsToKm(lengthPx)));
  const distanceLeagues = Math.max(1, Math.round(pixelsToLeagues(lengthPx)));

  return {
    id: raw.id,
    from: raw.from,
    to: raw.to,
    name: raw.name,
    segmentType: raw.segmentType,
    terrainType: raw.terrainType,
    waypoints,
    distanceMiles,
    distanceKm,
    distanceLeagues
  };
}

const RAW_CONNECTORS: RawConnector[] = [
  {
    "id": "conn_barrowton_goldgrass",
    "from": "barrowton",
    "to": "goldgrass",
    "name": "Regional Road: Barrowton to Goldgrass",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1340,
        3257
      ],
      [
        1363,
        3250
      ]
    ]
  },
  {
    "id": "conn_barrowton_torrhens_square",
    "from": "barrowton",
    "to": "torrhens_square",
    "name": "Regional Road: Barrowton to Torrhen's Square",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1340,
        3257
      ],
      [
        1384,
        3055
      ]
    ]
  },
  {
    "id": "conn_bear_island_deepwood_motte",
    "from": "bear_island",
    "to": "deepwood_motte",
    "name": "Coastal Passage: Bear Island to Deepwood Motte",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1256,
        2490
      ],
      [
        1370,
        2655
      ]
    ]
  },
  {
    "id": "conn_bear_island_tumbledown_tower",
    "from": "bear_island",
    "to": "tumbledown_tower",
    "name": "Coastal Passage: Bear Island to Tumbledown Tower",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1256,
        2490
      ],
      [
        1654,
        2786
      ]
    ]
  },
  {
    "id": "conn_breakstone_hill_the_dreadfort",
    "from": "breakstone_hill",
    "to": "the_dreadfort",
    "name": "Regional Road: Breakstone Hill to The Dreadfort",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1914,
        2820
      ],
      [
        2043,
        2835
      ]
    ]
  },
  {
    "id": "conn_breakstone_hill_hornwood",
    "from": "breakstone_hill",
    "to": "hornwood",
    "name": "Regional Road: Breakstone Hill to Hornwood",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1914,
        2820
      ],
      [
        2016,
        2991
      ]
    ]
  },
  {
    "id": "conn_castle_cerwyn_winterfell",
    "from": "castle_cerwyn",
    "to": "winterfell",
    "name": "Regional Road: Castle Cerwyn to Winterfell",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1615,
        2957
      ],
      [
        1631,
        2892
      ]
    ]
  },
  {
    "id": "conn_castle_cerwyn_tumbledown_tower",
    "from": "castle_cerwyn",
    "to": "tumbledown_tower",
    "name": "Regional Road: Castle Cerwyn to Tumbledown Tower",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1615,
        2957
      ],
      [
        1654,
        2786
      ]
    ]
  },
  {
    "id": "conn_crasters_keep_whitetree",
    "from": "crasters_keep",
    "to": "whitetree",
    "name": "Regional Road: Craster's Keep to Whitetree",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1867,
        2139
      ],
      [
        1938,
        2218
      ]
    ]
  },
  {
    "id": "conn_crasters_keep_nightfort",
    "from": "crasters_keep",
    "to": "nightfort",
    "name": "Regional Road: Craster's Keep to The Nightfort",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1867,
        2139
      ],
      [
        1857,
        2246
      ]
    ]
  },
  {
    "id": "conn_deepdown_kingshouse",
    "from": "deepdown",
    "to": "kingshouse",
    "name": "Coastal Passage: Deepdown to Kingshouse",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2389,
        2368
      ],
      [
        2400,
        2274
      ]
    ]
  },
  {
    "id": "conn_deepdown_karhold",
    "from": "deepdown",
    "to": "karhold",
    "name": "Coastal Passage: Deepdown to Karhold",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2389,
        2368
      ],
      [
        2355,
        2673
      ]
    ]
  },
  {
    "id": "conn_fist_of_the_first_men_crasters_keep",
    "from": "fist_of_the_first_men",
    "to": "crasters_keep",
    "name": "Regional Road: Fist of the First Men to Craster's Keep",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1718,
        2033
      ],
      [
        1867,
        2139
      ]
    ]
  },
  {
    "id": "conn_fist_of_the_first_men_shadow_tower",
    "from": "fist_of_the_first_men",
    "to": "shadow_tower",
    "name": "Regional Road: Fist of the First Men to The Shadow Tower",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1718,
        2033
      ],
      [
        1714,
        2285
      ]
    ]
  },
  {
    "id": "conn_flints_finger_barrowton",
    "from": "flints_finger",
    "to": "barrowton",
    "name": "Regional Road: Flint's Finger to Barrowton",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1079,
        3525
      ],
      [
        1340,
        3257
      ]
    ]
  },
  {
    "id": "conn_flints_finger_goldgrass",
    "from": "flints_finger",
    "to": "goldgrass",
    "name": "Regional Road: Flint's Finger to Goldgrass",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1079,
        3525
      ],
      [
        1363,
        3250
      ]
    ]
  },
  {
    "id": "conn_greywater_watch_the_twins",
    "from": "greywater_watch",
    "to": "the_twins",
    "name": "Regional Road: Greywater Watch to The Twins",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1550,
        3643
      ],
      [
        1570,
        3840
      ]
    ]
  },
  {
    "id": "conn_hardhome_eastwatch",
    "from": "hardhome",
    "to": "eastwatch",
    "name": "Regional Road: Hardhome to Eastwatch-by-the-Sea",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        2149,
        2032
      ],
      [
        2070,
        2248
      ]
    ]
  },
  {
    "id": "conn_hardhome_whitetree",
    "from": "hardhome",
    "to": "whitetree",
    "name": "Regional Road: Hardhome to Whitetree",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        2149,
        2032
      ],
      [
        1938,
        2218
      ]
    ]
  },
  {
    "id": "conn_hornwood_the_dreadfort",
    "from": "hornwood",
    "to": "the_dreadfort",
    "name": "Regional Road: Hornwood to The Dreadfort",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        2016,
        2991
      ],
      [
        2043,
        2835
      ]
    ]
  },
  {
    "id": "conn_last_hearth_queenscrown",
    "from": "last_hearth",
    "to": "queenscrown",
    "name": "Regional Road: Last Hearth to Queenscrown",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1965,
        2505
      ],
      [
        1877,
        2366
      ]
    ]
  },
  {
    "id": "conn_moles_town_castle_black",
    "from": "moles_town",
    "to": "castle_black",
    "name": "Regional Road: Mole's Town to Castle Black",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1946,
        2261
      ],
      [
        1930,
        2248
      ]
    ]
  },
  {
    "id": "conn_moles_town_whitetree",
    "from": "moles_town",
    "to": "whitetree",
    "name": "Regional Road: Mole's Town to Whitetree",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1946,
        2261
      ],
      [
        1938,
        2218
      ]
    ]
  },
  {
    "id": "conn_oldcastle_sisterton",
    "from": "oldcastle",
    "to": "sisterton",
    "name": "Coastal Passage: Oldcastle to Sisterton",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1925,
        3459
      ],
      [
        1987,
        3543
      ]
    ]
  },
  {
    "id": "conn_oldcastle_breakwater",
    "from": "oldcastle",
    "to": "breakwater",
    "name": "Coastal Passage: Oldcastle to Breakwater",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1925,
        3459
      ],
      [
        2001,
        3544
      ]
    ]
  },
  {
    "id": "conn_queenscrown_nightfort",
    "from": "queenscrown",
    "to": "nightfort",
    "name": "Regional Road: Queenscrown to The Nightfort",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        1877,
        2366
      ],
      [
        1857,
        2246
      ]
    ]
  },
  {
    "id": "conn_ramsgate_hornwood",
    "from": "ramsgate",
    "to": "hornwood",
    "name": "Regional Road: Ramsgate to Hornwood",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        2147,
        3205
      ],
      [
        2016,
        2991
      ]
    ]
  },
  {
    "id": "conn_ramsgate_widows_watch",
    "from": "ramsgate",
    "to": "widows_watch",
    "name": "Regional Road: Ramsgate to Widow's Watch",
    "segmentType": "land",
    "terrainType": "northern_snow",
    "waypoints": [
      [
        2147,
        3205
      ],
      [
        2395,
        3250
      ]
    ]
  },
  {
    "id": "conn_acorn_hall_high_heart",
    "from": "acorn_hall",
    "to": "high_heart",
    "name": "Regional Road: Acorn Hall to High Heart",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1592,
        4296
      ],
      [
        1621,
        4266
      ]
    ]
  },
  {
    "id": "conn_acorn_hall_wayfarers_rest",
    "from": "acorn_hall",
    "to": "wayfarers_rest",
    "name": "Regional Road: Acorn Hall to Wayfarer's Rest",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1592,
        4296
      ],
      [
        1533,
        4307
      ]
    ]
  },
  {
    "id": "conn_atranta_riverrun",
    "from": "atranta",
    "to": "riverrun",
    "name": "Regional Road: Atranta to Riverrun",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1546,
        4218
      ],
      [
        1515,
        4153
      ]
    ]
  },
  {
    "id": "conn_atranta_stone_hedge",
    "from": "atranta",
    "to": "stone_hedge",
    "name": "Regional Road: Atranta to Stone Hedge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1546,
        4218
      ],
      [
        1602,
        4154
      ]
    ]
  },
  {
    "id": "conn_darry_ruby_ford",
    "from": "darry",
    "to": "ruby_ford",
    "name": "Regional Road: Castle Darry to Ruby Ford",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1861,
        4199
      ],
      [
        1830,
        4196
      ]
    ]
  },
  {
    "id": "conn_darry_crossroads_inn",
    "from": "darry",
    "to": "crossroads_inn",
    "name": "Regional Road: Castle Darry to Inn at the Crossroads",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1861,
        4199
      ],
      [
        1845,
        4153
      ]
    ]
  },
  {
    "id": "conn_lychester_stone_hedge",
    "from": "lychester",
    "to": "stone_hedge",
    "name": "Regional Road: Castle Lychester to Stone Hedge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1647,
        4198
      ],
      [
        1602,
        4154
      ]
    ]
  },
  {
    "id": "conn_lychester_lambswold",
    "from": "lychester",
    "to": "lambswold",
    "name": "Regional Road: Castle Lychester to Lambswold",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1647,
        4198
      ],
      [
        1625,
        4138
      ]
    ]
  },
  {
    "id": "conn_crossed_elms_lake_town",
    "from": "crossed_elms",
    "to": "lake_town",
    "name": "Regional Road: Crossed Elms to Lake Town",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1740,
        4349
      ],
      [
        1761,
        4420
      ]
    ]
  },
  {
    "id": "conn_crossed_elms_rushing_falls",
    "from": "crossed_elms",
    "to": "rushing_falls",
    "name": "Regional Road: Crossed Elms to Rushing Falls",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1740,
        4349
      ],
      [
        1669,
        4310
      ]
    ]
  },
  {
    "id": "conn_fairmarket_wendish_town",
    "from": "fairmarket",
    "to": "wendish_town",
    "name": "Regional Road: Fairmarket to Wendish Town",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1676,
        4045
      ],
      [
        1599,
        4025
      ]
    ]
  },
  {
    "id": "conn_fairmarket_ramsford",
    "from": "fairmarket",
    "to": "ramsford",
    "name": "Regional Road: Fairmarket to Ramsford",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1676,
        4045
      ],
      [
        1611,
        3998
      ]
    ]
  },
  {
    "id": "conn_hags_mire_sevenstreams",
    "from": "hags_mire",
    "to": "sevenstreams",
    "name": "Regional Road: Hag's Mire to Sevenstreams",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1575,
        3931
      ],
      [
        1577,
        3955
      ]
    ]
  },
  {
    "id": "conn_hags_mire_oldstones",
    "from": "hags_mire",
    "to": "oldstones",
    "name": "Regional Road: Hag's Mire to Oldstones",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1575,
        3931
      ],
      [
        1594,
        3946
      ]
    ]
  },
  {
    "id": "conn_harrenhal_crossed_elms",
    "from": "harrenhal",
    "to": "crossed_elms",
    "name": "Regional Road: Harrenhal to Crossed Elms",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1785,
        4275
      ],
      [
        1740,
        4349
      ]
    ]
  },
  {
    "id": "conn_harrenhal_whitewalls",
    "from": "harrenhal",
    "to": "whitewalls",
    "name": "Regional Road: Harrenhal to Whitewalls",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1785,
        4275
      ],
      [
        1866,
        4316
      ]
    ]
  },
  {
    "id": "conn_lake_town_briarwhite",
    "from": "lake_town",
    "to": "briarwhite",
    "name": "Regional Road: Lake Town to Briarwhite",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1761,
        4420
      ],
      [
        1822,
        4426
      ]
    ]
  },
  {
    "id": "conn_lambswold_stone_hedge",
    "from": "lambswold",
    "to": "stone_hedge",
    "name": "Regional Road: Lambswold to Stone Hedge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1625,
        4138
      ],
      [
        1602,
        4154
      ]
    ]
  },
  {
    "id": "conn_harroway_nutten",
    "from": "harroway",
    "to": "nutten",
    "name": "Regional Road: Lord Harroway's Town to Nutten",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1778,
        4146
      ],
      [
        1767,
        4133
      ]
    ]
  },
  {
    "id": "conn_harroway_riverbend",
    "from": "harroway",
    "to": "riverbend",
    "name": "Regional Road: Lord Harroway's Town to Riverbend",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1778,
        4146
      ],
      [
        1727,
        4153
      ]
    ]
  },
  {
    "id": "conn_mudgrave_pennytree",
    "from": "mudgrave",
    "to": "pennytree",
    "name": "Regional Road: Mudgrave to Pennytree",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1575,
        4102
      ],
      [
        1575,
        4102
      ]
    ]
  },
  {
    "id": "conn_mudgrave_raventree_hall",
    "from": "mudgrave",
    "to": "raventree_hall",
    "name": "Regional Road: Mudgrave to Raventree Hall",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1575,
        4102
      ],
      [
        1547,
        4089
      ]
    ]
  },
  {
    "id": "conn_mummers_ford_sherrer",
    "from": "mummers_ford",
    "to": "sherrer",
    "name": "Regional Road: Mummer's Ford to Sherrer",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1462,
        4306
      ],
      [
        1462,
        4306
      ]
    ]
  },
  {
    "id": "conn_mummers_ford_pinkmaiden",
    "from": "mummers_ford",
    "to": "pinkmaiden",
    "name": "Regional Road: Mummer's Ford to Pinkmaiden Castle",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1462,
        4306
      ],
      [
        1475,
        4345
      ]
    ]
  },
  {
    "id": "conn_oldstones_sevenstreams",
    "from": "oldstones",
    "to": "sevenstreams",
    "name": "Regional Road: Oldstones to Sevenstreams",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1594,
        3946
      ],
      [
        1577,
        3955
      ]
    ]
  },
  {
    "id": "conn_ramsford_wendish_town",
    "from": "ramsford",
    "to": "wendish_town",
    "name": "Regional Road: Ramsford to Wendish Town",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1611,
        3998
      ],
      [
        1599,
        4025
      ]
    ]
  },
  {
    "id": "conn_riverbend_nutten",
    "from": "riverbend",
    "to": "nutten",
    "name": "Regional Road: Riverbend to Nutten",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1727,
        4153
      ],
      [
        1767,
        4133
      ]
    ]
  },
  {
    "id": "conn_rushing_falls_high_heart",
    "from": "rushing_falls",
    "to": "high_heart",
    "name": "Regional Road: Rushing Falls to High Heart",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1669,
        4310
      ],
      [
        1621,
        4266
      ]
    ]
  },
  {
    "id": "conn_sallydance_riverbend",
    "from": "sallydance",
    "to": "riverbend",
    "name": "Regional Road: Sallydance to Riverbend",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1684,
        4133
      ],
      [
        1727,
        4153
      ]
    ]
  },
  {
    "id": "conn_sallydance_lambswold",
    "from": "sallydance",
    "to": "lambswold",
    "name": "Regional Road: Sallydance to Lambswold",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1684,
        4133
      ],
      [
        1625,
        4138
      ]
    ]
  },
  {
    "id": "conn_seagard_hags_mire",
    "from": "seagard",
    "to": "hags_mire",
    "name": "Regional Road: Seagard to Hag's Mire",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1503,
        3901
      ],
      [
        1575,
        3931
      ]
    ]
  },
  {
    "id": "conn_seagard_the_twins",
    "from": "seagard",
    "to": "the_twins",
    "name": "Regional Road: Seagard to The Twins",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1503,
        3901
      ],
      [
        1570,
        3840
      ]
    ]
  },
  {
    "id": "conn_stoney_sept_tumblers_falls",
    "from": "stoney_sept",
    "to": "tumblers_falls",
    "name": "Regional Road: Stoney Sept to Tumbler's Falls",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1571,
        4434
      ],
      [
        1651,
        4457
      ]
    ]
  },
  {
    "id": "conn_stoney_sept_pinkmaiden",
    "from": "stoney_sept",
    "to": "pinkmaiden",
    "name": "Regional Road: Stoney Sept to Pinkmaiden Castle",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1571,
        4434
      ],
      [
        1475,
        4345
      ]
    ]
  },
  {
    "id": "conn_quiet_isle_saltpans",
    "from": "quiet_isle",
    "to": "saltpans",
    "name": "Regional Road: The Quiet Isle to Saltpans",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1990,
        4251
      ],
      [
        1971,
        4223
      ]
    ]
  },
  {
    "id": "conn_quiet_isle_widows_ford",
    "from": "quiet_isle",
    "to": "widows_ford",
    "name": "Regional Road: The Quiet Isle to Widow's Ford",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1990,
        4251
      ],
      [
        1953,
        4214
      ]
    ]
  },
  {
    "id": "conn_whitewalls_sows_horn",
    "from": "whitewalls",
    "to": "sows_horn",
    "name": "Regional Road: Whitewalls to Sow's Horn",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1866,
        4316
      ],
      [
        1883,
        4384
      ]
    ]
  },
  {
    "id": "conn_widows_ford_saltpans",
    "from": "widows_ford",
    "to": "saltpans",
    "name": "Regional Road: Widow's Ford to Saltpans",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1953,
        4214
      ],
      [
        1971,
        4223
      ]
    ]
  },
  {
    "id": "conn_willow_wood_riverrun",
    "from": "willow_wood",
    "to": "riverrun",
    "name": "Regional Road: Willow Wood to Riverrun",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1428,
        4162
      ],
      [
        1515,
        4153
      ]
    ]
  },
  {
    "id": "conn_willow_wood_atranta",
    "from": "willow_wood",
    "to": "atranta",
    "name": "Regional Road: Willow Wood to Atranta",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1428,
        4162
      ],
      [
        1546,
        4218
      ]
    ]
  },
  {
    "id": "conn_baelish_keep_coldwater_burn",
    "from": "baelish_keep",
    "to": "coldwater_burn",
    "name": "Regional Road: Baelish Keep to Coldwater Burn",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2155,
        3611
      ],
      [
        2222,
        3727
      ]
    ]
  },
  {
    "id": "conn_baelish_keep_breakwater",
    "from": "baelish_keep",
    "to": "breakwater",
    "name": "Regional Road: Baelish Keep to Breakwater",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2155,
        3611
      ],
      [
        2001,
        3544
      ]
    ]
  },
  {
    "id": "conn_coldwater_burn_snakewood",
    "from": "coldwater_burn",
    "to": "snakewood",
    "name": "Regional Road: Coldwater Burn to Snakewood",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2222,
        3727
      ],
      [
        2219,
        3790
      ]
    ]
  },
  {
    "id": "conn_gates_of_the_moon_eyrie",
    "from": "gates_of_the_moon",
    "to": "eyrie",
    "name": "Regional Road: Gates of the Moon to The Eyrie",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2066,
        4012
      ],
      [
        2060,
        3975
      ]
    ]
  },
  {
    "id": "conn_gates_of_the_moon_bloody_gate",
    "from": "gates_of_the_moon",
    "to": "bloody_gate",
    "name": "Regional Road: Gates of the Moon to The Bloody Gate",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2066,
        4012
      ],
      [
        1970,
        4055
      ]
    ]
  },
  {
    "id": "conn_hearts_home_snakewood",
    "from": "hearts_home",
    "to": "snakewood",
    "name": "Regional Road: Heart's Home to Snakewood",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2139,
        3870
      ],
      [
        2219,
        3790
      ]
    ]
  },
  {
    "id": "conn_hearts_home_eyrie",
    "from": "hearts_home",
    "to": "eyrie",
    "name": "Regional Road: Heart's Home to The Eyrie",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2139,
        3870
      ],
      [
        2060,
        3975
      ]
    ]
  },
  {
    "id": "conn_ironoaks_redfort",
    "from": "ironoaks",
    "to": "redfort",
    "name": "Regional Road: Ironoaks to Redfort",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2227,
        4017
      ],
      [
        2184,
        4107
      ]
    ]
  },
  {
    "id": "conn_ironoaks_gates_of_the_moon",
    "from": "ironoaks",
    "to": "gates_of_the_moon",
    "name": "Regional Road: Ironoaks to Gates of the Moon",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2227,
        4017
      ],
      [
        2066,
        4012
      ]
    ]
  },
  {
    "id": "conn_longbow_hall_old_anchor",
    "from": "longbow_hall",
    "to": "old_anchor",
    "name": "Regional Road: Longbow Hall to Old Anchor",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2359,
        3857
      ],
      [
        2386,
        3953
      ]
    ]
  },
  {
    "id": "conn_longbow_hall_snakewood",
    "from": "longbow_hall",
    "to": "snakewood",
    "name": "Regional Road: Longbow Hall to Snakewood",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2359,
        3857
      ],
      [
        2219,
        3790
      ]
    ]
  },
  {
    "id": "conn_old_anchor_runestone",
    "from": "old_anchor",
    "to": "runestone",
    "name": "Regional Road: Old Anchor to Runestone",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2386,
        3953
      ],
      [
        2427,
        4030
      ]
    ]
  },
  {
    "id": "conn_runestone_gulltown",
    "from": "runestone",
    "to": "gulltown",
    "name": "Regional Road: Runestone to Gulltown",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2427,
        4030
      ],
      [
        2419,
        4070
      ]
    ]
  },
  {
    "id": "conn_sisterton_breakwater",
    "from": "sisterton",
    "to": "breakwater",
    "name": "Regional Road: Sisterton to Breakwater",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        1987,
        3543
      ],
      [
        2001,
        3544
      ]
    ]
  },
  {
    "id": "conn_strongsong_eyrie",
    "from": "strongsong",
    "to": "eyrie",
    "name": "Regional Road: Strongsong to The Eyrie",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        1959,
        3866
      ],
      [
        2060,
        3975
      ]
    ]
  },
  {
    "id": "conn_strongsong_hearts_home",
    "from": "strongsong",
    "to": "hearts_home",
    "name": "Regional Road: Strongsong to Heart's Home",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        1959,
        3866
      ],
      [
        2139,
        3870
      ]
    ]
  },
  {
    "id": "conn_wickenden_brownhollow",
    "from": "wickenden",
    "to": "brownhollow",
    "name": "Regional Road: Wickenden to Brownhollow",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2264,
        4296
      ],
      [
        2264,
        4296
      ]
    ]
  },
  {
    "id": "conn_wickenden_dyre_den",
    "from": "wickenden",
    "to": "dyre_den",
    "name": "Coastal Passage: Wickenden to Dyre Den",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2264,
        4296
      ],
      [
        2349,
        4263
      ]
    ]
  },
  {
    "id": "conn_hammerhorn_saltcliffe",
    "from": "hammerhorn",
    "to": "saltcliffe",
    "name": "Coastal Passage: Hammerhorn to Saltcliffe",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        948,
        3992
      ],
      [
        977,
        4044
      ]
    ]
  },
  {
    "id": "conn_hammerhorn_sealskin_point",
    "from": "hammerhorn",
    "to": "sealskin_point",
    "name": "Coastal Passage: Hammerhorn to Sealskin Point",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        948,
        3992
      ],
      [
        938,
        3905
      ]
    ]
  },
  {
    "id": "conn_lordsport_pyke",
    "from": "lordsport",
    "to": "pyke",
    "name": "Coastal Passage: Lordsport to Pyke",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1074,
        4063
      ],
      [
        1051,
        4043
      ]
    ]
  },
  {
    "id": "conn_lordsport_banefort",
    "from": "lordsport",
    "to": "banefort",
    "name": "Coastal Passage: Lordsport to Banefort",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1074,
        4063
      ],
      [
        1109,
        4101
      ]
    ]
  },
  {
    "id": "conn_ten_towers_volmark",
    "from": "ten_towers",
    "to": "volmark",
    "name": "Coastal Passage: Ten Towers to Volmark",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1183,
        3959
      ],
      [
        1147,
        4002
      ]
    ]
  },
  {
    "id": "conn_ten_towers_lordsport",
    "from": "ten_towers",
    "to": "lordsport",
    "name": "Coastal Passage: Ten Towers to Lordsport",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1183,
        3959
      ],
      [
        1074,
        4063
      ]
    ]
  },
  {
    "id": "conn_ashemark_castamere",
    "from": "ashemark",
    "to": "castamere",
    "name": "Regional Road: Ashemark to Castamere",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1179,
        4296
      ],
      [
        1122,
        4287
      ]
    ]
  },
  {
    "id": "conn_ashemark_oxcross",
    "from": "ashemark",
    "to": "oxcross",
    "name": "Regional Road: Ashemark to Oxcross",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1179,
        4296
      ],
      [
        1210,
        4350
      ]
    ]
  },
  {
    "id": "conn_castamere_tarbeck_hall",
    "from": "castamere",
    "to": "tarbeck_hall",
    "name": "Regional Road: Castamere to Tarbeck Hall",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1122,
        4287
      ],
      [
        1119,
        4336
      ]
    ]
  },
  {
    "id": "conn_clegane_keep_lannisport",
    "from": "clegane_keep",
    "to": "lannisport",
    "name": "Regional Road: Clegane's Keep to Lannisport",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1129,
        4516
      ],
      [
        1020,
        4500
      ]
    ]
  },
  {
    "id": "conn_clegane_keep_casterly_rock",
    "from": "clegane_keep",
    "to": "casterly_rock",
    "name": "Regional Road: Clegane's Keep to Casterly Rock",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1129,
        4516
      ],
      [
        1023,
        4467
      ]
    ]
  },
  {
    "id": "conn_cornfield_red_lake",
    "from": "cornfield",
    "to": "red_lake",
    "name": "Regional Road: Cornfield to Red Lake",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1108,
        4663
      ],
      [
        1129,
        4769
      ]
    ]
  },
  {
    "id": "conn_cornfield_clegane_keep",
    "from": "cornfield",
    "to": "clegane_keep",
    "name": "Regional Road: Cornfield to Clegane's Keep",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1108,
        4663
      ],
      [
        1129,
        4516
      ]
    ]
  },
  {
    "id": "conn_faircastle_kayce",
    "from": "faircastle",
    "to": "kayce",
    "name": "Regional Road: Faircastle to Kayce",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        924,
        4339
      ],
      [
        891,
        4454
      ]
    ]
  },
  {
    "id": "conn_faircastle_casterly_rock",
    "from": "faircastle",
    "to": "casterly_rock",
    "name": "Regional Road: Faircastle to Casterly Rock",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        924,
        4339
      ],
      [
        1023,
        4467
      ]
    ]
  },
  {
    "id": "conn_feastfires_kayce",
    "from": "feastfires",
    "to": "kayce",
    "name": "Regional Road: Feastfires to Kayce",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        861,
        4495
      ],
      [
        891,
        4454
      ]
    ]
  },
  {
    "id": "conn_feastfires_lannisport",
    "from": "feastfires",
    "to": "lannisport",
    "name": "Regional Road: Feastfires to Lannisport",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        861,
        4495
      ],
      [
        1020,
        4500
      ]
    ]
  },
  {
    "id": "conn_hornvale_deep_den",
    "from": "hornvale",
    "to": "deep_den",
    "name": "Regional Road: Hornvale to Deep Den",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1292,
        4407
      ],
      [
        1287,
        4475
      ]
    ]
  },
  {
    "id": "conn_hornvale_golden_tooth",
    "from": "hornvale",
    "to": "golden_tooth",
    "name": "Regional Road: Hornvale to The Golden Tooth",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1292,
        4407
      ],
      [
        1290,
        4310
      ]
    ]
  },
  {
    "id": "conn_oxcross_sarsfield",
    "from": "oxcross",
    "to": "sarsfield",
    "name": "Regional Road: Oxcross to Sarsfield",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1210,
        4350
      ],
      [
        1157,
        4366
      ]
    ]
  },
  {
    "id": "conn_sarsfield_tarbeck_hall",
    "from": "sarsfield",
    "to": "tarbeck_hall",
    "name": "Regional Road: Sarsfield to Tarbeck Hall",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1157,
        4366
      ],
      [
        1119,
        4336
      ]
    ]
  },
  {
    "id": "conn_silverhill_deep_den",
    "from": "silverhill",
    "to": "deep_den",
    "name": "Regional Road: Silverhill to Deep Den",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1275,
        4546
      ],
      [
        1287,
        4475
      ]
    ]
  },
  {
    "id": "conn_silverhill_hornvale",
    "from": "silverhill",
    "to": "hornvale",
    "name": "Regional Road: Silverhill to Hornvale",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1275,
        4546
      ],
      [
        1292,
        4407
      ]
    ]
  },
  {
    "id": "conn_the_crag_castamere",
    "from": "the_crag",
    "to": "castamere",
    "name": "Regional Road: The Crag to Castamere",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1084,
        4221
      ],
      [
        1122,
        4287
      ]
    ]
  },
  {
    "id": "conn_the_crag_tarbeck_hall",
    "from": "the_crag",
    "to": "tarbeck_hall",
    "name": "Regional Road: The Crag to Tarbeck Hall",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1084,
        4221
      ],
      [
        1119,
        4336
      ]
    ]
  },
  {
    "id": "conn_antlers_brindlewood",
    "from": "antlers",
    "to": "brindlewood",
    "name": "Regional Road: Antlers to Brindlewood",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1978,
        4398
      ],
      [
        1960,
        4438
      ]
    ]
  },
  {
    "id": "conn_antlers_sows_horn",
    "from": "antlers",
    "to": "sows_horn",
    "name": "Regional Road: Antlers to Sow's Horn",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1978,
        4398
      ],
      [
        1883,
        4384
      ]
    ]
  },
  {
    "id": "conn_stokeworth_rosby",
    "from": "stokeworth",
    "to": "rosby",
    "name": "Regional Road: Castle Stokeworth to Rosby",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2042,
        4538
      ],
      [
        2006,
        4565
      ]
    ]
  },
  {
    "id": "conn_stokeworth_old_stonebridge",
    "from": "stokeworth",
    "to": "old_stonebridge",
    "name": "Regional Road: Castle Stokeworth to Old Stonebridge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2042,
        4538
      ],
      [
        2102,
        4561
      ]
    ]
  },
  {
    "id": "conn_celtigar_keep_the_whispers",
    "from": "celtigar_keep",
    "to": "the_whispers",
    "name": "Regional Road: Claw Isle (Celtigar Keep) to The Whispers",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2440,
        4277
      ],
      [
        2388,
        4259
      ]
    ]
  },
  {
    "id": "conn_celtigar_keep_dyre_den",
    "from": "celtigar_keep",
    "to": "dyre_den",
    "name": "Regional Road: Claw Isle (Celtigar Keep) to Dyre Den",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2440,
        4277
      ],
      [
        2349,
        4263
      ]
    ]
  },
  {
    "id": "conn_hayford_kings_landing",
    "from": "hayford",
    "to": "kings_landing",
    "name": "Regional Road: Hayford to King's Landing",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1942,
        4585
      ],
      [
        1942,
        4589
      ]
    ]
  },
  {
    "id": "conn_hayford_rosby",
    "from": "hayford",
    "to": "rosby",
    "name": "Regional Road: Hayford to Rosby",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1942,
        4585
      ],
      [
        2006,
        4565
      ]
    ]
  },
  {
    "id": "conn_high_tide_driftmark",
    "from": "high_tide",
    "to": "driftmark",
    "name": "Coastal Passage: High Tide to Driftmark",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2326,
        4432
      ],
      [
        2326,
        4433
      ]
    ]
  },
  {
    "id": "conn_high_tide_dragonstone",
    "from": "high_tide",
    "to": "dragonstone",
    "name": "Coastal Passage: High Tide to Dragonstone",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2326,
        4432
      ],
      [
        2349,
        4409
      ]
    ]
  },
  {
    "id": "conn_hull_spicetown",
    "from": "hull",
    "to": "spicetown",
    "name": "Regional Road: Hull to Spicetown",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2257,
        4432
      ],
      [
        2251,
        4463
      ]
    ]
  },
  {
    "id": "conn_hull_high_tide",
    "from": "hull",
    "to": "high_tide",
    "name": "Regional Road: Hull to High Tide",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2257,
        4432
      ],
      [
        2326,
        4432
      ]
    ]
  },
  {
    "id": "conn_rambton_sweetport_sound",
    "from": "rambton",
    "to": "sweetport_sound",
    "name": "Regional Road: Rambton Castle to Sweetport Sound",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2317,
        4569
      ],
      [
        2297,
        4588
      ]
    ]
  },
  {
    "id": "conn_rambton_stonedance",
    "from": "rambton",
    "to": "stonedance",
    "name": "Regional Road: Rambton Castle to Stonedance",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2317,
        4569
      ],
      [
        2361,
        4562
      ]
    ]
  },
  {
    "id": "conn_rooks_rest_hull",
    "from": "rooks_rest",
    "to": "hull",
    "name": "Regional Road: Rook's Rest to Hull",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2191,
        4379
      ],
      [
        2257,
        4432
      ]
    ]
  },
  {
    "id": "conn_rooks_rest_spicetown",
    "from": "rooks_rest",
    "to": "spicetown",
    "name": "Regional Road: Rook's Rest to Spicetown",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2191,
        4379
      ],
      [
        2251,
        4463
      ]
    ]
  },
  {
    "id": "conn_sharp_point_rambton",
    "from": "sharp_point",
    "to": "rambton",
    "name": "Regional Road: Sharp Point to Rambton Castle",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2326,
        4515
      ],
      [
        2317,
        4569
      ]
    ]
  },
  {
    "id": "conn_sharp_point_stonedance",
    "from": "sharp_point",
    "to": "stonedance",
    "name": "Regional Road: Sharp Point to Stonedance",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2326,
        4515
      ],
      [
        2361,
        4562
      ]
    ]
  },
  {
    "id": "conn_the_whispers_dyre_den",
    "from": "the_whispers",
    "to": "dyre_den",
    "name": "Regional Road: The Whispers to Dyre Den",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2388,
        4259
      ],
      [
        2349,
        4263
      ]
    ]
  },
  {
    "id": "conn_wendwater_bridge_bronzegate",
    "from": "wendwater_bridge",
    "to": "bronzegate",
    "name": "Regional Road: Wendwater Bridge to Bronzegate",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2210,
        4772
      ],
      [
        2195,
        4817
      ]
    ]
  },
  {
    "id": "conn_wendwater_bridge_haystack_hall",
    "from": "wendwater_bridge",
    "to": "haystack_hall",
    "name": "Regional Road: Wendwater Bridge to Haystack Hall",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        2210,
        4772
      ],
      [
        2195,
        4817
      ]
    ]
  },
  {
    "id": "conn_blackhaven_harvest_hall",
    "from": "blackhaven",
    "to": "harvest_hall",
    "name": "Regional Road: Blackhaven to Harvest Hall",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        1786,
        5128
      ],
      [
        1707,
        5110
      ]
    ]
  },
  {
    "id": "conn_blackhaven_wyl",
    "from": "blackhaven",
    "to": "wyl",
    "name": "Regional Road: Blackhaven to Castle Wyl",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1786,
        5128
      ],
      [
        1848,
        5222
      ]
    ]
  },
  {
    "id": "conn_crows_nest_griffins_roost",
    "from": "crows_nest",
    "to": "griffins_roost",
    "name": "Regional Road: Crow's Nest to Griffin's Roost",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2109,
        5085
      ],
      [
        2171,
        5010
      ]
    ]
  },
  {
    "id": "conn_crows_nest_fawnton",
    "from": "crows_nest",
    "to": "fawnton",
    "name": "Regional Road: Crow's Nest to Fawnton",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2109,
        5085
      ],
      [
        2121,
        5183
      ]
    ]
  },
  {
    "id": "conn_evenfall_hall_tarth",
    "from": "evenfall_hall",
    "to": "tarth",
    "name": "Coastal Passage: Evenfall Hall to Evenfall Hall (Tarth)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2412,
        4920
      ],
      [
        2412,
        4921
      ]
    ]
  },
  {
    "id": "conn_evenfall_hall_morne",
    "from": "evenfall_hall",
    "to": "morne",
    "name": "Coastal Passage: Evenfall Hall to Morne",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2412,
        4920
      ],
      [
        2464,
        4896
      ]
    ]
  },
  {
    "id": "conn_fawnton_stonehelm",
    "from": "fawnton",
    "to": "stonehelm",
    "name": "Regional Road: Fawnton to Stonehelm",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2121,
        5183
      ],
      [
        2035,
        5151
      ]
    ]
  },
  {
    "id": "conn_felwood_bronzegate",
    "from": "felwood",
    "to": "bronzegate",
    "name": "Regional Road: Felwood to Bronzegate",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2070,
        4876
      ],
      [
        2195,
        4817
      ]
    ]
  },
  {
    "id": "conn_felwood_haystack_hall",
    "from": "felwood",
    "to": "haystack_hall",
    "name": "Regional Road: Felwood to Haystack Hall",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2070,
        4876
      ],
      [
        2195,
        4817
      ]
    ]
  },
  {
    "id": "conn_greenstone_mistwood",
    "from": "greenstone",
    "to": "mistwood",
    "name": "Regional Road: Greenstone to Mistwood",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2388,
        5217
      ],
      [
        2267,
        5169
      ]
    ]
  },
  {
    "id": "conn_greenstone_weeping_town",
    "from": "greenstone",
    "to": "weeping_town",
    "name": "Regional Road: Greenstone to Weeping Town",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2388,
        5217
      ],
      [
        2260,
        5245
      ]
    ]
  },
  {
    "id": "conn_mistwood_weeping_town",
    "from": "mistwood",
    "to": "weeping_town",
    "name": "Regional Road: Mistwood to Weeping Town",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2267,
        5169
      ],
      [
        2260,
        5245
      ]
    ]
  },
  {
    "id": "conn_rain_house_greenstone",
    "from": "rain_house",
    "to": "greenstone",
    "name": "Regional Road: Rain House to Greenstone",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2416,
        5076
      ],
      [
        2388,
        5217
      ]
    ]
  },
  {
    "id": "conn_rain_house_tarth",
    "from": "rain_house",
    "to": "tarth",
    "name": "Coastal Passage: Rain House to Evenfall Hall (Tarth)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2416,
        5076
      ],
      [
        2412,
        4921
      ]
    ]
  },
  {
    "id": "conn_appleton_new_barrel",
    "from": "appleton",
    "to": "new_barrel",
    "name": "Regional Road: Appleton to New Barrel",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1383,
        4955
      ],
      [
        1383,
        4955
      ]
    ]
  },
  {
    "id": "conn_appleton_cider_hall",
    "from": "appleton",
    "to": "cider_hall",
    "name": "Regional Road: Appleton to Cider Hall",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1383,
        4955
      ],
      [
        1435,
        4994
      ]
    ]
  },
  {
    "id": "conn_ashford_longtable",
    "from": "ashford",
    "to": "longtable",
    "name": "Regional Road: Ashford to Longtable",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1563,
        5026
      ],
      [
        1521,
        4917
      ]
    ]
  },
  {
    "id": "conn_ashford_cider_hall",
    "from": "ashford",
    "to": "cider_hall",
    "name": "Regional Road: Ashford to Cider Hall",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1563,
        5026
      ],
      [
        1435,
        4994
      ]
    ]
  },
  {
    "id": "conn_bandallon_brightwater_keep",
    "from": "bandallon",
    "to": "brightwater_keep",
    "name": "Regional Road: Bandallon to Brightwater Keep",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        922,
        5189
      ],
      [
        1046,
        5207
      ]
    ]
  },
  {
    "id": "conn_bandallon_honeyholt",
    "from": "bandallon",
    "to": "honeyholt",
    "name": "Regional Road: Bandallon to Honeyholt",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        922,
        5189
      ],
      [
        1063,
        5284
      ]
    ]
  },
  {
    "id": "conn_blackcrown_three_towers",
    "from": "blackcrown",
    "to": "three_towers",
    "name": "Regional Road: Blackcrown to Three Towers",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        907,
        5417
      ],
      [
        955,
        5464
      ]
    ]
  },
  {
    "id": "conn_blackcrown_oldtown",
    "from": "blackcrown",
    "to": "oldtown",
    "name": "Regional Road: Blackcrown to Oldtown",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        907,
        5417
      ],
      [
        1031,
        5365
      ]
    ]
  },
  {
    "id": "conn_brandybottom_dosk",
    "from": "brandybottom",
    "to": "dosk",
    "name": "Regional Road: Brandybottom to Dosk",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1156,
        4846
      ],
      [
        1154,
        4889
      ]
    ]
  },
  {
    "id": "conn_brandybottom_coldmoat",
    "from": "brandybottom",
    "to": "coldmoat",
    "name": "Regional Road: Brandybottom to Coldmoat",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1156,
        4846
      ],
      [
        1204,
        4851
      ]
    ]
  },
  {
    "id": "conn_brightwater_keep_honeyholt",
    "from": "brightwater_keep",
    "to": "honeyholt",
    "name": "Regional Road: Brightwater Keep to Honeyholt",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1046,
        5207
      ],
      [
        1063,
        5284
      ]
    ]
  },
  {
    "id": "conn_cobble_cove_dosk",
    "from": "cobble_cove",
    "to": "dosk",
    "name": "Regional Road: Cobble Cove to Dosk",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1139,
        4925
      ],
      [
        1154,
        4889
      ]
    ]
  },
  {
    "id": "conn_cobble_cove_brandybottom",
    "from": "cobble_cove",
    "to": "brandybottom",
    "name": "Regional Road: Cobble Cove to Brandybottom",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1139,
        4925
      ],
      [
        1156,
        4846
      ]
    ]
  },
  {
    "id": "conn_coldmoat_stackhouse",
    "from": "coldmoat",
    "to": "stackhouse",
    "name": "Regional Road: Coldmoat to Stackhouse",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1204,
        4851
      ],
      [
        1220,
        4813
      ]
    ]
  },
  {
    "id": "conn_dunstonbury_highgarden",
    "from": "dunstonbury",
    "to": "highgarden",
    "name": "Regional Road: Dunstonbury to Highgarden",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1214,
        5133
      ],
      [
        1260,
        5078
      ]
    ]
  },
  {
    "id": "conn_dunstonbury_horn_hill",
    "from": "dunstonbury",
    "to": "horn_hill",
    "name": "Regional Road: Dunstonbury to Horn Hill",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1214,
        5133
      ],
      [
        1263,
        5202
      ]
    ]
  },
  {
    "id": "conn_ebonhead_port_lotus",
    "from": "ebonhead",
    "to": "port_lotus",
    "name": "Coastal Passage: Ebonhead to Port Lotus (Summer Isles)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2814,
        7681
      ],
      [
        2847,
        7661
      ]
    ]
  },
  {
    "id": "conn_ebonhead_tall_trees_town",
    "from": "ebonhead",
    "to": "tall_trees_town",
    "name": "Coastal Passage: Ebonhead to Tall Trees Town",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2814,
        7681
      ],
      [
        2821,
        6854
      ]
    ]
  },
  {
    "id": "conn_goldengrove_stackhouse",
    "from": "goldengrove",
    "to": "stackhouse",
    "name": "Regional Road: Goldengrove to Stackhouse",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1288,
        4807
      ],
      [
        1220,
        4813
      ]
    ]
  },
  {
    "id": "conn_goldengrove_coldmoat",
    "from": "goldengrove",
    "to": "coldmoat",
    "name": "Regional Road: Goldengrove to Coldmoat",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1288,
        4807
      ],
      [
        1204,
        4851
      ]
    ]
  },
  {
    "id": "conn_grassfield_keep_grassy_vale",
    "from": "grassfield_keep",
    "to": "grassy_vale",
    "name": "Regional Road: Grassfield Keep to Grassy Vale",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1731,
        4881
      ],
      [
        1703,
        4861
      ]
    ]
  },
  {
    "id": "conn_grassfield_keep_tumbleton",
    "from": "grassfield_keep",
    "to": "tumbleton",
    "name": "Regional Road: Grassfield Keep to Tumbleton",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1731,
        4881
      ],
      [
        1763,
        4721
      ]
    ]
  },
  {
    "id": "conn_greenshield_grimston",
    "from": "greenshield",
    "to": "grimston",
    "name": "Regional Road: Greenshield to Grimston",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        973,
        4991
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_greenshield_southshield",
    "from": "greenshield",
    "to": "southshield",
    "name": "Regional Road: Greenshield to Southshield",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        973,
        4991
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_greyshield_greenshield",
    "from": "greyshield",
    "to": "greenshield",
    "name": "Regional Road: Greyshield to Greenshield",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        889,
        4997
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_greyshield_grimston",
    "from": "greyshield",
    "to": "grimston",
    "name": "Regional Road: Greyshield to Grimston",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        889,
        4997
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_hewetts_town_oakenshield",
    "from": "hewetts_town",
    "to": "oakenshield",
    "name": "Regional Road: Hewett's Town to Oakenshield",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1128,
        5025
      ],
      [
        1076,
        5003
      ]
    ]
  },
  {
    "id": "conn_hewetts_town_cobble_cove",
    "from": "hewetts_town",
    "to": "cobble_cove",
    "name": "Regional Road: Hewett's Town to Cobble Cove",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1128,
        5025
      ],
      [
        1139,
        4925
      ]
    ]
  },
  {
    "id": "conn_longtable_bitterbridge",
    "from": "longtable",
    "to": "bitterbridge",
    "name": "Regional Road: Longtable to Bitterbridge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1521,
        4917
      ],
      [
        1572,
        4828
      ]
    ]
  },
  {
    "id": "conn_nightsong_tower_of_joy",
    "from": "nightsong",
    "to": "tower_of_joy",
    "name": "Regional Road: Nightsong to Tower of Joy",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1519,
        5186
      ],
      [
        1557,
        5251
      ]
    ]
  },
  {
    "id": "conn_nightsong_kingsgrave",
    "from": "nightsong",
    "to": "kingsgrave",
    "name": "Regional Road: Nightsong to Kingsgrave",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1519,
        5186
      ],
      [
        1560,
        5310
      ]
    ]
  },
  {
    "id": "conn_old_oak_greenshield",
    "from": "old_oak",
    "to": "greenshield",
    "name": "Regional Road: Old Oak to Greenshield",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1007,
        4911
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_old_oak_grimston",
    "from": "old_oak",
    "to": "grimston",
    "name": "Regional Road: Old Oak to Grimston",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1007,
        4911
      ],
      [
        973,
        4991
      ]
    ]
  },
  {
    "id": "conn_red_lake_brandybottom",
    "from": "red_lake",
    "to": "brandybottom",
    "name": "Regional Road: Red Lake to Brandybottom",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1129,
        4769
      ],
      [
        1156,
        4846
      ]
    ]
  },
  {
    "id": "conn_ryamsport_vinetown",
    "from": "ryamsport",
    "to": "vinetown",
    "name": "Regional Road: Ryamsport to Vinetown",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        890,
        5678
      ],
      [
        890,
        5678
      ]
    ]
  },
  {
    "id": "conn_ryamsport_the_arbor",
    "from": "ryamsport",
    "to": "the_arbor",
    "name": "Regional Road: Ryamsport to The Arbor",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        890,
        5678
      ],
      [
        825,
        5590
      ]
    ]
  },
  {
    "id": "conn_starfish_harbor_the_arbor",
    "from": "starfish_harbor",
    "to": "the_arbor",
    "name": "Regional Road: Starfish Harbor to The Arbor",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        815,
        5597
      ],
      [
        825,
        5590
      ]
    ]
  },
  {
    "id": "conn_starfish_harbor_ryamsport",
    "from": "starfish_harbor",
    "to": "ryamsport",
    "name": "Regional Road: Starfish Harbor to Ryamsport",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        815,
        5597
      ],
      [
        890,
        5678
      ]
    ]
  },
  {
    "id": "conn_starpike_whitegrove",
    "from": "starpike",
    "to": "whitegrove",
    "name": "Regional Road: Starpike to Whitegrove",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1343,
        5146
      ],
      [
        1379,
        5098
      ]
    ]
  },
  {
    "id": "conn_starpike_horn_hill",
    "from": "starpike",
    "to": "horn_hill",
    "name": "Regional Road: Starpike to Horn Hill",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1343,
        5146
      ],
      [
        1263,
        5202
      ]
    ]
  },
  {
    "id": "conn_sunhouse_starfall",
    "from": "sunhouse",
    "to": "starfall",
    "name": "Coastal Passage: Sunhouse to Starfall",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1125,
        5609
      ],
      [
        1290,
        5475
      ]
    ]
  },
  {
    "id": "conn_sunhouse_three_towers",
    "from": "sunhouse",
    "to": "three_towers",
    "name": "Regional Road: Sunhouse to Three Towers",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1125,
        5609
      ],
      [
        955,
        5464
      ]
    ]
  },
  {
    "id": "conn_tumbleton_grassy_vale",
    "from": "tumbleton",
    "to": "grassy_vale",
    "name": "Regional Road: Tumbleton to Grassy Vale",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1763,
        4721
      ],
      [
        1703,
        4861
      ]
    ]
  },
  {
    "id": "conn_uplands_honeyholt",
    "from": "uplands",
    "to": "honeyholt",
    "name": "Regional Road: Uplands to Honeyholt",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1168,
        5340
      ],
      [
        1063,
        5284
      ]
    ]
  },
  {
    "id": "conn_uplands_oldtown",
    "from": "uplands",
    "to": "oldtown",
    "name": "Regional Road: Uplands to Oldtown",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1168,
        5340
      ],
      [
        1031,
        5365
      ]
    ]
  },
  {
    "id": "conn_blackmont_hermitage",
    "from": "blackmont",
    "to": "hermitage",
    "name": "Regional Road: Blackmont to The Hermitage",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1367,
        5350
      ],
      [
        1361,
        5437
      ]
    ]
  },
  {
    "id": "conn_blackmont_starfall",
    "from": "blackmont",
    "to": "starfall",
    "name": "Regional Road: Blackmont to Starfall",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1367,
        5350
      ],
      [
        1290,
        5475
      ]
    ]
  },
  {
    "id": "conn_ghaston_grey_wyl",
    "from": "ghaston_grey",
    "to": "wyl",
    "name": "Coastal Passage: Ghaston Grey to Castle Wyl",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1922,
        5347
      ],
      [
        1848,
        5222
      ]
    ]
  },
  {
    "id": "conn_ghaston_grey_yronwood",
    "from": "ghaston_grey",
    "to": "yronwood",
    "name": "Coastal Passage: Ghaston Grey to Yronwood",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        1922,
        5347
      ],
      [
        1784,
        5397
      ]
    ]
  },
  {
    "id": "conn_ghost_hill_spottswood",
    "from": "ghost_hill",
    "to": "spottswood",
    "name": "Regional Road: Ghost Hill to Spottswood",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2339,
        5464
      ],
      [
        2447,
        5483
      ]
    ]
  },
  {
    "id": "conn_ghost_hill_sunspear",
    "from": "ghost_hill",
    "to": "sunspear",
    "name": "Regional Road: Ghost Hill to Sunspear",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2339,
        5464
      ],
      [
        2404,
        5599
      ]
    ]
  },
  {
    "id": "conn_godsgrace_saltshore",
    "from": "godsgrace",
    "to": "saltshore",
    "name": "Regional Road: Godsgrace to Saltshore",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2094,
        5574
      ],
      [
        2074,
        5679
      ]
    ]
  },
  {
    "id": "conn_godsgrace_the_tor",
    "from": "godsgrace",
    "to": "the_tor",
    "name": "Regional Road: Godsgrace to The Tor",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2094,
        5574
      ],
      [
        2060,
        5464
      ]
    ]
  },
  {
    "id": "conn_hellgate_hall_hellholt",
    "from": "hellgate_hall",
    "to": "hellholt",
    "name": "Regional Road: Hellgate Hall to Hellholt",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1695,
        5663
      ],
      [
        1661,
        5595
      ]
    ]
  },
  {
    "id": "conn_hellgate_hall_sandstone",
    "from": "hellgate_hall",
    "to": "sandstone",
    "name": "Regional Road: Hellgate Hall to Sandstone",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1695,
        5663
      ],
      [
        1476,
        5598
      ]
    ]
  },
  {
    "id": "conn_kingsgrave_tower_of_joy",
    "from": "kingsgrave",
    "to": "tower_of_joy",
    "name": "Regional Road: Kingsgrave to Tower of Joy",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1560,
        5310
      ],
      [
        1557,
        5251
      ]
    ]
  },
  {
    "id": "conn_lemonwood_shandystone",
    "from": "lemonwood",
    "to": "shandystone",
    "name": "Regional Road: Lemonwood to Shandystone",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2312,
        5651
      ],
      [
        2305,
        5634
      ]
    ]
  },
  {
    "id": "conn_lemonwood_planky_town",
    "from": "lemonwood",
    "to": "planky_town",
    "name": "Regional Road: Lemonwood to Planky Town",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2312,
        5651
      ],
      [
        2276,
        5632
      ]
    ]
  },
  {
    "id": "conn_sandstone_hellholt",
    "from": "sandstone",
    "to": "hellholt",
    "name": "Regional Road: Sandstone to Hellholt",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1476,
        5598
      ],
      [
        1661,
        5595
      ]
    ]
  },
  {
    "id": "conn_skyreach_kingsgrave",
    "from": "skyreach",
    "to": "kingsgrave",
    "name": "Regional Road: Skyreach to Kingsgrave",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1560,
        5412
      ],
      [
        1560,
        5310
      ]
    ]
  },
  {
    "id": "conn_skyreach_tower_of_joy",
    "from": "skyreach",
    "to": "tower_of_joy",
    "name": "Regional Road: Skyreach to Tower of Joy",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1560,
        5412
      ],
      [
        1557,
        5251
      ]
    ]
  },
  {
    "id": "conn_hermitage_starfall",
    "from": "hermitage",
    "to": "starfall",
    "name": "Regional Road: The Hermitage to Starfall",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1361,
        5437
      ],
      [
        1290,
        5475
      ]
    ]
  },
  {
    "id": "conn_water_gardens_sunspear",
    "from": "water_gardens",
    "to": "sunspear",
    "name": "Regional Road: The Water Gardens to Sunspear",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2447,
        5612
      ],
      [
        2404,
        5599
      ]
    ]
  },
  {
    "id": "conn_water_gardens_spottswood",
    "from": "water_gardens",
    "to": "spottswood",
    "name": "Regional Road: The Water Gardens to Spottswood",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        2447,
        5612
      ],
      [
        2447,
        5483
      ]
    ]
  },
  {
    "id": "conn_vaith_saltshore",
    "from": "vaith",
    "to": "saltshore",
    "name": "Regional Road: Vaith to Saltshore",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1916,
        5600
      ],
      [
        2074,
        5679
      ]
    ]
  },
  {
    "id": "conn_vaith_godsgrace",
    "from": "vaith",
    "to": "godsgrace",
    "name": "Regional Road: Vaith to Godsgrace",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1916,
        5600
      ],
      [
        2094,
        5574
      ]
    ]
  },
  {
    "id": "conn_vultures_roost_tower_of_joy",
    "from": "vultures_roost",
    "to": "tower_of_joy",
    "name": "Regional Road: Vulture's Roost to Tower of Joy",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1654,
        5249
      ],
      [
        1557,
        5251
      ]
    ]
  },
  {
    "id": "conn_vultures_roost_kingsgrave",
    "from": "vultures_roost",
    "to": "kingsgrave",
    "name": "Regional Road: Vulture's Roost to Kingsgrave",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1654,
        5249
      ],
      [
        1560,
        5310
      ]
    ]
  },
  {
    "id": "conn_ar_noy_ny_sar",
    "from": "ar_noy",
    "to": "ny_sar",
    "name": "Regional Road: Ar Noy to Ny Sar",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3735,
        4748
      ],
      [
        3494,
        4690
      ]
    ]
  },
  {
    "id": "conn_ar_noy_qohor",
    "from": "ar_noy",
    "to": "qohor",
    "name": "Regional Road: Ar Noy to Qohor",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3735,
        4748
      ],
      [
        3945,
        4580
      ]
    ]
  },
  {
    "id": "conn_chroyane_lhorulu",
    "from": "chroyane",
    "to": "lhorulu",
    "name": "Regional Road: Chroyane (The Sorrows) to Lhorulu",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3594,
        5082
      ],
      [
        3473,
        5022
      ]
    ]
  },
  {
    "id": "conn_chroyane_selhorys",
    "from": "chroyane",
    "to": "selhorys",
    "name": "Regional Road: Chroyane (The Sorrows) to Selhorys",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3594,
        5082
      ],
      [
        3649,
        5341
      ]
    ]
  },
  {
    "id": "conn_ghoyan_drohe_pentos",
    "from": "ghoyan_drohe",
    "to": "pentos",
    "name": "Regional Road: Ghoyan Drohe to Pentos",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3198,
        4528
      ],
      [
        2893,
        4593
      ]
    ]
  },
  {
    "id": "conn_ghoyan_drohe_ny_sar",
    "from": "ghoyan_drohe",
    "to": "ny_sar",
    "name": "Regional Road: Ghoyan Drohe to Ny Sar",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3198,
        4528
      ],
      [
        3494,
        4690
      ]
    ]
  },
  {
    "id": "conn_ib_nor_port_of_ibben",
    "from": "ib_nor",
    "to": "port_of_ibben",
    "name": "Coastal Passage: Ib Nor to Port of Ibben",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6563,
        2779
      ],
      [
        6475,
        3108
      ]
    ]
  },
  {
    "id": "conn_ib_nor_ib_sar",
    "from": "ib_nor",
    "to": "ib_sar",
    "name": "Coastal Passage: Ib Nor to Ib Sar",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6563,
        2779
      ],
      [
        6980,
        3437
      ]
    ]
  },
  {
    "id": "conn_ib_sar_vaes_aresak",
    "from": "ib_sar",
    "to": "vaes_aresak",
    "name": "Coastal Passage: Ib Sar to Vaes Aresak (Ibbish)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6980,
        3437
      ],
      [
        6737,
        3687
      ]
    ]
  },
  {
    "id": "conn_lorassyon_lorath",
    "from": "lorassyon",
    "to": "lorath",
    "name": "Regional Road: Lorassyon to Lorath",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3472,
        3780
      ],
      [
        3288,
        3832
      ]
    ]
  },
  {
    "id": "conn_lorassyon_norvos",
    "from": "lorassyon",
    "to": "norvos",
    "name": "Regional Road: Lorassyon to Norvos",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3472,
        3780
      ],
      [
        3468,
        4272
      ]
    ]
  },
  {
    "id": "conn_morosh_vaes_graddakh",
    "from": "morosh",
    "to": "vaes_graddakh",
    "name": "Coastal Passage: Morosh to Vaes Graddakh (Sar Mell)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4652,
        3798
      ],
      [
        4736,
        3947
      ]
    ]
  },
  {
    "id": "conn_morosh_saath",
    "from": "morosh",
    "to": "saath",
    "name": "Coastal Passage: Morosh to Saath",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4652,
        3798
      ],
      [
        4501,
        3940
      ]
    ]
  },
  {
    "id": "conn_nefer_kdath",
    "from": "nefer",
    "to": "kdath",
    "name": "Regional Road: Nefer to K'Dath",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        8764,
        4535
      ],
      [
        9282,
        5083
      ]
    ]
  },
  {
    "id": "conn_nefer_five_forts",
    "from": "nefer",
    "to": "five_forts",
    "name": "Regional Road: Nefer to The Five Forts",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        8764,
        4535
      ],
      [
        9125,
        5461
      ]
    ]
  },
  {
    "id": "conn_new_ibbish_vaes_aresak",
    "from": "new_ibbish",
    "to": "vaes_aresak",
    "name": "Coastal Passage: New Ibbish to Vaes Aresak (Ibbish)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6453,
        3572
      ],
      [
        6737,
        3687
      ]
    ]
  },
  {
    "id": "conn_new_ibbish_port_of_ibben",
    "from": "new_ibbish",
    "to": "port_of_ibben",
    "name": "Coastal Passage: New Ibbish to Port of Ibben",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6453,
        3572
      ],
      [
        6475,
        3108
      ]
    ]
  },
  {
    "id": "conn_saath_mardosh",
    "from": "saath",
    "to": "mardosh",
    "name": "Regional Road: Saath to Mardosh (Vaes Gorqoyi)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4501,
        3940
      ],
      [
        4635,
        4084
      ]
    ]
  },
  {
    "id": "conn_sar_mell_volon_therys",
    "from": "sar_mell",
    "to": "volon_therys",
    "name": "Regional Road: Sar Mell to Volon Therys",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3713,
        5552
      ],
      [
        3699,
        5566
      ]
    ]
  },
  {
    "id": "conn_sar_mell_valysar",
    "from": "sar_mell",
    "to": "valysar",
    "name": "Regional Road: Sar Mell to Valysar",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3713,
        5552
      ],
      [
        3650,
        5460
      ]
    ]
  },
  {
    "id": "conn_sarhoy_volantis",
    "from": "sarhoy",
    "to": "volantis",
    "name": "Regional Road: Sarhoy to Volantis",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3788,
        5711
      ],
      [
        3825,
        5632
      ]
    ]
  },
  {
    "id": "conn_sarhoy_volon_therys",
    "from": "sarhoy",
    "to": "volon_therys",
    "name": "Regional Road: Sarhoy to Volon Therys",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3788,
        5711
      ],
      [
        3699,
        5566
      ]
    ]
  },
  {
    "id": "conn_selhorys_valysar",
    "from": "selhorys",
    "to": "valysar",
    "name": "Regional Road: Selhorys to Valysar",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        3649,
        5341
      ],
      [
        3650,
        5460
      ]
    ]
  },
  {
    "id": "conn_elyria_tolos",
    "from": "elyria",
    "to": "tolos",
    "name": "Coastal Passage: Elyria to Tolos",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4594,
        5685
      ],
      [
        4727,
        5664
      ]
    ]
  },
  {
    "id": "conn_elyria_mantarys",
    "from": "elyria",
    "to": "mantarys",
    "name": "Coastal Passage: Elyria to Mantarys",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4594,
        5685
      ],
      [
        4499,
        5531
      ]
    ]
  },
  {
    "id": "conn_ghozai_velos",
    "from": "ghozai",
    "to": "velos",
    "name": "Coastal Passage: Ghozai to Velos",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4851,
        5831
      ],
      [
        4888,
        5997
      ]
    ]
  },
  {
    "id": "conn_ghozai_tolos",
    "from": "ghozai",
    "to": "tolos",
    "name": "Coastal Passage: Ghozai to Tolos",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4851,
        5831
      ],
      [
        4727,
        5664
      ]
    ]
  },
  {
    "id": "conn_new_ghis_old_ghis",
    "from": "new_ghis",
    "to": "old_ghis",
    "name": "Coastal Passage: New Ghis to Old Ghis",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5356,
        6522
      ],
      [
        5288,
        6203
      ]
    ]
  },
  {
    "id": "conn_oros_tyria",
    "from": "oros",
    "to": "tyria",
    "name": "Regional Road: Oros to Tyria",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        4447,
        6110
      ],
      [
        4407,
        6231
      ]
    ]
  },
  {
    "id": "conn_oros_valyria",
    "from": "oros",
    "to": "valyria",
    "name": "Regional Road: Oros to Valyria",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        4447,
        6110
      ],
      [
        4312,
        6426
      ]
    ]
  },
  {
    "id": "conn_valyria_tyria",
    "from": "valyria",
    "to": "tyria",
    "name": "Regional Road: Valyria to Tyria",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        4312,
        6426
      ],
      [
        4407,
        6231
      ]
    ]
  },
  {
    "id": "conn_adakhakileki_yinishar",
    "from": "adakhakileki",
    "to": "yinishar",
    "name": "Regional Road: Adakhakileki to Yinishar (Vaes Jini)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6762,
        5160
      ],
      [
        6861,
        5055
      ]
    ]
  },
  {
    "id": "conn_adakhakileki_vaes_jini",
    "from": "adakhakileki",
    "to": "vaes_jini",
    "name": "Regional Road: Adakhakileki to Vaes Jini (Yinishar)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6762,
        5160
      ],
      [
        6871,
        5022
      ]
    ]
  },
  {
    "id": "conn_bayasabhad_asabhad",
    "from": "bayasabhad",
    "to": "asabhad",
    "name": "Regional Road: Bayasabhad to Asabhad",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        7391,
        5673
      ],
      [
        7415,
        6124
      ]
    ]
  },
  {
    "id": "conn_bayasabhad_tiqui",
    "from": "bayasabhad",
    "to": "tiqui",
    "name": "Regional Road: Bayasabhad to Tiqui",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        7391,
        5673
      ],
      [
        7844,
        5556
      ]
    ]
  },
  {
    "id": "conn_essaria_hornoth",
    "from": "essaria",
    "to": "hornoth",
    "name": "Regional Road: Essaria to Hornoth",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4373,
        4572
      ],
      [
        4589,
        4622
      ]
    ]
  },
  {
    "id": "conn_essaria_rathylar",
    "from": "essaria",
    "to": "rathylar",
    "name": "Regional Road: Essaria to Rathylar",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4373,
        4572
      ],
      [
        4748,
        4644
      ]
    ]
  },
  {
    "id": "conn_ghardaa_vaes_mejhah",
    "from": "ghardaa",
    "to": "vaes_mejhah",
    "name": "Regional Road: Ghardaa (Krazaaj Has) to Vaes Mejhah",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5988,
        5124
      ],
      [
        6155,
        5101
      ]
    ]
  },
  {
    "id": "conn_ghardaa_kosrak",
    "from": "ghardaa",
    "to": "kosrak",
    "name": "Regional Road: Ghardaa (Krazaaj Has) to Kosrak",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5988,
        5124
      ],
      [
        6138,
        5379
      ]
    ]
  },
  {
    "id": "conn_hazdahn_mo_sathar",
    "from": "hazdahn_mo",
    "to": "sathar",
    "name": "Regional Road: Hazdahn Mo (Vaes Diaf) to Sathar (Yalli Qamayi)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5387,
        4964
      ],
      [
        5558,
        4667
      ]
    ]
  },
  {
    "id": "conn_hazdahn_mo_kasath",
    "from": "hazdahn_mo",
    "to": "kasath",
    "name": "Regional Road: Hazdahn Mo (Vaes Diaf) to Kasath (Vojjor Samui)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5387,
        4964
      ],
      [
        5249,
        4607
      ]
    ]
  },
  {
    "id": "conn_hornoth_rathylar",
    "from": "hornoth",
    "to": "rathylar",
    "name": "Regional Road: Hornoth to Rathylar",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4589,
        4622
      ],
      [
        4748,
        4644
      ]
    ]
  },
  {
    "id": "conn_kasath_sallosh",
    "from": "kasath",
    "to": "sallosh",
    "name": "Regional Road: Kasath (Vojjor Samui) to Sallosh (Athjikhari)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5249,
        4607
      ],
      [
        5363,
        4374
      ]
    ]
  },
  {
    "id": "conn_kayakayanaya_samyriana",
    "from": "kayakayanaya",
    "to": "samyriana",
    "name": "Regional Road: Kayakayanaya to Samyriana",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        7289,
        4595
      ],
      [
        7263,
        5153
      ]
    ]
  },
  {
    "id": "conn_kayakayanaya_vaes_jini",
    "from": "kayakayanaya",
    "to": "vaes_jini",
    "name": "Regional Road: Kayakayanaya to Vaes Jini (Yinishar)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        7289,
        4595
      ],
      [
        6871,
        5022
      ]
    ]
  },
  {
    "id": "conn_kosrak_lhazosh",
    "from": "kosrak",
    "to": "lhazosh",
    "name": "Regional Road: Kosrak to Lhazosh",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6138,
        5379
      ],
      [
        5984,
        5594
      ]
    ]
  },
  {
    "id": "conn_kyth_mardosh",
    "from": "kyth",
    "to": "mardosh",
    "name": "Regional Road: Kyth to Mardosh (Vaes Gorqoyi)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4686,
        4336
      ],
      [
        4635,
        4084
      ]
    ]
  },
  {
    "id": "conn_kyth_hornoth",
    "from": "kyth",
    "to": "hornoth",
    "name": "Regional Road: Kyth to Hornoth",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4686,
        4336
      ],
      [
        4589,
        4622
      ]
    ]
  },
  {
    "id": "conn_sallosh_vaes_leqse",
    "from": "sallosh",
    "to": "vaes_leqse",
    "name": "Regional Road: Sallosh (Athjikhari) to Vaes Leqse (Gornath)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5363,
        4374
      ],
      [
        5535,
        4503
      ]
    ]
  },
  {
    "id": "conn_samyriana_vaes_jini",
    "from": "samyriana",
    "to": "vaes_jini",
    "name": "Regional Road: Samyriana to Vaes Jini (Yinishar)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        7263,
        5153
      ],
      [
        6871,
        5022
      ]
    ]
  },
  {
    "id": "conn_sarnath_rathylar",
    "from": "sarnath",
    "to": "rathylar",
    "name": "Regional Road: Sarnath (Vaes Khewo) to Rathylar",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4931,
        4670
      ],
      [
        4748,
        4644
      ]
    ]
  },
  {
    "id": "conn_sarnath_kasath",
    "from": "sarnath",
    "to": "kasath",
    "name": "Regional Road: Sarnath (Vaes Khewo) to Kasath (Vojjor Samui)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4931,
        4670
      ],
      [
        5249,
        4607
      ]
    ]
  },
  {
    "id": "conn_sathar_vaes_leqse",
    "from": "sathar",
    "to": "vaes_leqse",
    "name": "Regional Road: Sathar (Yalli Qamayi) to Vaes Leqse (Gornath)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5558,
        4667
      ],
      [
        5535,
        4503
      ]
    ]
  },
  {
    "id": "conn_vaes_dothrak_vaes_efe",
    "from": "vaes_dothrak",
    "to": "vaes_efe",
    "name": "Regional Road: Vaes Dothrak to Vaes Efe",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6394,
        4352
      ],
      [
        6270,
        4961
      ]
    ]
  },
  {
    "id": "conn_vaes_efe_vaes_mejhah",
    "from": "vaes_efe",
    "to": "vaes_mejhah",
    "name": "Regional Road: Vaes Efe to Vaes Mejhah",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6270,
        4961
      ],
      [
        6155,
        5101
      ]
    ]
  },
  {
    "id": "conn_vaes_graddakh_mardosh",
    "from": "vaes_graddakh",
    "to": "mardosh",
    "name": "Regional Road: Vaes Graddakh (Sar Mell) to Mardosh (Vaes Gorqoyi)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        4736,
        3947
      ],
      [
        4635,
        4084
      ]
    ]
  },
  {
    "id": "conn_vaes_leisi_new_ibbish",
    "from": "vaes_leisi",
    "to": "new_ibbish",
    "name": "Coastal Passage: Vaes Leisi to New Ibbish",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5870,
        3835
      ],
      [
        6453,
        3572
      ]
    ]
  },
  {
    "id": "conn_vaes_leisi_vaes_dothrak",
    "from": "vaes_leisi",
    "to": "vaes_dothrak",
    "name": "Regional Road: Vaes Leisi to Vaes Dothrak",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        5870,
        3835
      ],
      [
        6394,
        4352
      ]
    ]
  },
  {
    "id": "conn_vaes_orvik_port_yhos",
    "from": "vaes_orvik",
    "to": "port_yhos",
    "name": "Regional Road: Vaes Orvik to Port Yhos",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6176,
        6052
      ],
      [
        6136,
        6163
      ]
    ]
  },
  {
    "id": "conn_vaes_orvik_vaes_shirosi",
    "from": "vaes_orvik",
    "to": "vaes_shirosi",
    "name": "Regional Road: Vaes Orvik to Vaes Shirosi",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6176,
        6052
      ],
      [
        6342,
        5993
      ]
    ]
  },
  {
    "id": "conn_vaes_qosar_vaes_qolahn",
    "from": "vaes_qosar",
    "to": "vaes_qolahn",
    "name": "Regional Road: Vaes Qosar (City of Bones) to Vaes Qolahn",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6716,
        6034
      ],
      [
        6684,
        6059
      ]
    ]
  },
  {
    "id": "conn_vaes_qosar_qarkash",
    "from": "vaes_qosar",
    "to": "qarkash",
    "name": "Regional Road: Vaes Qosar (City of Bones) to Qarkash",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6716,
        6034
      ],
      [
        6510,
        6093
      ]
    ]
  },
  {
    "id": "conn_vaes_tolorro_vaes_shirosi",
    "from": "vaes_tolorro",
    "to": "vaes_shirosi",
    "name": "Regional Road: Vaes Tolorro to Vaes Shirosi",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6455,
        5831
      ],
      [
        6342,
        5993
      ]
    ]
  },
  {
    "id": "conn_vaes_tolorro_qarkash",
    "from": "vaes_tolorro",
    "to": "qarkash",
    "name": "Regional Road: Vaes Tolorro to Qarkash",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6455,
        5831
      ],
      [
        6510,
        6093
      ]
    ]
  },
  {
    "id": "conn_yinishar_vaes_jini",
    "from": "yinishar",
    "to": "vaes_jini",
    "name": "Regional Road: Yinishar (Vaes Jini) to Vaes Jini (Yinishar)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6861,
        5055
      ],
      [
        6871,
        5022
      ]
    ]
  },
  {
    "id": "conn_bonetown_kdath",
    "from": "bonetown",
    "to": "kdath",
    "name": "Regional Road: Bonetown to K'Dath",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        9511,
        5303
      ],
      [
        9282,
        5083
      ]
    ]
  },
  {
    "id": "conn_bonetown_five_forts",
    "from": "bonetown",
    "to": "five_forts",
    "name": "Regional Road: Bonetown to The Five Forts",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        9511,
        5303
      ],
      [
        9125,
        5461
      ]
    ]
  },
  {
    "id": "conn_city_of_the_winged_men_bonetown",
    "from": "city_of_the_winged_men",
    "to": "bonetown",
    "name": "Regional Road: City of the Winged Men to Bonetown",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        9650,
        5964
      ],
      [
        9511,
        5303
      ]
    ]
  },
  {
    "id": "conn_city_of_the_winged_men_five_forts",
    "from": "city_of_the_winged_men",
    "to": "five_forts",
    "name": "Regional Road: City of the Winged Men to The Five Forts",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        9650,
        5964
      ],
      [
        9125,
        5461
      ]
    ]
  },
  {
    "id": "conn_si_qo_yin",
    "from": "si_qo",
    "to": "yin",
    "name": "Regional Road: Si Qo to Yin",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        7841,
        6196
      ],
      [
        7841,
        6592
      ]
    ]
  },
  {
    "id": "conn_si_qo_asabhad",
    "from": "si_qo",
    "to": "asabhad",
    "name": "Regional Road: Si Qo to Asabhad",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        7841,
        6196
      ],
      [
        7415,
        6124
      ]
    ]
  },
  {
    "id": "conn_tiqui_trader_town",
    "from": "tiqui",
    "to": "trader_town",
    "name": "Regional Road: Tiqui to Trader Town",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        7844,
        5556
      ],
      [
        7957,
        5195
      ]
    ]
  },
  {
    "id": "conn_leng_ma_turrani",
    "from": "leng_ma",
    "to": "turrani",
    "name": "Coastal Passage: Leng Ma to Turrani",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        8354,
        6780
      ],
      [
        8443,
        6960
      ]
    ]
  },
  {
    "id": "conn_leng_ma_leng_yi",
    "from": "leng_ma",
    "to": "leng_yi",
    "name": "Coastal Passage: Leng Ma to Leng Yi",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        8354,
        6780
      ],
      [
        8473,
        6501
      ]
    ]
  },
  {
    "id": "conn_port_moraq_zabhad",
    "from": "port_moraq",
    "to": "zabhad",
    "name": "Coastal Passage: Port Moraq to Zabhad",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        7175,
        7165
      ],
      [
        7318,
        7340
      ]
    ]
  },
  {
    "id": "conn_port_moraq_vahar",
    "from": "port_moraq",
    "to": "vahar",
    "name": "Coastal Passage: Port Moraq to Vahar",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        7175,
        7165
      ],
      [
        6719,
        6779
      ]
    ]
  },
  {
    "id": "conn_vahar_faros",
    "from": "vahar",
    "to": "faros",
    "name": "Regional Road: Vahar to Faros (Great Moraq)",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6719,
        6779
      ],
      [
        6778,
        6573
      ]
    ]
  },
  {
    "id": "conn_stygai_asshai",
    "from": "stygai",
    "to": "asshai",
    "name": "Regional Road: Stygai to Asshai-by-the-Shadow",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        9112,
        7234
      ],
      [
        8907,
        7442
      ]
    ]
  },
  {
    "id": "conn_stygai_turrani",
    "from": "stygai",
    "to": "turrani",
    "name": "Regional Road: Stygai to Turrani",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        9112,
        7234
      ],
      [
        8443,
        6960
      ]
    ]
  },
  {
    "id": "conn_black_fort_zamettar",
    "from": "black_fort",
    "to": "zamettar",
    "name": "Coastal Passage: Black Fort (Ax Isle) to Zamettar",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5409,
        7062
      ],
      [
        5161,
        7166
      ]
    ]
  },
  {
    "id": "conn_black_fort_yeen",
    "from": "black_fort",
    "to": "yeen",
    "name": "Coastal Passage: Black Fort (Ax Isle) to Yeen",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5409,
        7062
      ],
      [
        5264,
        7461
      ]
    ]
  },
  {
    "id": "conn_gogossos_zamettar",
    "from": "gogossos",
    "to": "zamettar",
    "name": "Coastal Passage: Gogossos to Zamettar",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4892,
        7389
      ],
      [
        5161,
        7166
      ]
    ]
  },
  {
    "id": "conn_gogossos_yeen",
    "from": "gogossos",
    "to": "yeen",
    "name": "Coastal Passage: Gogossos to Yeen",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4892,
        7389
      ],
      [
        5264,
        7461
      ]
    ]
  },
  {
    "id": "conn_tall_trees_town_port_lotus",
    "from": "tall_trees_town",
    "to": "port_lotus",
    "name": "Coastal Passage: Tall Trees Town to Port Lotus (Summer Isles)",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2821,
        6854
      ],
      [
        2847,
        7661
      ]
    ]
  },
  {
    "id": "conn_hazdahn_mo_meereen",
    "from": "hazdahn_mo",
    "to": "meereen",
    "name": "Coastal Passage: Hazdahn Mo (Vaes Diaf) to Meereen",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5387,
        4964
      ],
      [
        5421,
        5371
      ]
    ]
  },
  {
    "id": "conn_high_heart_lychester",
    "from": "high_heart",
    "to": "lychester",
    "name": "Regional Road: High Heart to Castle Lychester",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1621,
        4266
      ],
      [
        1647,
        4198
      ]
    ]
  },
  {
    "id": "conn_vaes_qosar_qarth",
    "from": "vaes_qosar",
    "to": "qarth",
    "name": "Regional Road: Vaes Qosar (City of Bones) to Qarth",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        6716,
        6034
      ],
      [
        6884,
        6196
      ]
    ]
  },
  {
    "id": "conn_oxcross_golden_tooth",
    "from": "oxcross",
    "to": "golden_tooth",
    "name": "Regional Road: Oxcross to The Golden Tooth",
    "segmentType": "land",
    "terrainType": "paved_highway",
    "waypoints": [
      [
        1210,
        4350
      ],
      [
        1290,
        4310
      ]
    ]
  },
  {
    "id": "conn_mummers_ford_atranta",
    "from": "mummers_ford",
    "to": "atranta",
    "name": "Regional Road: Mummer's Ford to Atranta",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1462,
        4306
      ],
      [
        1546,
        4218
      ]
    ]
  },
  {
    "id": "conn_wickenden_rooks_rest",
    "from": "wickenden",
    "to": "rooks_rest",
    "name": "Regional Road: Wickenden to Rook's Rest",
    "segmentType": "land",
    "terrainType": "mountain_pass",
    "waypoints": [
      [
        2264,
        4296
      ],
      [
        2191,
        4379
      ]
    ]
  },
  {
    "id": "conn_greenshield_oakenshield",
    "from": "greenshield",
    "to": "oakenshield",
    "name": "Regional Road: Greenshield to Oakenshield",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        973,
        4991
      ],
      [
        1076,
        5003
      ]
    ]
  },
  {
    "id": "conn_vultures_roost_harvest_hall",
    "from": "vultures_roost",
    "to": "harvest_hall",
    "name": "Regional Road: Vulture's Roost to Harvest Hall",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1654,
        5249
      ],
      [
        1707,
        5110
      ]
    ]
  },
  {
    "id": "conn_five_forts_jinqi",
    "from": "five_forts",
    "to": "jinqi",
    "name": "Coastal Passage: The Five Forts to Jinqi",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        9125,
        5461
      ],
      [
        8626,
        6365
      ]
    ]
  },
  {
    "id": "conn_adakhakileki_vaes_efe",
    "from": "adakhakileki",
    "to": "vaes_efe",
    "name": "Coastal Passage: Adakhakileki to Vaes Efe",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        6762,
        5160
      ],
      [
        6270,
        4961
      ]
    ]
  },
  {
    "id": "conn_sharp_point_driftmark",
    "from": "sharp_point",
    "to": "driftmark",
    "name": "Coastal Passage: Sharp Point to Driftmark",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2326,
        4515
      ],
      [
        2326,
        4433
      ]
    ]
  },
  {
    "id": "conn_griffins_roost_storms_end",
    "from": "griffins_roost",
    "to": "storms_end",
    "name": "Regional Road: Griffin's Roost to Storm's End",
    "segmentType": "land",
    "terrainType": "dirt_track",
    "waypoints": [
      [
        2171,
        5010
      ],
      [
        2253,
        4945
      ]
    ]
  },
  {
    "id": "conn_the_tor_ghaston_grey",
    "from": "the_tor",
    "to": "ghaston_grey",
    "name": "Coastal Passage: The Tor to Ghaston Grey",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        2060,
        5464
      ],
      [
        1922,
        5347
      ]
    ]
  },
  {
    "id": "conn_black_fort_new_ghis",
    "from": "black_fort",
    "to": "new_ghis",
    "name": "Coastal Passage: Black Fort (Ax Isle) to New Ghis",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        5409,
        7062
      ],
      [
        5356,
        6522
      ]
    ]
  },
  {
    "id": "conn_ramsford_oldstones",
    "from": "ramsford",
    "to": "oldstones",
    "name": "Regional Road: Ramsford to Oldstones",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1611,
        3998
      ],
      [
        1594,
        3946
      ]
    ]
  },
  {
    "id": "conn_mudgrave_stone_hedge",
    "from": "mudgrave",
    "to": "stone_hedge",
    "name": "Regional Road: Mudgrave to Stone Hedge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1575,
        4102
      ],
      [
        1602,
        4154
      ]
    ]
  },
  {
    "id": "conn_saltcliffe_pyke",
    "from": "saltcliffe",
    "to": "pyke",
    "name": "Coastal Passage: Saltcliffe to Pyke",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        977,
        4044
      ],
      [
        1051,
        4043
      ]
    ]
  },
  {
    "id": "conn_grassy_vale_bitterbridge",
    "from": "grassy_vale",
    "to": "bitterbridge",
    "name": "Regional Road: Grassy Vale to Bitterbridge",
    "segmentType": "land",
    "terrainType": "royal_road",
    "waypoints": [
      [
        1703,
        4861
      ],
      [
        1572,
        4828
      ]
    ]
  },
  {
    "id": "conn_sandstone_hermitage",
    "from": "sandstone",
    "to": "hermitage",
    "name": "Regional Road: Sandstone to The Hermitage",
    "segmentType": "land",
    "terrainType": "desert_waste",
    "waypoints": [
      [
        1476,
        5598
      ],
      [
        1361,
        5437
      ]
    ]
  },
  {
    "id": "conn_oros_elyria",
    "from": "oros",
    "to": "elyria",
    "name": "Coastal Passage: Oros to Elyria",
    "segmentType": "sea",
    "terrainType": "coastal_sea",
    "waypoints": [
      [
        4447,
        6110
      ],
      [
        4594,
        5685
      ]
    ]
  }
];

export const REGIONAL_CONNECTORS: RouteEdge[] = RAW_CONNECTORS.map(createConnectorEdge);
