import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  Navigation,
  Crown,
  Shield,
  Coins,
  Ship,
  Flame,
  Feather,
  Bird,
  Minimize2,
  Maximize2,
  Milestone,
  Clock,
  Compass,
  Info,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { RoutingPreference, OptimizationGoal } from '../types';
import { NODES } from '../data/nodes';
import { TRAVEL_PARTIES } from '../engine/parties';
import { PartySpeedInfoModal } from './PartySpeedInfoModal';

interface RoutePlannerProps {
  originId: string;
  destinationId: string;
  waypointIds: string[];
  selectedPartyId: string;
  selectedMode: RoutingPreference;
  selectedGoal: OptimizationGoal;
  autoOptimize?: boolean;
  isSuboptimalOrder?: boolean;
  potentialSavingsMiles?: number;
  onSetOrigin: (id: string) => void;
  onSetDestination: (id: string) => void;
  onSetWaypoints: (ids: string[]) => void;
  onOptimizeWaypoints?: () => void;
  onToggleAutoOptimize?: (enabled: boolean) => void;
  onSelectParty: (id: string) => void;
  onSelectMode: (mode: RoutingPreference) => void;
  onSelectGoal: (goal: OptimizationGoal) => void;
  onCalculateRoute: () => void;
}

interface AutocompleteInputProps {
  label: string;
  value: string;
  placeholder: string;
  dotColor: string;
  onChangeId: (id: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  placeholder,
  dotColor,
  onChangeId
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && NODES[value]) {
      setQuery(NODES[value].name);
    } else {
      setQuery('');
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredNodes = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const all = Object.values(NODES);
    if (!trimmed) {
      return all.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 50);
    }
    return all
      .map((node) => {
        let score = 0;
        const nameLower = node.name.toLowerCase();
        if (nameLower === trimmed) score += 100;
        else if (nameLower.startsWith(trimmed)) score += 60;
        else if (nameLower.includes(trimmed)) score += 40;
        if (node.region.toLowerCase().includes(trimmed)) score += 20;
        if (node.allegiance && node.allegiance.toLowerCase().includes(trimmed)) score += 15;
        return { node, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.node)
      .slice(0, 60);
  }, [query]);

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: 10 }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        color: 'var(--text-muted)',
        marginBottom: 4
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor }} />
        <span>{label}</span>
      </label>

      <input
        type="text"
        className="citadel-input"
        value={query}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        style={{ width: '100%' }}
      />

      {isOpen && filteredNodes.length > 0 && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 2000,
            maxHeight: 220,
            overflowY: 'auto',
            marginTop: 4,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.9)',
            border: '1px solid var(--border-gold)'
          }}
        >
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => {
                onChangeId(node.id);
                setQuery(node.name);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(223, 177, 91, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <strong style={{ fontSize: 12, color: 'var(--text-parchment)' }}>
                  {node.name}
                </strong>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  {node.allegiance || node.region.replace('_', ' ')}
                </div>
              </div>

              <span style={{
                fontSize: 9,
                color: 'var(--text-gold)',
                textTransform: 'uppercase',
                background: '#1e293b',
                padding: '2px 5px',
                borderRadius: 3
              }}>
                {node.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  originId,
  destinationId,
  waypointIds,
  selectedPartyId,
  selectedMode,
  selectedGoal,
  autoOptimize = false,
  isSuboptimalOrder = false,
  potentialSavingsMiles = 0,
  onSetOrigin,
  onSetDestination,
  onSetWaypoints,
  onOptimizeWaypoints,
  onToggleAutoOptimize,
  onSelectParty,
  onSelectMode,
  onSelectGoal,
  onCalculateRoute
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showPartyInfoModal, setShowPartyInfoModal] = useState(false);

  const handleSwap = () => {
    const temp = originId;
    onSetOrigin(destinationId);
    onSetDestination(temp);
  };

  const handleAddWaypoint = () => {
    if (waypointIds.length >= 8) return;
    onSetWaypoints([...waypointIds, '']);
  };

  const handleUpdateWaypoint = (index: number, id: string) => {
    const updated = [...waypointIds];
    updated[index] = id;
    onSetWaypoints(updated);
  };

  const handleRemoveWaypoint = (index: number) => {
    const updated = waypointIds.filter((_, i) => i !== index);
    onSetWaypoints(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...waypointIds];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onSetWaypoints(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= waypointIds.length - 1) return;
    const updated = [...waypointIds];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onSetWaypoints(updated);
  };

  const getPartyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bird': return <Bird size={14} />;
      case 'Feather': return <Feather size={14} />;
      case 'Crown': return <Crown size={14} />;
      case 'Shield': return <Shield size={14} />;
      case 'Coins': return <Coins size={14} />;
      case 'Ship': return <Ship size={14} />;
      case 'Flame': return <Flame size={14} />;
      default: return <Navigation size={14} />;
    }
  };

  const validWaypointsCount = waypointIds.filter(Boolean).length;

  return (
    <>
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          top: 68,
          left: 16,
          width: 340,
          maxHeight: collapsed ? 'auto' : 'calc(100vh - 84px)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.85)',
          border: '1px solid var(--border-gold-glow)',
          transition: 'height 0.2s ease, width 0.2s ease'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '10px 14px',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Navigation size={15} color="var(--text-gold)" />
            <span className="font-serif" style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.8px',
              color: 'var(--text-gold)',
              textTransform: 'uppercase'
            }}>
              Wayfinding & Corridors
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-secondary"
            style={{ padding: '3px 6px', fontSize: 11 }}
            title={collapsed ? 'Expand Route Planner' : 'Collapse Route Planner'}
          >
            {collapsed ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: 14, overflowY: 'auto' }}>
            {/* Origin Input */}
            <AutocompleteInput
              label="Departure Point"
              value={originId}
              placeholder="Select origin city / castle..."
              dotColor="#22c55e"
              onChangeId={onSetOrigin}
            />

            {/* Intermediate Waypoints */}
            {waypointIds.map((wpId, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <AutocompleteInput
                    label={`Stop ${idx + 1}`}
                    value={wpId}
                    placeholder="Select intermediate stop..."
                    dotColor="#0ea5e9"
                    onChangeId={(newId) => handleUpdateWaypoint(idx, newId)}
                  />
                </div>

                {/* Reorder Arrows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="btn-secondary"
                    style={{
                      padding: '2px 4px',
                      opacity: idx === 0 ? 0.3 : 1,
                      cursor: idx === 0 ? 'not-allowed' : 'pointer'
                    }}
                    title="Move stop earlier"
                  >
                    <ChevronUp size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === waypointIds.length - 1}
                    className="btn-secondary"
                    style={{
                      padding: '2px 4px',
                      opacity: idx === waypointIds.length - 1 ? 0.3 : 1,
                      cursor: idx === waypointIds.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                    title="Move stop later"
                  >
                    <ChevronDown size={11} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveWaypoint(idx)}
                  className="btn-secondary"
                  style={{ padding: 7, marginBottom: 10, color: '#ef4444' }}
                  title="Remove stop"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            {/* Add Waypoint & Swap Buttons */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {waypointIds.length < 8 && (
                <button
                  onClick={handleAddWaypoint}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '5px 8px', fontSize: 11 }}
                >
                  <Plus size={12} />
                  <span>Add Waypoint</span>
                </button>
              )}
              <button
                onClick={handleSwap}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '5px 8px', fontSize: 11 }}
                title="Swap Origin & Destination"
              >
                <ArrowRightLeft size={12} />
                <span>Swap Endpoints</span>
              </button>
            </div>

            {/* Optimize Stop Order Action */}
            {validWaypointsCount >= 2 && onOptimizeWaypoints && (
              <div style={{ marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={onOptimizeWaypoints}
                  className={isSuboptimalOrder ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '7px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    gap: 6,
                    background: isSuboptimalOrder ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined,
                    color: isSuboptimalOrder ? '#0f172a' : undefined,
                    borderColor: isSuboptimalOrder ? '#f59e0b' : undefined,
                    boxShadow: isSuboptimalOrder ? '0 0 14px rgba(245, 158, 11, 0.45)' : undefined
                  }}
                  title="Sort intermediate stops into the most efficient geographical order to eliminate backtracking"
                >
                  <Sparkles size={13} />
                  <span>
                    {isSuboptimalOrder && potentialSavingsMiles > 0
                      ? `Optimize Stop Order (Save ${potentialSavingsMiles.toLocaleString()} mi)`
                      : 'Optimize Stop Order'}
                  </span>
                </button>

                {onToggleAutoOptimize && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 10,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    marginTop: 4,
                    paddingLeft: 2
                  }}>
                    <input
                      type="checkbox"
                      checked={autoOptimize}
                      onChange={(e) => onToggleAutoOptimize(e.target.checked)}
                      style={{ cursor: 'pointer', accentColor: 'var(--border-gold)' }}
                    />
                    <span>Auto-sort stops into optimal sequence</span>
                  </label>
                )}
              </div>
            )}

            {/* Destination Input */}
            <AutocompleteInput
              label="Arrival Point"
              value={destinationId}
              placeholder="Select destination port / city..."
              dotColor="#ef4444"
              onChangeId={onSetDestination}
            />

            {/* Optimization Goal Selector */}
            <div style={{ marginTop: 10, marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: 'var(--text-muted)',
                marginBottom: 4
              }}>
                Route Optimization Goal
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[
                  { id: 'balanced' as OptimizationGoal, label: 'Optimal', icon: <Compass size={11} /> },
                  { id: 'shortest' as OptimizationGoal, label: 'Shortest', icon: <Milestone size={11} /> },
                  { id: 'fastest' as OptimizationGoal, label: 'Fastest', icon: <Clock size={11} /> }
                ].map((g) => {
                  const isActive = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => onSelectGoal(g.id)}
                      type="button"
                      className="btn-secondary"
                      style={{
                        padding: '5px 4px',
                        fontSize: 10,
                        justifyContent: 'center',
                        background: isActive ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                        color: isActive ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                        borderColor: isActive ? 'var(--border-gold)' : 'var(--border-subtle)'
                      }}
                    >
                      {g.icon}
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Routing Mode Preference */}
            <div style={{ marginBottom: 12 }}>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: 'var(--text-muted)',
                marginBottom: 4
              }}>
                Routing Corridor Mode
              </label>
              <select
                className="citadel-select"
                value={selectedMode}
                onChange={(e) => onSelectMode(e.target.value as RoutingPreference)}
                style={{ padding: '6px 10px', fontSize: 11 }}
              >
                <option value="balanced">Optimal Multimodal (Roads & Sea Lanes)</option>
                <option value="land_only">Strictly Overland (No Ships)</option>
                <option value="sea_only">Strictly Maritime (Coastal Shipping)</option>
                <option value="crow_flight">Messenger Crow / Raven Flight (Direct)</option>
                <option value="dragon">Direct Dragon Flight (High Altitude)</option>
              </select>
            </div>

            {/* Travel Party Archetypes */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: 'var(--text-muted)'
                }}>
                  Travel Party Archetype
                </label>

                <button
                  type="button"
                  id="party-speed-info-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPartyInfoModal(true);
                  }}
                  className="party-info-button"
                  title="How Fast & Why: View speeds, daily endurance & canon logistics"
                  style={{
                    background: 'rgba(223, 177, 91, 0.12)',
                    border: '1px solid var(--border-gold-glow)',
                    borderRadius: 12,
                    padding: '2px 7px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    color: 'var(--text-gold)',
                    fontSize: 10,
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 177, 91, 0.25)';
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                    e.currentTarget.style.color = 'var(--text-gold-bright)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(223, 177, 91, 0.12)';
                    e.currentTarget.style.borderColor = 'var(--border-gold-glow)';
                    e.currentTarget.style.color = 'var(--text-gold)';
                  }}
                >
                  <Info size={11} />
                  <span>How Fast & Why?</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {Object.values(TRAVEL_PARTIES).map((party) => {
                  const isSelected = party.id === selectedPartyId;
                  return (
                    <div
                      key={party.id}
                      onClick={() => {
                        onSelectParty(party.id);
                      }}
                      className="glass-card"
                      style={{
                        padding: '6px 8px',
                        cursor: 'pointer',
                        borderColor: isSelected ? 'var(--border-gold)' : 'var(--border-subtle)',
                        background: isSelected ? 'rgba(223, 177, 91, 0.18)' : 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: isSelected ? 'var(--text-gold)' : 'var(--text-muted)' }}>
                          {getPartyIcon(party.icon)}
                        </span>
                        <strong style={{
                          fontSize: 10,
                          color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-parchment)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {party.name.split('/')[0].trim()}
                        </strong>
                      </div>
                      <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>
                        {party.tagline.split('per')[0].trim()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plot Route Button */}
            <button
              onClick={onCalculateRoute}
              className="btn-citadel"
              style={{ width: '100%', padding: '10px' }}
            >
              <Navigation size={15} />
              <span>Calculate Route</span>
            </button>
          </div>
        )}
      </div>

      {/* Travel Party Archetypes: How Fast & Why Modal */}
      <PartySpeedInfoModal
        isOpen={showPartyInfoModal}
        onClose={() => setShowPartyInfoModal(false)}
        selectedPartyId={selectedPartyId}
        onSelectParty={onSelectParty}
      />
    </>
  );
};
