import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Compass,
  Swords,
  BookOpen,
  X,
  Sparkles,
  Move,
  CheckCircle2,
  Navigation,
  Footprints,
  Shield,
  Crown,
  Bird,
  Flame,
  Ship,
  Coins,
  Feather,
  Layers,
  Ruler,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  MapPin
} from 'lucide-react';

export interface CitadelGuideModalProps {
  isOpen: boolean;
  onClose: (markAsCompleted?: boolean) => void;
  initialTab?: 'tutorial' | 'codex';
  onQuickLaunchPreset?: (presetId: string) => void;
  onQuickLaunchCustom?: () => void;
  onQuickLaunchBattles?: () => void;
}

export const CitadelGuideModal: React.FC<CitadelGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'tutorial',
  onQuickLaunchPreset,
  onQuickLaunchCustom,
  onQuickLaunchBattles
}) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'codex'>(initialTab);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const totalSlides = 5;

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const handleClose = useCallback(() => {
    onClose(true);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      } else if (activeTab === 'tutorial') {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, handleNext, handlePrev, handleClose]);

  // Touch swipe support for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    // Minimum swipe distance 45px and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="citadel-modal-backdrop"
      onClick={handleClose}
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with Title and Mode Switcher */}
        <div className="citadel-guide-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="citadel-brand-crest" style={{ width: 36, height: 36 }}>
              <Compass size={20} color="var(--bg-primary, #0a0e14)" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2
                  id="citadel-guide-title"
                  className="font-serif"
                  style={{
                    fontSize: 17,
                    fontWeight: 900,
                    letterSpacing: '1px',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2
                  }}
                >
                  Citadel Navigator
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
                  {activeTab === 'tutorial' ? `TUTORIAL (${currentSlide + 1}/${totalSlides})` : 'CODEX MANUAL'}
                </span>
              </div>
              <p
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  letterSpacing: '0.2px'
                }}
              >
                {activeTab === 'tutorial'
                  ? 'Interactive Walkthrough of the Known World Navigator'
                  : 'Complete Cartographer Reference & Citadel Lore'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close guide"
            title="Close guide (Esc)"
            className="citadel-modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Mode Tabs Switcher */}
        <div className="citadel-guide-tabs-bar">
          <button
            type="button"
            className={`citadel-guide-tab-btn ${activeTab === 'tutorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorial')}
          >
            <Sparkles size={14} />
            <span>Interactive Tutorial</span>
          </button>
          <button
            type="button"
            className={`citadel-guide-tab-btn ${activeTab === 'codex' ? 'active' : ''}`}
            onClick={() => setActiveTab('codex')}
          >
            <BookOpen size={14} />
            <span>Citadel Codex & Reference</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="citadel-guide-body">
          {activeTab === 'tutorial' ? (
            /* TAB 1: INTERACTIVE 5-SLIDE TUTORIAL */
            <div className="citadel-tutorial-slide-container">
              {/* Slide 0: Welcome & Scale */}
              {currentSlide === 0 && (
                <div className="citadel-tutorial-slide">
                  <div className="citadel-slide-badge-row">
                    <span className="citadel-slide-badge">
                      <Compass size={14} /> Slide 1 of 5 • Introduction
                    </span>
                  </div>
                  <h3 className="citadel-slide-title font-serif">Welcome to the Known World Navigator</h3>
                  <p className="citadel-slide-subtitle">
                    The Archmaester&apos;s multimodal route and distance calculation engine for Westeros, Essos, and Beyond.
                  </p>

                  <div className="citadel-slide-card-highlight">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <ScaleCalloutIcon />
                      <strong style={{ fontSize: 13, color: 'var(--text-gold-bright)' }}>
                        Precision Physical Calibration
                      </strong>
                    </div>
                    <div className="citadel-scale-grid">
                      <div className="citadel-scale-chip">
                        <span className="citadel-chip-label">Scale Bar</span>
                        <span className="citadel-chip-val">1 px = 0.875 miles</span>
                      </div>
                      <div className="citadel-scale-chip">
                        <span className="citadel-chip-label">The Wall</span>
                        <span className="citadel-chip-val">297.4 miles (canonical ~300)</span>
                      </div>
                      <div className="citadel-scale-chip">
                        <span className="citadel-chip-label">Kingsroad</span>
                        <span className="citadel-chip-val">1,563 miles King&apos;s Landing to Winterfell</span>
                      </div>
                    </div>
                  </div>

                  <div className="citadel-slide-points">
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">✓</div>
                      <div>
                        <strong>True Multimodal Pathfinding:</strong> Seamless transitions between royal paved stone roads, mountain passes, causeways, and maritime shipping lanes.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">✓</div>
                      <div>
                        <strong>Realistic Travel Physics:</strong> Speed calculated in authentic travel days based on party composition and terrain obstacles.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">✓</div>
                      <div>
                        <strong>10 000 × 8 300 Canvas:</strong> High-definition cartography rendered with glowing route overlays and animated traveler tokens.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 1: Plan Expeditions & Travel Parties */}
              {currentSlide === 1 && (
                <div className="citadel-tutorial-slide">
                  <div className="citadel-slide-badge-row">
                    <span className="citadel-slide-badge">
                      <Footprints size={14} /> Slide 2 of 5 • Expedition Planning
                    </span>
                  </div>
                  <h3 className="citadel-slide-title font-serif">Plan Expeditions & Choose Your Host</h3>
                  <p className="citadel-slide-subtitle">
                    Select origin and destination strongholds, add up to 8 waypoints, and select from 7 calibrated travel parties.
                  </p>

                  {/* Travel Party Archetypes Showcase */}
                  <div className="citadel-parties-showcase">
                    <div className="citadel-party-chip">
                      <Bird size={16} color="#c084fc" />
                      <div>
                        <strong>Raven / Crow</strong>
                        <span>240 mi/day • Flight</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Flame size={16} color="#ef4444" />
                      <div>
                        <strong>Dragon Host</strong>
                        <span>520 mi/day • Supersonic</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Feather size={16} color="#4ade80" />
                      <div>
                        <strong>Fast Courier</strong>
                        <span>58 mi/day • Relay horse</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Crown size={16} color="#fbbf24" />
                      <div>
                        <strong>Royal Progress</strong>
                        <span>18 mi/day • Wheelhouses</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Shield size={16} color="#f87171" />
                      <div>
                        <strong>Armored Host</strong>
                        <span>12 mi/day • Marching army</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Coins size={16} color="#fb923c" />
                      <div>
                        <strong>Caravan</strong>
                        <span>15 mi/day • Pack mules</span>
                      </div>
                    </div>
                    <div className="citadel-party-chip">
                      <Ship size={16} color="#38bdf8" />
                      <div>
                        <strong>War Fleet</strong>
                        <span>115 mi/day • Sea lanes</span>
                      </div>
                    </div>
                  </div>

                  <div className="citadel-slide-points">
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">1</div>
                      <div>
                        <strong>Pick on Map:</strong> Click the target icon next to any stop, then tap directly on any stronghold on the map canvas.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">2</div>
                      <div>
                        <strong>Auto-Optimize (TSP):</strong> Have multiple stops? One click re-sequences your waypoints to eliminate backtracking.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">3</div>
                      <div>
                        <strong>Terrain Modifiers:</strong> Valyrian stone highways grant a +25% speed bonus, while The Neck swamps slow travel by -55%.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Historical Lore Chronicles (Presets) */}
              {currentSlide === 2 && (
                <div className="citadel-tutorial-slide">
                  <div className="citadel-slide-badge-row">
                    <span className="citadel-slide-badge">
                      <BookOpen size={14} /> Slide 3 of 5 • Historical Presets
                    </span>
                  </div>
                  <h3 className="citadel-slide-title font-serif">Relive Canonical Lore Journeys</h3>
                  <p className="citadel-slide-subtitle">
                    Select from pre-calibrated historic chronicles across the history of the Seven Kingdoms.
                  </p>

                  <div className="citadel-presets-preview-grid">
                    <div className="citadel-preset-card-mini">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Crown size={14} color="#ffd700" />
                        <strong style={{ color: 'var(--text-gold)' }}>Robert&apos;s Royal Progress</strong>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        King&apos;s Landing → Winterfell • 1,563 miles • 87 days (Wheelhouse)
                      </span>
                    </div>

                    <div className="citadel-preset-card-mini">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Flame size={14} color="#ef4444" />
                        <strong style={{ color: 'var(--text-gold)' }}>Aegon&apos;s Conquest: Harrenhal</strong>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        King&apos;s Landing → Harrenhal • Balerion the Black Dread • 0.6 days
                      </span>
                    </div>

                    <div className="citadel-preset-card-mini">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Ship size={14} color="#38bdf8" />
                        <strong style={{ color: 'var(--text-gold)' }}>Nymeria&apos;s 10 000 Ships</strong>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Volantis → Sunspear via the Summer Sea & Sothoryos • 11 000+ miles
                      </span>
                    </div>

                    <div className="citadel-preset-card-mini">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Compass size={14} color="#34d399" />
                        <strong style={{ color: 'var(--text-gold)' }}>Sea Snake: Voyage to Asshai</strong>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Driftmark → Asshai-by-the-Shadow via the Jade Gates & Leng
                      </span>
                    </div>
                  </div>

                  <div className="citadel-slide-points">
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">★</div>
                      <div>
                        <strong>Instant Loading:</strong> Access the <em>Chronicles</em> dropdown in the topbar to load any journey with calibrated parties and waypoints.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num">★</div>
                      <div>
                        <strong>Archival Lore Snippets:</strong> Each preset includes canonical background notes detailing the historical events and royal decrees.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 3: Tactical Battles & 325+ Strongholds */}
              {currentSlide === 3 && (
                <div className="citadel-tutorial-slide">
                  <div className="citadel-slide-badge-row">
                    <span className="citadel-slide-badge">
                      <Swords size={14} /> Slide 4 of 5 • Battles & Strongholds
                    </span>
                  </div>
                  <h3 className="citadel-slide-title font-serif">Tactical Battle Sites & 325+ Settlements</h3>
                  <p className="citadel-slide-subtitle">
                    Explore major clashes from Robert&apos;s Rebellion, the War of the Five Kings, and the Dance of the Dragons.
                  </p>

                  <div className="citadel-battles-preview-box">
                    <div className="citadel-battle-item">
                      <div className="citadel-battle-icon-badge">
                        <Swords size={16} color="#ef4444" />
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-gold)' }}>Battle of the Trident (283 AC)</strong>
                        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-muted)' }}>
                          Robert Baratheon slays Rhaegar Targaryen in the river shallows. 75 000 men.
                        </p>
                      </div>
                    </div>

                    <div className="citadel-battle-item">
                      <div className="citadel-battle-icon-badge">
                        <Swords size={16} color="#ef4444" />
                      </div>
                      <div>
                        <strong style={{ color: 'var(--text-gold)' }}>Battle of the Blackwater (299 AC)</strong>
                        <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--text-muted)' }}>
                          Wildfire inferno on Blackwater Bay. Tyrion & Tywin defeat Stannis Baratheon.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="citadel-slide-points">
                    <div className="citadel-point-item">
                      <div className="citadel-point-num"><Star size={12} /></div>
                      <div>
                        <strong>325+ Canonical Settlements:</strong> Regional capitals, major ports, castles, ruins, and strategic crossroads with lore dossiers and sigils.
                      </div>
                    </div>
                    <div className="citadel-point-item">
                      <div className="citadel-point-num"><Swords size={12} /></div>
                      <div>
                        <strong>Battle Dossiers:</strong> Click any crossed-swords marker to view commanders, combatant factions, casualties, and wiki links.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 4: Master Tools & Quick Launch Starters */}
              {currentSlide === 4 && (
                <div className="citadel-tutorial-slide">
                  <div className="citadel-slide-badge-row">
                    <span className="citadel-slide-badge">
                      <Sparkles size={14} /> Slide 5 of 5 • Ready to Explore
                    </span>
                  </div>
                  <h3 className="citadel-slide-title font-serif">Master Cartographer Instruments</h3>
                  <p className="citadel-slide-subtitle">
                    Toggle cartography layers, measure distances with the ruler, switch themes, or launch directly into a journey.
                  </p>

                  <div className="citadel-tools-summary-grid">
                    <div className="citadel-tool-summary-card">
                      <Layers size={18} color="var(--border-gold)" />
                      <div>
                        <strong>Cartography Layers</strong>
                        <span>Toggle Roads, Sea Lanes, Battles, Labels & Graticules</span>
                      </div>
                    </div>
                    <div className="citadel-tool-summary-card">
                      <Ruler size={18} color="var(--border-gold)" />
                      <div>
                        <strong>Distance Measurement Ruler</strong>
                        <span>Click any two points to measure Euclidean miles & leagues</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick-Launch Journey Starters */}
                  <div className="citadel-quick-launch-section">
                    <strong style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-gold-bright)' }}>
                      Quick-Start Your First Expedition:
                    </strong>

                    <div className="citadel-quick-launch-grid">
                      <button
                        type="button"
                        className="citadel-quick-launch-btn primary"
                        onClick={() => {
                          if (onQuickLaunchPreset) {
                            onQuickLaunchPreset('robert_progress');
                          } else {
                            handleClose();
                          }
                        }}
                      >
                        <Crown size={15} />
                        <span>Explore Robert&apos;s Royal Progress</span>
                      </button>

                      <button
                        type="button"
                        className="citadel-quick-launch-btn"
                        onClick={() => {
                          if (onQuickLaunchCustom) {
                            onQuickLaunchCustom();
                          } else {
                            handleClose();
                          }
                        }}
                      >
                        <MapPin size={15} />
                        <span>Chart My Own Route</span>
                      </button>

                      <button
                        type="button"
                        className="citadel-quick-launch-btn"
                        onClick={() => {
                          if (onQuickLaunchBattles) {
                            onQuickLaunchBattles();
                          } else {
                            handleClose();
                          }
                        }}
                      >
                        <Swords size={15} />
                        <span>Inspect Tactical Battles</span>
                      </button>

                      <button
                        type="button"
                        className="citadel-quick-launch-btn subtle"
                        onClick={handleClose}
                      >
                        <Compass size={15} />
                        <span>Browse Map Freely</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: COMPREHENSIVE CITADEL CODEX REFERENCE */
            <div className="citadel-codex-content">
              {/* Quick Start 4 Steps */}
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
                        <strong>Inspect Route & Corridors</strong>
                      </div>
                      <p>
                        Review travel days, total miles, terrain multipliers, and watch the animated traveler token advance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Find in the Citadel */}
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
                        Top dropdown loads famous routes: Robert&apos;s Progress, Nymeria&apos;s 10 000 Ships, Aegon&apos;s Conquest, Sea Snake voyages and more.
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

              {/* Cartographer's Pro-Tips */}
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

              {/* Replay Tutorial Link */}
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <button
                  type="button"
                  className="citadel-replay-tutorial-btn"
                  onClick={() => {
                    setActiveTab('tutorial');
                    setCurrentSlide(0);
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Replay Interactive Tutorial (5 Steps)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Controls and Confirmation */}
        <div className="citadel-guide-footer">
          {activeTab === 'tutorial' ? (
            <div className="citadel-tutorial-footer-row">
              {/* Prev Button */}
              <button
                type="button"
                className="citadel-slide-nav-btn"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              {/* Progress Dots */}
              <div className="citadel-slide-dots" role="tablist" aria-label="Tutorial Slides">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={currentSlide === idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`citadel-slide-dot ${currentSlide === idx ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                  />
                ))}
              </div>

              {/* Next / Finish Button */}
              {currentSlide < totalSlides - 1 ? (
                <button
                  type="button"
                  className="btn-citadel"
                  style={{ flex: '0 0 auto', padding: '8px 20px' }}

                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"

                  className="btn-citadel"
                  style={{ flex: '0 0 auto', padding: '8px 20px' }} onClick={handleClose}
                  aria-label="Finish tutorial"
                >
                  <span>Enter Citadel</span>
                  <CheckCircle2 size={15} />
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 12 }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Archmaester Scale: 1 px = 0.875 miles (0.292 leagues) • 300-mile Wall anchor
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="btn-citadel"
                style={{ flex: '0 0 auto', padding: '8px 20px' }}
              >
                <span>Understood, Archmaester</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const ScaleCalloutIcon: React.FC = () => (
  <div
    style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'rgba(223, 177, 91, 0.2)',
      border: '1px solid var(--border-gold)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-gold-bright)',
      flexShrink: 0
    }}
  >
    <Ruler size={13} />
  </div>
);

export default CitadelGuideModal;
