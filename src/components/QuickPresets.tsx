import React from 'react';
import { Sparkles, Bird } from 'lucide-react';
import { PRESET_JOURNEYS, type PresetJourney } from '../data/presets';

export type { PresetJourney };
export { PRESET_JOURNEYS };

interface QuickPresetsProps {
  onSelectPreset: (preset: PresetJourney) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPreset }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflowX: 'auto',
        maxWidth: '100%',
        padding: '2px 0',
        scrollbarWidth: 'none'
      }}
    >
      {PRESET_JOURNEYS.map((p) => {
        const isRaven = p.partyId === 'crow';
        return (
          <button
            key={p.id}
            onClick={() => onSelectPreset(p)}
            className="btn-secondary glass-panel"
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: isRaven ? '1px solid var(--preset-raven-border)' : '1px solid var(--border-subtle)',
              background: isRaven ? 'var(--preset-raven-bg)' : 'var(--bg-card)'
            }}
            title={p.lore}
          >
            {isRaven ? <Bird size={14} color="var(--preset-raven-icon)" /> : <Sparkles size={13} color="var(--text-gold)" />}
            <span style={{ color: isRaven ? 'var(--preset-raven-text)' : 'var(--text-parchment)' }}>{p.name}</span>
          </button>
        );
      })}
    </div>
  );
};

