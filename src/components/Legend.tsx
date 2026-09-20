import React from 'react';
import { BookOpen, X, Milestone } from 'lucide-react';
import { TERRAIN_MODIFIERS } from '../engine/parties';

interface LegendProps {
  onClose: () => void;
}

export const Legend: React.FC<LegendProps> = ({ onClose }) => {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 70,
        right: 24,
        width: 340,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
        zIndex: 2000,
        padding: 16,
        boxShadow: '0 16px 40px rgba(0,0,0,0.9)',
        border: '1px solid var(--border-gold)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} color="var(--text-gold)" />
          <h3 className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)', textTransform: 'uppercase' }}>
            Citadel Cartography Guide
          </h3>
        </div>
        <button onClick={onClose} className="btn-secondary" style={{ padding: 4 }}>
          <X size={14} />
        </button>
      </div>

      {/* Cartographic Scale Calibration */}
      <div className="glass-card" style={{ padding: '10px 12px', marginBottom: 12 }}>
        <strong style={{ fontSize: 11, color: 'var(--text-gold-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Milestone size={13} /> Scale Calibration (Cartographer's Bar)
        </strong>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '4px 0 6px', lineHeight: 1.4 }}>
          Calibrated directly to the canonical 300-mile Wall (686 px = 600 miles):
        </p>
        <div style={{ fontSize: 10, color: 'var(--text-parchment)', background: 'var(--bg-secondary)', padding: 6, borderRadius: 4 }}>
          • 1 pixel = <b>0.875 miles</b> (0.292 leagues • 1.408 km)<br />
          • The Wall (Shadow Tower to Eastwatch): <b>301 miles</b>
        </div>
      </div>

      {/* Node Symbols */}
      <div style={{ marginBottom: 14 }}>
        <h4 className="font-serif" style={{ fontSize: 11, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: 8 }}>
          Settlement Hierarchy
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="citadel-marker marker-capital" style={{ width: 16, height: 16 }}>
              <span style={{ fontSize: 9 }}>★</span>
            </div>
            <div>
              <strong>Regional Capital</strong>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Winterfell, King's Landing, Braavos, Meereen</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="citadel-marker marker-city" style={{ width: 14, height: 14 }} />
            <div>
              <strong>Major Metropolis</strong>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Oldtown, Lannisport, Gulltown, White Harbor</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="citadel-marker marker-port" style={{ width: 13, height: 13 }}>
              <span style={{ fontSize: 7 }}>⚓</span>
            </div>
            <div>
              <strong>Seaport / Naval Anchorage</strong>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Allows embarking and disembarking vessels</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="citadel-marker marker-castle" style={{ width: 11, height: 11 }} />
            <div>
              <strong>Castle / Holdfast</strong>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>The Twins, Dreadfort, Harrenhal, Crakehall</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="citadel-marker marker-junction" style={{ width: 9, height: 9 }} />
            <div>
              <strong>Strategic Junction / Pass</strong>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Crossroads Inn, Moat Cailin, Golden Tooth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terrain Modifiers */}
      <div>
        <h4 className="font-serif" style={{ fontSize: 11, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: 8 }}>
          Road Quality & Terrain Friction
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10 }}>
          {Object.entries(TERRAIN_MODIFIERS).map(([key, mod]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '4px 0' }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: mod.color,
                marginTop: 2,
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-parchment)' }}>
                  {mod.label} ({mod.speedMultiplier}x speed)
                </div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {mod.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
