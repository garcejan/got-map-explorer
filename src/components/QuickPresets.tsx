import React from 'react';
import { HistoricalPresetsDropdown, type PresetJourney, PRESET_JOURNEYS } from './HistoricalPresetsDropdown';

export type { PresetJourney };
export { PRESET_JOURNEYS };

interface QuickPresetsProps {
  onSelectPreset: (preset: PresetJourney) => void;
  activePresetId?: string | null;
  onClearPreset?: () => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({
  onSelectPreset,
  activePresetId,
  onClearPreset
}) => {
  return (
    <HistoricalPresetsDropdown
      onSelectPreset={onSelectPreset}
      activePresetId={activePresetId}
      onClearPreset={onClearPreset}
    />
  );
};


