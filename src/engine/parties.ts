import type { TravelParty, TerrainType } from '../types';

export const TRAVEL_PARTIES: Record<string, TravelParty> = {
  messenger: {
    id: 'messenger',
    name: 'Fast Courier / Raven Rider',
    icon: 'Feather',
    landSpeedMilesPerDay: 58,
    seaSpeedMilesPerDay: 90,
    description: 'Lone rider switching fresh post-horses at holdfasts and road inns. Fastest overland transit.',
    tagline: '58 miles / 93 km per day on road'
  },
  retinue: {
    id: 'retinue',
    name: 'Noble Retinue / Royal Progress',
    icon: 'Crown',
    landSpeedMilesPerDay: 18,
    seaSpeedMilesPerDay: 95,
    description: 'Heavy wheelhouses, mounted knights, ladies in litters, and baggage carts (e.g. King Robert traveling to Winterfell).',
    tagline: '18 miles / 29 km per day on road'
  },
  army: {
    id: 'army',
    name: 'Marching Host / Army',
    icon: 'Shield',
    landSpeedMilesPerDay: 12,
    seaSpeedMilesPerDay: 75,
    description: 'Armored infantry on foot, camp followers, ox-drawn siege engines, and heavy supply trains.',
    tagline: '12 miles / 19 km per day on road'
  },
  caravan: {
    id: 'caravan',
    name: 'Merchant Caravan',
    icon: 'Coins',
    landSpeedMilesPerDay: 15,
    seaSpeedMilesPerDay: 100,
    description: 'Pack mules, spice wagons, and hired sellsword guards carrying trade goods across Westeros and Essos.',
    tagline: '15 miles / 24 km per day on road'
  },
  fleet: {
    id: 'fleet',
    name: 'War Galley / Sailing Fleet',
    icon: 'Ship',
    landSpeedMilesPerDay: 14,
    seaSpeedMilesPerDay: 115,
    description: 'Oared war galleys and triple-masted cogs skimming along coastal shipping lanes and open waters.',
    tagline: '115 miles / 185 km per day at sea'
  },
  crow: {
    id: 'crow',
    name: 'Messenger Crow / Raven',
    icon: 'Bird',
    landSpeedMilesPerDay: 240,
    seaSpeedMilesPerDay: 240,
    description: 'Trained rookery raven or messenger crow carrying a scroll canister. Sustained daylight flight (30-35 mph for 7-8 hours) as the crow flies.',
    tagline: '240 miles / 386 km per day (Direct Message Flight)',
    canFly: true
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Flight (e.g. Balerion / Drogon)',
    icon: 'Flame',
    landSpeedMilesPerDay: 520,
    seaSpeedMilesPerDay: 520,
    description: 'High-altitude aerial transit (65-80 mph cruising) over mountains, oceans, and swamps, unaffected by ground obstacles.',
    tagline: '520 miles / 837 km per day direct',
    canFly: true
  }
};

export const TERRAIN_MODIFIERS: Record<TerrainType, { speedMultiplier: number; label: string; color: string; description: string }> = {
  paved_highway: {
    speedMultiplier: 1.25,
    label: 'Valyrian Fused-Stone Highway',
    color: '#8b5cf6',
    description: 'Masterwork ancient dragon-fused basalt road. Broad, seamless, and impervious to weather.'
  },
  royal_road: {
    speedMultiplier: 1.10,
    label: 'Royal Highway (Kingsroad / Roseroad)',
    color: '#dfb15b',
    description: 'Well-maintained gravel highway with coaching inns, waystations, and bridge crossings.'
  },
  dirt_track: {
    speedMultiplier: 1.00,
    label: 'Unpaved Track / Cart Road',
    color: '#94a3b8',
    description: 'Standard packed dirt road suitable for wagons and foot traffic in fair weather.'
  },
  mountain_pass: {
    speedMultiplier: 0.60,
    label: 'Treacherous Mountain Pass',
    color: '#ef4444',
    description: 'Steep inclines, rockfalls, and narrow tracks (The Boneway, Prince\'s Pass, High Road).'
  },
  swamp_causeway: {
    speedMultiplier: 0.45,
    label: 'The Neck Bog & Causeway',
    color: '#10b981',
    description: 'Narrow sunken causeway surrounded by deadly quicksand, venomous lizards, and crannogmen.'
  },
  northern_snow: {
    speedMultiplier: 0.65,
    label: 'Northern Snow & Tundra',
    color: '#38bdf8',
    description: 'Freezing headwinds, icy ruts, and deep northern snowdrifts north of Winterfell.'
  },
  desert_waste: {
    speedMultiplier: 0.50,
    label: 'Arid Sand Dunes / Red Waste',
    color: '#f97316',
    description: 'Blistering daytime heat, shifting sand dunes, and severe lack of water wells.'
  },
  coastal_sea: {
    speedMultiplier: 1.00,
    label: 'Coastal Sea Lane',
    color: '#0ea5e9',
    description: 'Navigable coastal waters following headlands and landmarks with steady breezes.'
  },
  fair_winds: {
    speedMultiplier: 1.30,
    label: 'Trade Wind Passage',
    color: '#06b6d4',
    description: 'Strong, consistent trade winds (Jade Sea corridor, Summer Sea crossing).'
  },
  dangerous_sea: {
    speedMultiplier: 0.70,
    label: 'Perilous Waters / Pirate Corridor',
    color: '#ec4899',
    description: 'Reefs, unpredictable squalls, and pirate ambushes (The Stepstones, Smoking Sea).'
  }
};

/**
 * Port embarkation/disembarkation delay in days
 * Loading provisions, boarding horses, rigging ships
 */
export const PORT_TRANSITION_DAYS = 3.0;
