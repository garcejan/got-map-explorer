import React from 'react';
import { Compass, Moon, Sun } from 'lucide-react';
import { HistoricalPresetsDropdown, type PresetJourney } from './HistoricalPresetsDropdown';
import { CitySearch } from './CitySearch';

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
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onSelectTheme,
  onSelectPreset,
  activePresetId,
  onClearPreset,
  onSelectCity,
  onSetOrigin,
  onSetDestination
}) => {
  const isBeige = theme === 'beige';

  return (
    <header
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 8,
        left: 12,
        right: 12,
        height: 52,
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        gap: 14,
        borderRadius: 8,
        border: isBeige ? '1px solid var(--border-subtle)' : '1px solid var(--border-gold-glow)',
        boxShadow: isBeige ? 'none' : '0 8px 30px rgba(0, 0, 0, 0.85)'
      }}
    >
      {/* Brand & Citadel Crest */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #dfb15b 0%, #78350f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isBeige ? 'none' : '0 0 10px rgba(223, 177, 91, 0.6)',
            flexShrink: 0
          }}
        >
          <Compass size={18} color="#0a0e14" strokeWidth={2.5} />
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
                fontWeight: 800,
                letterSpacing: '0.6px'
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
              letterSpacing: '0.3px',
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
          justifyContent: 'center',
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

      {/* Right: Theme Switcher (Dark / Beige) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
              padding: '4px 10px',
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
            {/* <span>Dark</span> */}
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
              padding: '4px 10px',
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
            {/* <span>Beige</span> */}
          </button>
        </div>
      </div>
    </header>
  );
};


