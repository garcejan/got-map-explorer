import React from 'react';
import type { BathymetryZone } from '../engine/waterNav';

export interface TelemetryData {
  worldCoords: string;
  imgCoords: string;
  zone: BathymetryZone;
  distanceFromCitadelMiles: number;
}

interface TelemetryHUDProps {
  telemetry: TelemetryData | null;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry }) => {
  if (!telemetry) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 1000,
        background: 'var(--bg-panel, rgba(16, 22, 31, 0.92))',
        border: '1px solid var(--border-gold-glow, rgba(223, 177, 91, 0.35))',
        borderRadius: 24,
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.8), 0 0 12px rgba(223, 177, 91, 0.15)',
        backdropFilter: 'blur(10px)',
        color: 'var(--text-parchment, #f4ecd8)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'all 0.15s ease'
      }}
    >
      {/* World Lat / Lng */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13 }}>🧭</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--text-gold, #dfb15b)', letterSpacing: 0.5 }}>
          {telemetry.worldCoords}
        </span>
      </div>

      <div style={{ width: 1, height: 16, background: '#dfb15b40' }} />

      {/* Citadel Map Pixels */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>Citadel Grid:</span>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#f8fafc' }}>
          {telemetry.imgCoords}
        </span>
      </div> */}

      {/* <div style={{ width: 1, height: 16, background: 'rgba(223, 177, 91, 0.25)' }} /> */}

      {/* Terrain & Bathymetry */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13 }}>{zoneIcon}</span>
        <span style={{ color: zoneColor, fontWeight: 600, letterSpacing: 0.2 }}>
          {zoneLabel}
        </span>
      </div> */}

      {/* <div style={{ width: 1, height: 16, background: 'rgba(223, 177, 91, 0.25)' }} /> */}

      {/* Distance from Oldtown / Citadel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', fontSize: 11 }}>
        <span>Citadel:</span>
        <span style={{ color: '#dfb15b', fontWeight: 600 }}>~{telemetry.distanceFromCitadelMiles} mi</span>
      </div>
    </div>
  );
};
