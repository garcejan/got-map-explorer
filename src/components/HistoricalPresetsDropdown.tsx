import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronDown,
  Sparkles,
  Bird,
  Crown,
  Shield,
  Ship,
  Feather,
  Check,
  X,
  Search,
  BookOpen,
  ArrowRight,
  Shuffle
} from 'lucide-react';
import { PRESET_JOURNEYS, type PresetJourney } from '../data/presets';
import { NODES } from '../data/nodes';

export type { PresetJourney };
export { PRESET_JOURNEYS };

interface HistoricalPresetsDropdownProps {
  onSelectPreset: (preset: PresetJourney) => void;
  activePresetId?: string | null;
  onClearPreset?: () => void;
}

type CategoryFilter = 'all' | 'royal_war' | 'sea_voyage' | 'rookery';

interface PresetMetadata {
  category: CategoryFilter;
  categoryLabel: string;
  stats: string;
  originName: string;
  destName: string;
  waypointNames: string[];
}

const PRESET_META: Record<string, PresetMetadata> = {
  robert_progress: {
    category: 'royal_war',
    categoryLabel: 'Royal Progress',
    stats: '~1,538 mi • ~128 days',
    originName: "King's Landing",
    destName: 'Winterfell',
    waypointNames: []
  },
  raven_message: {
    category: 'rookery',
    categoryLabel: 'Rookery Flight',
    stats: '~1,509 mi • ~6.3 days',
    originName: 'Winterfell',
    destName: "King's Landing",
    waypointNames: []
  },
  wall_patrol: {
    category: 'royal_war',
    categoryLabel: "Night's Watch",
    stats: '~321 mi • ~41 days',
    originName: 'Shadow Tower',
    destName: 'Eastwatch-by-the-Sea',
    waypointNames: []
  },
  arya_braavos: {
    category: 'sea_voyage',
    categoryLabel: 'Narrow Sea Crossing',
    stats: '~929 mi • ~8.1 days',
    originName: 'Saltpans',
    destName: 'Braavos',
    waypointNames: []
  },
  dany_slavers_bay: {
    category: 'royal_war',
    categoryLabel: "Conquest & Siege",
    stats: '~514 mi • ~39 days',
    originName: 'Astapor',
    destName: 'Meereen',
    waypointNames: ['Yunkai']
  },
  oberyn_vengeance: {
    category: 'royal_war',
    categoryLabel: 'Dornish Retinue',
    stats: '~1,402 mi • ~38 days',
    originName: 'Sunspear',
    destName: "King's Landing",
    waypointNames: []
  },
  nymeria_ten_thousand_ships: {
    category: 'sea_voyage',
    categoryLabel: 'Rhoynar Exodus',
    stats: '~10,654 mi • ~80 days',
    originName: 'Volantis',
    destName: 'Sunspear',
    waypointNames: ['Tall Trees Town']
  },
  corlys_asshai: {
    category: 'sea_voyage',
    categoryLabel: 'Jade Sea Odyssey',
    stats: '~9,070 mi • ~68 days',
    originName: 'Driftmark',
    destName: 'Asshai',
    waypointNames: ['Volantis', 'Qarth', 'Leng']
  },
  corlys_shivering_sea: {
    category: 'sea_voyage',
    categoryLabel: 'Shivering Sea Voyage',
    stats: '~6,718 mi • ~80 days',
    originName: 'Driftmark',
    destName: 'Nefer',
    waypointNames: ['Braavos', 'Port of Ibben']
  },
  euron_silence: {
    category: 'sea_voyage',
    categoryLabel: 'Iron Fleet Raid',
    stats: '~13,339 mi • ~97 days',
    originName: 'Pyke',
    destName: 'Oldtown',
    waypointNames: ['Qarth']
  }
};

export const HistoricalPresetsDropdown: React.FC<HistoricalPresetsDropdownProps> = ({
  onSelectPreset,
  activePresetId,
  onClearPreset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const activePreset = useMemo(
    () => PRESET_JOURNEYS.find((p) => p.id === activePresetId),
    [activePresetId]
  );

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter preset journeys by search query and category
  const filteredPresets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRESET_JOURNEYS.filter((preset) => {
      const meta = PRESET_META[preset.id];
      if (activeCategory !== 'all') {
        if (meta?.category !== activeCategory) return false;
      }
      if (!q) return true;

      const originName = NODES[preset.originId]?.name || preset.originId;
      const destName = NODES[preset.destinationId]?.name || preset.destinationId;
      const waypoints = (preset.waypoints || []).map((id) => NODES[id]?.name || id).join(' ');

      return (
        preset.name.toLowerCase().includes(q) ||
        preset.lore.toLowerCase().includes(q) ||
        originName.toLowerCase().includes(q) ||
        destName.toLowerCase().includes(q) ||
        waypoints.toLowerCase().includes(q) ||
        (meta?.categoryLabel || '').toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategory]);

  // Adjust focused index within bounds
  const clampedIndex = useMemo(() => {
    if (filteredPresets.length === 0) return -1;
    return Math.max(0, Math.min(focusedIndex, filteredPresets.length - 1));
  }, [focusedIndex, filteredPresets.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % Math.max(1, filteredPresets.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + filteredPresets.length) % Math.max(1, filteredPresets.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (clampedIndex >= 0 && clampedIndex < filteredPresets.length) {
          const selected = filteredPresets[clampedIndex];
          onSelectPreset(selected);
          setIsOpen(false);
        }
      }
    },
    [isOpen, filteredPresets, clampedIndex, onSelectPreset]
  );

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && clampedIndex >= 0) {
      const activeElement = listRef.current.children[clampedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [clampedIndex, isOpen]);

  const handlePickRandom = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomIndex = Math.floor(Math.random() * PRESET_JOURNEYS.length);
    const chosen = PRESET_JOURNEYS[randomIndex];
    onSelectPreset(chosen);
    setIsOpen(false);
  };

  const getPartyIcon = (partyId: string, size = 15) => {
    switch (partyId) {
      case 'crow':
        return <Bird size={size} color="var(--preset-raven-icon)" />;
      case 'retinue':
        return <Crown size={size} color="var(--text-gold)" />;
      case 'army':
        return <Shield size={size} color="var(--icon-army)" />;
      case 'fleet':
        return <Ship size={size} color="var(--icon-fleet)" />;
      case 'messenger':
        return <Feather size={size} color="var(--icon-messenger)" />;
      default:
        return <Sparkles size={size} color="var(--text-gold)" />;
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'crow_flight':
        return { label: 'Direct Flight', bg: 'var(--preset-raven-bg)', color: 'var(--preset-raven-text)', border: 'var(--preset-raven-border)' };
      case 'sea_only':
        return { label: 'Sea Corridor', bg: 'var(--badge-sea-bg)', color: 'var(--badge-sea-val)', border: 'var(--badge-sea-border)' };
      case 'land_only':
        return { label: 'Land Road', bg: 'var(--badge-land-bg)', color: 'var(--badge-land-val)', border: 'var(--badge-land-border)' };
      default:
        return { label: 'Multimodal', bg: 'rgba(148, 163, 184, 0.12)', color: 'var(--text-parchment)', border: 'var(--border-subtle)' };
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: 0,
        maxWidth: 340,
        flex: '1 1 auto'
      }}
    >
      {/* Dropdown Trigger Button */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          height: 36,
          padding: '0 10px',
          borderRadius: 6,
          cursor: 'pointer',
          userSelect: 'none',
          background: 'var(--input-bg)',
          border: isOpen
            ? '1px solid var(--border-gold)'
            : activePreset
            ? '1px solid var(--border-gold)'
            : '1px solid var(--border-subtle)',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        title={activePreset ? `Active Chronicle: ${activePreset.name} (Click to switch)` : 'Select a canonical historic journey'}
      >
        {/* Left: Icon & Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0, overflow: 'hidden' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: activePreset
                ? activePreset.partyId === 'crow'
                  ? 'var(--preset-raven-bg)'
                  : 'rgba(223, 177, 91, 0.15)'
                : 'transparent',
              border: activePreset ? '1px solid var(--border-gold-glow)' : '1px solid var(--border-subtle)'
            }}
          >
            {activePreset ? getPartyIcon(activePreset.partyId, 13) : <BookOpen size={13} color="var(--text-gold)" />}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: activePreset ? 'var(--text-gold-bright)' : 'var(--text-parchment)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}
            >
              {activePreset ? activePreset.name : 'Historical Chronicles'}
            </span>
            {activePreset ? (
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1
                }}
              >
                {NODES[activePreset.originId]?.name || activePreset.originId} → {NODES[activePreset.destinationId]?.name || activePreset.destinationId}
              </span>
            ) : null}
          </div>
        </div>

        {/* Right: Badge / Clear Button / Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {activePreset ? (
            onClearPreset && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear active preset"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearPreset();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    onClearPreset();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
                title="Clear loaded preset"
              >
                <X size={11} />
              </span>
            )
          ) : (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 10,
                background: 'rgba(223, 177, 91, 0.15)',
                color: 'var(--text-gold)',
                border: '1px solid rgba(223, 177, 91, 0.3)',
                letterSpacing: '0.4px'
              }}
            >
              10
            </span>
          )}

          <ChevronDown
            size={14}
            color={isOpen ? 'var(--text-gold)' : 'var(--text-muted)'}
            style={{
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </div>
      </div>

      {/* Citadel Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Historical Chronicles of the Realm"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 440,
            maxWidth: 'min(440px, calc(100vw - 28px))',
            maxHeight: 520,
            zIndex: 3000,
            borderRadius: 8,
            border: '1px solid var(--border-gold-glow)',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInSlideDown 0.18s ease-out'
          }}
        >
          {/* Popover Header */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(180deg, rgba(223, 177, 91, 0.08) 0%, transparent 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={15} color="var(--text-gold)" />
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    color: 'var(--text-gold-bright)',
                    textTransform: 'uppercase',
                    margin: 0
                  }}
                >
                  Chronicles of the Realm
                </h3>
              </div>

              <button
                type="button"
                onClick={handlePickRandom}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'rgba(223, 177, 91, 0.12)',
                  border: '1px solid var(--border-gold-glow)',
                  color: 'var(--text-gold)'
                }}
                title="Explore a random canonical journey"
              >
                <Shuffle size={11} />
                <span>Random Route</span>
              </button>
            </div>

            {/* Quick Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--input-bg)',
                borderRadius: 5,
                border: '1px solid var(--border-subtle)',
                padding: '0 8px',
                height: 30
              }}
            >
              <Search size={13} color="var(--text-muted)" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search chronicles, lords, voyages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-parchment)',
                  fontSize: 12
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              {[
                { id: 'all' as CategoryFilter, label: 'All (10)' },
                { id: 'royal_war' as CategoryFilter, label: '👑 Royal & War (4)' },
                { id: 'sea_voyage' as CategoryFilter, label: '🌊 Sea Voyages (5)' },
                { id: 'rookery' as CategoryFilter, label: '🦅 Rookery (1)' }
              ].map((tab) => {
                const isSelected = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(tab.id);
                      setFocusedIndex(0);
                    }}
                    style={{
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: isSelected ? 700 : 500,
                      borderRadius: 12,
                      border: isSelected ? '1px solid var(--border-gold)' : '1px solid transparent',
                      background: isSelected ? 'rgba(223, 177, 91, 0.2)' : 'var(--bg-secondary)',
                      color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Cards List */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            {filteredPresets.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 12
                }}
              >
                No chronicles match &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredPresets.map((preset, index) => {
                const isSelected = activePresetId === preset.id;
                const isFocused = clampedIndex === index;
                const meta = PRESET_META[preset.id];
                const modeBadge = getModeBadge(preset.mode);
                const originName = NODES[preset.originId]?.name || preset.originId;
                const destName = NODES[preset.destinationId]?.name || preset.destinationId;
                const waypoints = (preset.waypoints || []).map((id) => NODES[id]?.name || id);

                return (
                  <div
                    key={preset.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectPreset(preset);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      background: isSelected
                        ? 'rgba(223, 177, 91, 0.15)'
                        : isFocused
                        ? 'var(--bg-hover)'
                        : 'transparent',
                      border: isSelected
                        ? '1px solid var(--border-gold)'
                        : isFocused
                        ? '1px solid var(--border-gold-glow)'
                        : '1px solid transparent',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {/* Party Icon Badge */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        flexShrink: 0,
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background:
                          preset.partyId === 'crow'
                            ? 'var(--preset-raven-bg)'
                            : preset.partyId === 'fleet'
                            ? 'var(--badge-sea-bg)'
                            : 'rgba(223, 177, 91, 0.15)',
                        border:
                          preset.partyId === 'crow'
                            ? '1px solid var(--preset-raven-border)'
                            : preset.partyId === 'fleet'
                            ? '1px solid var(--badge-sea-border)'
                            : '1px solid var(--border-gold-glow)'
                      }}
                    >
                      {getPartyIcon(preset.partyId, 16)}
                    </div>

                    {/* Content Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-parchment)'
                          }}
                        >
                          {preset.name}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          {isSelected && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                fontSize: 9,
                                fontWeight: 800,
                                padding: '1px 5px',
                                borderRadius: 10,
                                background: 'rgba(34, 197, 94, 0.2)',
                                color: '#4ade80',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                letterSpacing: '0.4px',
                                textTransform: 'uppercase'
                              }}
                            >
                              <Check size={9} /> Active
                            </span>
                          )}

                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: 4,
                              background: modeBadge.bg,
                              color: modeBadge.color,
                              border: `1px solid ${modeBadge.border}`
                            }}
                          >
                            {modeBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Route Path (Origin -> Waypoints -> Destination) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          color: 'var(--text-gold)',
                          fontWeight: 500,
                          margin: '2px 0 3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span>{originName}</span>
                        {waypoints.map((wp) => (
                          <React.Fragment key={wp}>
                            <ArrowRight size={10} color="var(--text-muted)" />
                            <span style={{ color: 'var(--text-parchment)' }}>{wp}</span>
                          </React.Fragment>
                        ))}
                        <ArrowRight size={10} color="var(--text-muted)" />
                        <span>{destName}</span>
                      </div>

                      {/* Lore snippet */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: 10.5,
                          color: 'var(--text-muted)',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {preset.lore}
                      </p>

                      {/* Distance & Transit Days Stats */}
                      {meta?.stats && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 3,
                            fontSize: 10,
                            color: 'var(--text-dim)'
                          }}
                        >
                          <span>{meta.stats}</span>
                          {meta.categoryLabel && (
                            <>
                              <span>•</span>
                              <span>{meta.categoryLabel}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Popover Footer */}
          <div
            style={{
              padding: '6px 12px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 10,
              color: 'var(--text-dim)'
            }}
          >
            <span>Press <strong>ESC</strong> to close • <strong>↑↓</strong> to navigate • <strong>↵</strong> to select</span>
            <span>{filteredPresets.length} of 10 routes</span>
          </div>
        </div>
      )}
    </div>
  );
};
