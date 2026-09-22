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
  style?: React.CSSProperties;
  className?: string;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ telemetry, style, className }) => {
  if (!telemetry) return null;

  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-gold-glow)',
        borderRadius: 20,
        height: 36,
        boxSizing: 'border-box',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: 'var(--shadow-lg), 0 0 12px var(--border-gold-glow)',
        backdropFilter: 'blur(10px)',
        color: 'var(--text-parchment)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        ...style
      }}
    >
      {/* World Lat / Lng */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13 }}>🧭</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--text-gold)', letterSpacing: 0.5 }}>
          {telemetry.worldCoords}
        </span>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

      {/* Distance from Oldtown / Citadel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 11 }}>
        <span>Citadel:</span>
        <span style={{ color: 'var(--text-gold)', fontWeight: 600 }}>~{telemetry.distanceFromCitadelMiles} mi</span>
      </div>
    </div>
  );
};
