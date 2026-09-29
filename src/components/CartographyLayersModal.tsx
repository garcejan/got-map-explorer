import React, { useEffect } from 'react';
import { Layers, Crown, LineSquiggle, Ship, Swords, House, Compass, Earth, X, Check, RotateCcw } from 'lucide-react';
import { type CartographyLayersConfig } from '../types';

export interface CartographyLayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: CartographyLayersConfig;
  onToggleLayer: (layer: keyof CartographyLayersConfig) => void;
  onResetLayers?: () => void;
  onEnableAllLayers?: () => void;
}

interface LayerOption {
  key: keyof CartographyLayersConfig;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
}

const LAYER_OPTIONS: LayerOption[] = [
  {
    key: 'roads',
    label: 'Imperial Highways',
    description: 'Kingsroad, Roseroad, Ocean Road & Valyrian stone highways',
    icon: <Crown size={16} />,
    accentColor: 'var(--text-gold, #dfb15b)'
  },
  {
    key: 'kingdomPaths',
    label: 'Kingdom Paths',
    description: 'Regional connectors, mountain passes & spur tracks',
    icon: <LineSquiggle size={16} />,
    accentColor: '#d97706'
  },
  {
    key: 'seaLanes',
    label: 'Maritime Routes',
    description: 'Narrow Sea, Summer Sea & Sunset Sea shipping corridors',
    icon: <Ship size={16} />,
    accentColor: 'var(--accent-blue, #0ea5e9)'
  },
  {
    key: 'battles',
    label: 'Major Historical Battles',
    description: 'Tactical clash sites, field commanders & war chronicles',
    icon: <Swords size={16} />,
    accentColor: '#ef4444'
  },
  {
    key: 'labels',
    label: 'Settlement Labels',
    description: 'Holdfasts, castles, major cities, ports & ruins',
    icon: <House size={16} />,
    accentColor: 'var(--text-gold, #dfb15b)'
  },
  {
    key: 'graticules',
    label: 'World Graticules',
    description: 'Parallels, Arctic Circle, Equator & Prime Meridian',
    icon: <Compass size={16} />,
    accentColor: 'var(--text-gold, #dfb15b)'
  },
  {
    key: 'waterMask',
    label: 'Water Mask & Land',
    description: 'Bathymetry depth raster & coastal shelf navigability',
    icon: <Earth size={16} />,
    accentColor: 'var(--accent-blue, #0ea5e9)'
  }
];

export const CartographyLayersModal: React.FC<CartographyLayersModalProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  onResetLayers,
  onEnableAllLayers
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div
      className="citadel-modal-backdrop"
      onClick={onClose}
      style={{ zIndex: 3200 }}
      role="dialog"
      aria-modal="true"
      aria-label="Citadel Cartography Overlays"
    >
      <div
        className="glass-panel citadel-mobile-layers-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="citadel-layers-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(223, 177, 91, 0.15)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-gold)',
                flexShrink: 0
              }}
            >
              <Layers size={17} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-gold)',
                    letterSpacing: 0.6,
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Citadel Cartography
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: 'rgba(223, 177, 91, 0.2)',
                    color: 'var(--text-gold-bright)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {activeCount} / 7
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.3px'
                }}
              >
                Realm Map & Vector Overlays
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="citadel-modal-close-btn"
            title="Close Cartography Overlays"
            aria-label="Close Cartography Overlays"
          >
            <X size={18} />
          </button>
        </div>

        {/* Layer Toggles List */}
        <div className="citadel-layers-modal-body">
          {LAYER_OPTIONS.map((opt) => {
            const isChecked = layers[opt.key];
            return (
              <label
                key={opt.key}
                className={`citadel-layer-toggle-row ${isChecked ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: isChecked ? 'rgba(223, 177, 91, 0.12)' : 'var(--bg-secondary)',
                      border: `1px solid ${isChecked ? opt.accentColor : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isChecked ? opt.accentColor : 'var(--text-muted)',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt.icon}
                  </div>

                  <div style={{ minWidth: 0, flex: 1, paddingRight: 6 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isChecked ? 'var(--text-gold-bright)' : 'var(--text-parchment)',
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: 0.3,
                        lineHeight: 1.2
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        fontFamily: "'Inter', sans-serif",
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {opt.description}
                    </div>
                  </div>
                </div>

                {/* Custom Styled Switch / Checkbox */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleLayer(opt.key)}
                    style={{
                      width: 20,
                      height: 20,
                      accentColor: 'var(--border-gold, #dfb15b)',
                      cursor: 'pointer',
                      margin: 0
                    }}
                    aria-label={`Toggle ${opt.label}`}
                  />
                </div>
              </label>
            );
          })}
        </div>

        {/* Modal Footer with Quick Actions */}
        <div className="citadel-layers-modal-footer">
          <div style={{ display: 'flex', gap: 8 }}>
            {onResetLayers && (
              <button
                type="button"
                onClick={onResetLayers}
                className="citadel-layers-action-btn"
                title="Reset to Archmaester default layers"
              >
                <RotateCcw size={13} />
                <span>Defaults</span>
              </button>
            )}

            {onEnableAllLayers && (
              <button
                type="button"
                onClick={onEnableAllLayers}
                className="citadel-layers-action-btn"
                title="Show all cartography layers"
              >
                <Check size={13} />
                <span>All On</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="citadel-layers-done-btn"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
