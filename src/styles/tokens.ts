/**
 * Citadel / Maester's Cartography Design System - TypeScript Tokens
 *
 * Strongly-typed constants mirroring CSS tokens for use in Leaflet vector/canvas
 * layers, SVG icons, and engine configurations.
 */

import type { Theme } from '../components/Header';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  borderGold: string;
  borderGoldGlow: string;
  textGold: string;
  textGoldBright: string;
  textParchment: string;
  textMuted: string;
  textDim: string;
  // Corridors & Polylines
  routeLand: string;
  routeSea: string;
  routeFlight: string;
  routeDragon: string;
  routeGlow: string;
  // Map Canvas specific
  highway: string;
  path: string;
  parallel: string;
}

export const THEME_PALETTES: Record<Theme, ThemeColors> = {
  dark: {
    bgPrimary: '#0a0e14',
    bgSecondary: '#121820',
    borderGold: '#c99738',
    borderGoldGlow: 'rgba(223, 177, 91, 0.4)',
    textGold: '#dfb15b',
    textGoldBright: '#ffd479',
    textParchment: '#f4ecd8',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    routeLand: '#f59e0b',
    routeSea: '#06b6d4',
    routeFlight: '#c084fc',
    routeDragon: '#ef4444',
    routeGlow: '#dfb15b',
    highway: '#dfb15b',
    path: '#ca8a04',
    parallel: '#94a3b8'
  },
  beige: {
    bgPrimary: '#f6efe2',
    bgSecondary: '#ecdfcc',
    borderGold: '#b3802b',
    borderGoldGlow: 'rgba(179, 128, 43, 0.45)',
    textGold: '#7d4f0b',
    textGoldBright: '#523101',
    textParchment: '#221a12',
    textMuted: '#645341',
    textDim: '#8c7862',
    routeLand: '#92400e',
    routeSea: '#0369a1',
    routeFlight: '#7e22ce',
    routeDragon: '#b91c1c',
    routeGlow: '#b3802b',
    highway: '#92400e',
    path: '#78350f',
    parallel: '#78716c'
  }
};

export const PARTY_ARCHETYPE_COLORS = {
  dragon: {
    varName: 'var(--icon-dragon, #ef4444)',
    hexDark: '#ef4444',
    hexBeige: '#b91c1c',
    bgDark: 'radial-gradient(circle, #ef4444 0%, #7f1d1d 100%)',
    borderDark: '#f87171'
  },
  crow: {
    varName: 'var(--icon-crow, #c084fc)',
    hexDark: '#c084fc',
    hexBeige: '#7e22ce',
    bgDark: 'radial-gradient(circle, #a855f7 0%, #581c87 100%)',
    borderDark: '#c084fc'
  },
  messenger: {
    varName: 'var(--icon-messenger, #4ade80)',
    hexDark: '#4ade80',
    hexBeige: '#15803d',
    bgDark: 'radial-gradient(circle, #10b981 0%, #065f46 100%)',
    borderDark: '#34d399'
  },
  retinue: {
    varName: 'var(--icon-retinue, #fbbf24)',
    hexDark: '#fbbf24',
    hexBeige: '#b45309',
    bgDark: 'radial-gradient(circle, #f59e0b 0%, #78350f 100%)',
    borderDark: '#ffd700'
  },
  army: {
    varName: 'var(--icon-army, #60a5fa)',
    hexDark: '#60a5fa',
    hexBeige: '#1d4ed8',
    bgDark: 'radial-gradient(circle, #e11d48 0%, #881337 100%)',
    borderDark: '#fb7185'
  },
  caravan: {
    varName: 'var(--icon-caravan, #fb923c)',
    hexDark: '#fb923c',
    hexBeige: '#c2410c',
    bgDark: 'radial-gradient(circle, #ea580c 0%, #7c2d12 100%)',
    borderDark: '#fb923c'
  },
  fleet: {
    varName: 'var(--icon-fleet, #22d3ee)',
    hexDark: '#22d3ee',
    hexBeige: '#0e7490',
    bgDark: 'radial-gradient(circle, #06b6d4 0%, #0e7490 100%)',
    borderDark: '#38bdf8'
  }
} as const;

export const NODE_TYPE_COLORS = {
  capital: {
    hex: '#ffd700',
    badgeClass: 'citadel-badge-capital'
  },
  port: {
    hex: '#38bdf8',
    badgeClass: 'citadel-badge-port'
  },
  castle: {
    hex: '#cbd5e1',
    badgeClass: 'citadel-badge-castle'
  },
  city: {
    hex: '#f59e0b',
    badgeClass: 'citadel-badge-city'
  },
  junction: {
    hex: '#64748b',
    badgeClass: 'citadel-badge-junction'
  }
} as const;
