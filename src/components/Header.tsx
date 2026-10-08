import React, { useState } from 'react';
import { Compass, Moon, Sun, Info, Search, BookOpen, Navigation, Layers, Feather } from 'lucide-react';
import { HistoricalPresetsDropdown, type PresetJourney } from './HistoricalPresetsDropdown';
import { CitySearch } from './CitySearch';
import { GITHUB_REPO_URL } from '../data/github';
import { GithubIcon } from './ReportIssueModal';

export type Theme = 'dark' | 'beige';

interface HeaderProps {
  theme: Theme;
  onSelectTheme: (theme: Theme) => void;
  onSelectPreset: (preset: PresetJourney) => void;
  activePresetId?: string | null;
  onClearPreset?: () => void;
  onSelectCity: (nodeId: string) => void;
  onSetOrigin?: (nodeId: string) => void;
  onSetDestination?: (nodeId: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  routeDays?: number | null;
  isMobile?: boolean;
  onToggleLayers?: () => void;
  isLayersOpen?: boolean;
  onOpenGuide?: (tab?: 'tutorial' | 'codex') => void;
  onOpenReportIssue?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onSelectTheme,
  onSelectPreset,
  activePresetId,
  onClearPreset,
  onSelectCity,
  onSetOrigin,
  onSetDestination,
  onToggleSidebar,
  isSidebarOpen,
  isMobile = false,
  onToggleLayers,
  isLayersOpen = false,
  onOpenGuide,
  onOpenReportIssue
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobilePresetsOpen, setIsMobilePresetsOpen] = useState(false);
  const isBeige = theme === 'beige';


  return (
    <header className="glass-panel citadel-header-panel">
      {isMobile ? (
        <>
          {/* Mobile Brand Crest & Title */}
          <div className="citadel-mobile-title-container">
            <div className="citadel-brand-crest">
              <Compass size={14} color="var(--bg-primary, #0a0e14)" strokeWidth={2.5} />
            </div>

            <h1 className="font-serif citadel-mobile-title">
              The Known World
            </h1>
          </div>

          {/* Mobile Quick Action Buttons Cluster */}
          <div className="citadel-mobile-btn-cluster">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsMobilePresetsOpen(false);
                if (isLayersOpen && onToggleLayers) onToggleLayers();
                setIsMobileSearchOpen(!isMobileSearchOpen);
              }}
              className={`citadel-mobile-btn ${isMobileSearchOpen ? 'active' : ''}`}
              title="Search settlements and lore"
              aria-label="Search Known World settlements"
            >
              <Search size={14} />
            </button>

            {/* Presets / Chronicles Trigger */}
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                if (isLayersOpen && onToggleLayers) onToggleLayers();
                setIsMobilePresetsOpen(!isMobilePresetsOpen);
              }}
              className={`citadel-mobile-btn ${isMobilePresetsOpen || activePresetId ? 'active' : ''}`}
              title="Historical Chronicles"
              aria-label="Historical preset journeys"
            >
              <BookOpen size={14} />
            </button>

            {/* Cartography Layers Trigger */}
            {onToggleLayers && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setIsMobilePresetsOpen(false);
                  onToggleLayers();
                }}
                className={`citadel-mobile-btn ${isLayersOpen ? 'active' : ''}`}
                title="Citadel Cartography Layers"
                aria-label="Toggle Cartography Overlay Layers"
              >
                <Layers size={14} />
              </button>
            )}

            {/* Theme Switcher Toggle (1-click) */}
            <button
              type="button"
              onClick={() => onSelectTheme(isBeige ? 'dark' : 'beige')}
              className="citadel-mobile-btn"
              title={`Switch to ${isBeige ? 'Dark' : 'Beige'} Theme`}
              aria-label={`Switch to ${isBeige ? 'Dark' : 'Beige'} Theme`}
            >
              {isBeige ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Guide Button */}
            <button
              type="button"
              onClick={() => onOpenGuide?.('tutorial')}
              className="citadel-mobile-btn"
              title="Citadel Guide & Tutorial"
              aria-label="Citadel Tutorial"
            >
              <Info size={14} />
            </button>

            {/* Report an Issue Trigger */}
            {onOpenReportIssue && (
              <button
                type="button"
                onClick={onOpenReportIssue}
                className="citadel-mobile-btn"
                title="Send a Raven / Report an Issue"
                aria-label="Report an issue or send a raven"
              >
                <Feather size={14} />
              </button>
            )}

            {/* GitHub Repository Link Trigger */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="citadel-mobile-btn"
              title="View source on GitHub (garcejan/got-map-explorer)"
              aria-label="GitHub Repository"
            >
              <GithubIcon size={14} />
            </a>

            {/* Ledger Toggle Button */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className={`citadel-mobile-btn ${isSidebarOpen ? 'active' : ''}`}
                title={isSidebarOpen ? "Collapse Citadel Ledger" : "Open Citadel Ledger"}
                aria-label="Toggle Citadel Ledger"
              >
                <Navigation size={14} />
              </button>
            )}
          </div>

          {/* Mobile Search Modal Drawer */}
          {isMobileSearchOpen && (
            <div
              className="citadel-modal-backdrop"
              onClick={() => setIsMobileSearchOpen(false)}
              style={{ zIndex: 3200 }}
            >
              <div
                className="glass-panel citadel-mobile-search-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <CitySearch
                  onSelectCity={(id) => {
                    onSelectCity(id);
                    setIsMobileSearchOpen(false);
                  }}
                  onSetOrigin={(id) => {
                    onSetOrigin?.(id);
                    setIsMobileSearchOpen(false);
                  }}
                  onSetDestination={(id) => {
                    onSetDestination?.(id);
                    setIsMobileSearchOpen(false);
                  }}
                  isMobile={true}
                  onClose={() => setIsMobileSearchOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Mobile Presets Modal Drawer */}
          {isMobilePresetsOpen && (
            <div
              className="citadel-modal-backdrop"
              onClick={() => setIsMobilePresetsOpen(false)}
              style={{ zIndex: 3200 }}
            >
              <div
                className="glass-panel citadel-mobile-presets-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <HistoricalPresetsDropdown
                  onSelectPreset={(preset) => {
                    onSelectPreset(preset);
                    setIsMobilePresetsOpen(false);
                  }}
                  activePresetId={activePresetId}
                  onClearPreset={onClearPreset}
                  isMobile={true}
                  onClose={() => setIsMobilePresetsOpen(false)}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Brand & Citadel Crest */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div className="citadel-brand-crest">
              <Compass size={18} color="var(--bg-primary, #0a0e14)" strokeWidth={2.5} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h1
                  className="font-serif"
                  style={{
                    fontSize: 15,
                    fontWeight: 900,
                    letterSpacing: '1.2px',
                    color: 'var(--text-gold)',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    margin: 0
                  }}
                >
                  The Known World
                </h1>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: 'rgba(223, 177, 91, 0.25)',
                    color: 'var(--text-gold-bright)',
                    fontWeight: 700,
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: 0.5
                  }}
                >
                  CITADEL
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  margin: '2px 0 0',
                  letterSpacing: '0.2px',
                  fontFamily: "'Cinzel'",
                  whiteSpace: 'nowrap'
                }}
              >
                Curved Roads & Sea Corridors
              </p>
            </div>
          </div>

          {/* Citadel Settlement & Lore Search Bar */}
          <CitySearch
            onSelectCity={onSelectCity}
            onSetOrigin={onSetOrigin}
            onSetDestination={onSetDestination}
          />

          {/* Center: Canonical Historic Journeys Dropdown */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
              minWidth: 0,
              padding: '0 6px'
            }}
          >
            <HistoricalPresetsDropdown
              onSelectPreset={onSelectPreset}
              activePresetId={activePresetId}
              onClearPreset={onClearPreset}
            />
          </div>

          {/* Right: Info / Guide Button & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Citadel Guide / Tutorial Button */}
            <button
              type="button"
              onClick={() => onOpenGuide?.('tutorial')}
              className="citadel-guide-header-btn"
              title="Citadel Navigator Guide & Tutorial"
              aria-label="How to use this app and explore the Known World"
            >
              <Info size={14} />
              <span className="citadel-header-btn-text-responsive">Guide</span>
            </button>

            {/* Report Issue / Send Raven Button */}
            {onOpenReportIssue && (
              <button
                type="button"
                onClick={onOpenReportIssue}
                className="citadel-report-header-btn"
                title="Send a Raven / Report an Issue or Suggest Correction"
                aria-label="Report an issue or suggest cartographic correction"
              >
                <Feather size={13} />
                <span className="citadel-header-btn-text-responsive">Report Issue</span>
              </button>
            )}

            {/* GitHub Repository Link Button */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="citadel-github-header-btn"
              title="View source repository on GitHub (garcejan/got-map-explorer)"
              aria-label="View source repository on GitHub"
            >
              <GithubIcon size={14} />
              <span className="citadel-header-btn-text-responsive">GitHub</span>
            </a>

            {/* Theme Switcher (Dark / Beige) */}
            <div
              role="radiogroup"
              aria-label="Theme selector"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                border: isBeige ? '1px solid var(--border-subtle)' : '1px solid var(--border-gold-glow)',
                borderRadius: 20,
                padding: '3px',
                gap: 3,
                boxShadow: isBeige ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.25)'
              }}
            >
              <button
                type="button"
                onClick={() => onSelectTheme('dark')}
                aria-checked={theme === 'dark'}
                role="radio"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 5px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  background:
                    theme === 'dark'
                      ? 'linear-gradient(135deg, #243040 0%, #151d27 100%)'
                      : 'transparent',
                  color: theme === 'dark' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                  boxShadow:
                    theme === 'dark'
                      ? '0 1px 4px rgba(0,0,0,0.5), inset 0 0 0 1px var(--border-gold)'
                      : 'none'
                }}
                title="Switch to Dark (Citadel Obsidian) Theme"
              >
                <Moon size={13} />
              </button>

              <button
                type="button"
                onClick={() => onSelectTheme('beige')}
                aria-checked={theme === 'beige'}
                role="radio"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 5px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  background:
                    theme === 'beige'
                      ? 'linear-gradient(135deg, #d3b47f 0%, #b38b45 100%)'
                      : 'transparent',
                  color: theme === 'beige' ? '#1c150c' : 'var(--text-muted)',
                  boxShadow: 'none'
                }}
                title="Switch to Beige (Antiquarian Parchment) Theme"
              >
                <Sun size={13} />
              </button>
            </div>
          </div>
        </>
      )}


    </header>
  );
};


