import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Compass,
  Swords,
  BookOpen,
  X,
  Sparkles,
  Move,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface CitadelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitadelGuideModal: React.FC<CitadelGuideModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="citadel-modal-backdrop"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="citadel-guide-title"
    >
      <div
        className="glass-panel citadel-modal-dialog citadel-guide-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="citadel-guide-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="citadel-brand-crest" style={{ width: 36, height: 36 }}>
              <Compass size={20} color="var(--bg-primary, #0a0e14)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  id="citadel-guide-title"
                  className="font-serif"
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '1px',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Citadel Navigator Guide
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: 'rgba(223, 177, 91, 0.2)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--text-gold-bright)',
                    fontWeight: 700,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 0.5
                  }}
                >
                  TUTORIAL
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  letterSpacing: '0.2px'
                }}
              >
                Quick guide to charting expeditions, choosing parties, and exploring the Known World
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            title="Close guide (Esc)"
            className="citadel-modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="citadel-guide-body">
          {/* Section 1: Quick Start Tutorial (4 Steps) */}
          <div style={{ marginBottom: 24 }}>
            <div className="citadel-guide-section-title">
              <Sparkles size={15} color="var(--text-gold)" />
              <span>How to Plan a Journey (4 Steps)</span>
            </div>

            <div className="citadel-guide-steps-grid">
              <div className="citadel-guide-step-card">
                <div className="citadel-guide-step-num">1</div>
                <div className="citadel-guide-step-content">
                  <div className="citadel-guide-step-heading">
                    {/* <MapPin size={14} color="var(--text-gold)" /> */}
                    <strong>Select Origin & Destination</strong>
                  </div>
                  <p>
                    Search in the topbar or click any city on the map to set starting and ending strongholds.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-step-card">
                <div className="citadel-guide-step-num">2</div>
                <div className="citadel-guide-step-content">
                  <div className="citadel-guide-step-heading">
                    {/* <Users size={14} color="var(--text-gold)" /> */}
                    <strong>Choose Travel Party</strong>
                  </div>
                  <p>
                    Select from 7 archetypes (Raven, Dragon, Courier, Retinue, Army, Caravan, or Fleet) with calibrated speeds.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-step-card">
                <div className="citadel-guide-step-num">3</div>
                <div className="citadel-guide-step-content">
                  <div className="citadel-guide-step-heading">
                    {/* <Route size={14} color="var(--text-gold)" /> */}
                    <strong>Add Waypoints & Optimize</strong>
                  </div>
                  <p>
                    Add up to 8 waypoints directly or use <em>Pick on Map</em>. Click <em>Auto-Optimize</em> to eliminate backtracking.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-step-card">
                <div className="citadel-guide-step-num">4</div>
                <div className="citadel-guide-step-content">
                  <div className="citadel-guide-step-heading">
                    {/* <Sliders size={14} color="var(--text-gold)" /> */}
                    <strong>Inspect Route & Corridors</strong>
                  </div>
                  <p>
                    Review travel days, total miles, terrain multipliers, and watch the animated traveler token advance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: What to Find in the Citadel */}
          <div style={{ marginBottom: 24 }}>
            <div className="citadel-guide-section-title">
              <BookOpen size={15} color="var(--text-gold)" />
              <span>What You Can Find & Explore</span>
            </div>

            <div className="citadel-guide-features-grid">
              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <Navigation size={18} color="var(--badge-city-text, #f59e0b)" />
                </div>
                <div>
                  <h4 className="font-serif">325+ Canonical Settlements</h4>
                  <p>
                    Regional capitals, major ports, castles, ruins, and strategic crossroads across Westeros and Essos with lore dossiers.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <Swords size={18} color="#ef4444" />
                </div>
                <div>
                  <h4 className="font-serif">Major Historical Battles Layer</h4>
                  <p>
                    Tactical markers for 30+ canonical clashes (Field of Fire, Trident, Blackwater) with commanders, casualties, and wiki links.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <BookOpen size={18} color="var(--text-gold-bright)" />
                </div>
                <div>
                  <h4 className="font-serif">Canonical Historic Journeys</h4>
                  <p>
                    Top dropdown loads famous routes: Robert&apos;s Progress, Nymeria&apos;s 10,000 Ships, Aegon&apos;s Conquest, and Sea Snake voyages.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <Compass size={18} color="var(--badge-port-text, #38bdf8)" />
                </div>
                <div>
                  <h4 className="font-serif">Physics & Terrain Calibration</h4>
                  <p>
                    Calibrated to the 600-mile map bar (0.875 mi/px) and 300-mile Wall. Modifiers for Valyrian roads, swamps, and mountain passes.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <Move size={18} color="var(--text-parchment)" />
                </div>
                <div>
                  <h4 className="font-serif">Movable & Dockable Ledger</h4>
                  <p>
                    Drag the Citadel sidebar by its header to position anywhere, or use the dock buttons to pin it to either side of the map.
                  </p>
                </div>
              </div>

              <div className="citadel-guide-feature-card">
                <div className="citadel-guide-feature-icon">
                  <Sparkles size={18} color="var(--text-gold)" />
                </div>
                <div>
                  <h4 className="font-serif">Citadel Obsidian & Parchment Themes</h4>
                  <p>
                    Toggle between the dark Citadel study and antiquarian parchment scroll modes in the top navigation bar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Essential Controls & Shortcuts */}
          <div className="citadel-guide-tips-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={16} color="var(--badge-success-text, #4ade80)" />
              <strong style={{ fontSize: 13, color: 'var(--text-gold-bright)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Cartographer&apos;s Pro-Tips
              </strong>
            </div>
            <ul className="citadel-guide-tips-list">
              <li>
                <strong>Click any map marker</strong> to immediately inspect its details, set as Origin / Destination, or quick-route.
              </li>
              <li>
                <strong>Pick on Map mode</strong>: Click the target icon next to any stop in the ledger, then click directly on the canvas.
              </li>
              <li>
                <strong>Corridor Modes</strong>: Force overland travel via royal roads or bypass continents via open-sea lanes.
              </li>
              <li>
                <strong>Dismiss Dialogs</strong>: Press <kbd className="citadel-kbd">Esc</kbd> or click outside any dialog to close.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="citadel-guide-footer">
          <span style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Archmaester Scale: 1 px = 0.875 miles (0.292 leagues) • 300-mile Wall anchor
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-citadel"
            style={{
              width: "auto"
            }}
          >
            <span>Understood, Archmaester</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
