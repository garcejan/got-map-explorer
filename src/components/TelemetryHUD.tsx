import React from 'react';
import type { BathymetryZone } from '../engine/waterNav';
import { Compass, Crosshair } from 'lucide-react';

export interface TelemetryData {
  worldCoords: string;
  imgCoords: string;
  x?: number;
  y?: number;
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

  const displayCoords =
    telemetry.imgCoords ||
    (telemetry.x !== undefined && telemetry.y !== undefined
      ? `X: ${telemetry.x}, Y: ${telemetry.y}`
      : '');

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} title="World Geodetic Coordinates (ArcGIS calibrated)">
        <Compass size={15} color="var(--text-gold)" />

        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--text-gold)', letterSpacing: 0.5 }}>
          {telemetry.worldCoords}
        </span>
      </div>

      {displayCoords && (
        <>
          <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

          {/* Cartographic X, Y Image Coordinates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} title="Cartographic Pixel Coordinates (X, Y in 10,000 x 8,300 px)">
            <Crosshair size={14} color="var(--text-gold)" />
            <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--text-gold)', letterSpacing: 0.5 }}>
              {displayCoords}
            </span>
          </div>
        </>
      )}

      <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

      {/* Distance from Oldtown / Citadel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 11 }} title="Direct Distance from Citadel of Oldtown">
        <span style={{ fontSize: 13, fontFamily: "'Cinzel', serif", fontWeight: 700, color: 'var(--text-gold)', letterSpacing: 0.5 }}>
          Citadel distance: {telemetry.distanceFromCitadelMiles} mi
        </span>
      </div>
    </div>
  );
};
