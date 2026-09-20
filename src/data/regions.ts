import type { RegionInfo } from '../types';

export const REGIONS: Record<string, RegionInfo> = {
  north: {
    id: 'north',
    name: 'The North & The Wall',
    realm: 'Westeros',
    color: '#94a3b8',
    capitalId: 'winterfell'
  },
  riverlands: {
    id: 'riverlands',
    name: 'The Riverlands',
    realm: 'Westeros',
    color: '#38bdf8',
    capitalId: 'riverrun'
  },
  vale: {
    id: 'vale',
    name: 'The Vale of Arryn',
    realm: 'Westeros',
    color: '#60a5fa',
    capitalId: 'eyrie'
  },
  westerlands: {
    id: 'westerlands',
    name: 'The Westerlands',
    realm: 'Westeros',
    color: '#eab308',
    capitalId: 'casterly_rock'
  },
  crownlands: {
    id: 'crownlands',
    name: 'The Crownlands',
    realm: 'Westeros',
    color: '#f43f5e',
    capitalId: 'kings_landing'
  },
  reach: {
    id: 'reach',
    name: 'The Reach',
    realm: 'Westeros',
    color: '#22c55e',
    capitalId: 'highgarden'
  },
  stormlands: {
    id: 'stormlands',
    name: 'The Stormlands',
    realm: 'Westeros',
    color: '#ca8a04',
    capitalId: 'storms_end'
  },
  dorne: {
    id: 'dorne',
    name: 'Dorne',
    realm: 'Westeros',
    color: '#f97316',
    capitalId: 'sunspear'
  },
  iron_islands: {
    id: 'iron_islands',
    name: 'Iron Islands',
    realm: 'Westeros',
    color: '#64748b',
    capitalId: 'pyke'
  },
  free_cities: {
    id: 'free_cities',
    name: 'The Free Cities',
    realm: 'Essos',
    color: '#a855f7',
    capitalId: 'braavos'
  },
  slavers_bay: {
    id: 'slavers_bay',
    name: "Slaver's Bay & Ghiscar",
    realm: 'Essos',
    color: '#ec4899',
    capitalId: 'meereen'
  },
  dothraki_sea: {
    id: 'dothraki_sea',
    name: 'The Dothraki Sea',
    realm: 'Essos',
    color: '#84cc16',
    capitalId: 'vaes_dothrak'
  },
  jade_sea: {
    id: 'jade_sea',
    name: 'The Jade Sea & Qarth',
    realm: 'Essos',
    color: '#14b8a6',
    capitalId: 'qarth'
  },
  yi_ti: {
    id: 'yi_ti',
    name: 'The Golden Empire of Yi Ti',
    realm: 'Essos',
    color: '#eab308',
    capitalId: 'yin'
  },
  shadow_lands: {
    id: 'shadow_lands',
    name: 'The Shadow Lands',
    realm: 'Essos',
    color: '#6366f1',
    capitalId: 'asshai'
  }
};
