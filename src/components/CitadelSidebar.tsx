import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Compass,
  Navigation,
  ArrowRightLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Milestone,
  Clock,
  BookOpen,
  Minimize2,
  Info,
  Check,
  Footprints,
  Ship,
  Flame,
  Shield,
  Crown,
  Bird,
  Feather,
  Coins,
  RotateCcw,
  MapPin,
  X
} from 'lucide-react';
import type { RouteResult, RoutingPreference, OptimizationGoal, MapPickingTarget } from '../types';
import { NODES } from '../data/nodes';
import { calculateRouteAlternatives } from '../engine/pathfinder';
import { PartySpeedInfoModal } from './PartySpeedInfoModal';

export interface CitadelSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  originId: string;
  destinationId: string;
  waypointIds: string[];
  selectedPartyId: string;
  selectedMode: RoutingPreference;
  selectedGoal: OptimizationGoal;
  autoOptimize?: boolean;
  routeResult: RouteResult | null;
  mapPickingTarget?: MapPickingTarget;
  onSetOrigin: (id: string) => void;
  onSetDestination: (id: string) => void;
  onSetWaypoints: (ids: string[]) => void;
  onStartPicking?: (target: MapPickingTarget) => void;
  onCancelPicking?: () => void;
  onOptimizeWaypoints?: () => void;
  onToggleAutoOptimize?: (enabled: boolean) => void;
  onSelectParty: (id: string) => void;
  onSelectMode: (mode: RoutingPreference) => void;
  onSelectGoal: (goal: OptimizationGoal) => void;
  onCalculateRoute: () => void;
  onClearRoute?: () => void;
}

interface AutocompleteInputProps {
  label: string;
  value: string;
  placeholder: string;
  dotColor: string;
  onChangeId: (id: string) => void;
  isPickingActive?: boolean;
  onStartPicking?: () => void;
  onCancelPicking?: () => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  placeholder,
  dotColor,
  onChangeId,
  isPickingActive = false,
  onStartPicking,
  onCancelPicking
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      .slice(0, 50);
  }, [query]);

  const handleActivatePicking = () => {
    if (!isPickingActive && onStartPicking) {
      onStartPicking();
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <label className="citadel-label" style={{ margin: 0 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
          <span>{label}</span>
        </label>
        {isPickingActive && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-gold-bright, #fef08a)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#ffd700',
                boxShadow: '0 0 6px #ffd700',
                display: 'inline-block'
              }}
            />
            <span>Picking on Map...</span>
          </span>
        )}
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          className={`citadel-input ${isPickingActive ? 'citadel-input-picking' : ''}`}
          value={query}
          placeholder={isPickingActive ? 'Click a city on the map or type to search...' : placeholder}
          onFocus={() => {
            setIsOpen(true);
            handleActivatePicking();
          }}
          onClick={() => {
            handleActivatePicking();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              if (isPickingActive && onCancelPicking) {
                onCancelPicking();
              }
            }
          }}
          style={{
            width: '100%',
            fontSize: 13,
            paddingRight: query ? 54 : 32
          }}
        />

        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 2
          }}
        >
          {query && (
            <button
              type="button"
              className="citadel-input-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setQuery('');
                onChangeId('');
                inputRef.current?.focus();
                handleActivatePicking();
              }}
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}

          <button
            type="button"
            className={`citadel-input-action-btn citadel-pin-embedded ${isPickingActive ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isPickingActive) {
                onCancelPicking?.();
              } else {
                onStartPicking?.();
                inputRef.current?.focus();
              }
            }}
            title={isPickingActive ? 'Cancel map picking' : 'Click to select this location directly on the map'}
          >
            <MapPin size={14} className={isPickingActive ? 'citadel-pin-pulse' : ''} />
          </button>
        </div>
      </div>

      {isOpen && filteredNodes.length > 0 && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 2500,
            maxHeight: 240,
            overflowY: 'auto',
            marginTop: 4,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.95)',
            border: '1px solid var(--border-gold)'
          }}
        >
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onChangeId(node.id);
                setQuery(node.name);
                setIsOpen(false);
                onCancelPicking?.();
              }}
              style={{
                padding: '9px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(223, 177, 91, 0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <strong style={{ fontSize: 13, color: 'var(--text-parchment)' }}>
                  {node.name}
                </strong>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {node.allegiance || node.region.replace('_', ' ')}
                </div>
              </div>

              <span className="citadel-badge-pill" style={{ background: 'var(--bg-card)', color: 'var(--text-gold-bright)' }}>
                {node.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Unified Expedition Archetypes for Dropdown
const EXPEDITION_ARCHETYPES = [
  {
    id: 'retinue',
    name: 'Noble Retinue',
    subtitle: 'Royal Progress & Court Carriages',
    pace: '~18 mi / day',
    category: 'Overland',
    icon: <Crown size={15} color="var(--icon-retinue, #fbbf24)" />,
    badgeColor: 'var(--badge-land-val, #f59e0b)'
  },
  {
    id: 'army',
    name: 'Marching Host',
    subtitle: 'Infantry & Baggage Train',
    pace: '~12 mi / day',
    category: 'Overland',
    icon: <Shield size={15} color="var(--icon-army, #ef4444)" />,
    badgeColor: 'var(--icon-army, #ef4444)'
  },
  {
    id: 'messenger',
    name: 'Fast Courier',
    subtitle: 'Raven Rider & Relay Remounts',
    pace: '~58 mi / day',
    category: 'Overland',
    icon: <Feather size={15} color="var(--icon-messenger, #4ade80)" />,
    badgeColor: 'var(--icon-messenger, #4ade80)'
  },
  {
    id: 'caravan',
    name: 'Merchant Caravan',
    subtitle: 'Pack Mules & Trade Wagons',
    pace: '~15 mi / day',
    category: 'Overland',
    icon: <Coins size={15} color="var(--icon-caravan, #fb923c)" />,
    badgeColor: 'var(--icon-caravan, #fb923c)'
  },
  {
    id: 'fleet',
    name: 'War Galley & Fleet',
    subtitle: 'Ironborn / Royal Navy Skiffs',
    pace: '~115 mi / day',
    category: 'Naval',
    icon: <Ship size={15} color="var(--icon-fleet, #22d3ee)" />,
    badgeColor: 'var(--badge-sea-val, #06b6d4)'
  },
  {
    id: 'crow',
    name: 'Messenger Crow / Raven',
    subtitle: 'Direct Rookery Message Flight',
    pace: '~240 mi / day',
    category: 'Aerial',
    icon: <Bird size={15} color="var(--icon-crow, #c084fc)" />,
    badgeColor: 'var(--icon-crow, #c084fc)'
  },
  {
    id: 'dragon',
    name: 'Dragon Flight',
    subtitle: 'Direct High-Altitude Flight',
    pace: '~520 mi / day',
    category: 'Aerial',
    icon: <Flame size={15} color="var(--icon-dragon, #ef4444)" />,
    badgeColor: 'var(--icon-dragon, #ef4444)'
  }
];

export const CitadelSidebar: React.FC<CitadelSidebarProps> = ({
  isOpen,
  onToggle,
  originId,
  destinationId,
  waypointIds,
  selectedPartyId,
  selectedMode,
  selectedGoal,
  autoOptimize = false,
  routeResult,
  mapPickingTarget,
  onSetOrigin,
  onSetDestination,
  onSetWaypoints,
  onStartPicking,
  onCancelPicking,
  onOptimizeWaypoints,
  onToggleAutoOptimize,
  onSelectParty,
  onSelectMode,
  onSelectGoal,
  onCalculateRoute,
  onClearRoute
}) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'ledger'>('planner');
  const [ledgerSubTab, setLedgerSubTab] = useState<'overview' | 'roads' | 'corridors' | 'guide'>('overview');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPartyInfoModal, setShowPartyInfoModal] = useState(false);

  const hasActiveRoute = Boolean(originId || destinationId || waypointIds.length > 0 || routeResult);

  const handleClearRoute = () => {
    if (onClearRoute) {
      onClearRoute();
    } else {
      onSetOrigin('');
      onSetDestination('');
      onSetWaypoints([]);
    }
    setActiveTab('planner');
  };

  const handleSwap = () => {
    const temp = originId;
    onSetOrigin(destinationId);
    onSetDestination(temp);
  };

  const handleAddWaypoint = () => {
    if (waypointIds.length >= 8) return;
    const nextWaypoints = [...waypointIds, ''];
    onSetWaypoints(nextWaypoints);
    if (onStartPicking) {
      onStartPicking({ type: 'waypoint', index: nextWaypoints.length - 1 });
    }
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

  const validWaypointsCount = waypointIds.filter(Boolean).length;

  const [isArchetypeDropdownOpen, setIsArchetypeDropdownOpen] = useState(false);
  const archetypeDropdownRef = useRef<HTMLDivElement>(null);

  // Close archetype dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (archetypeDropdownRef.current && !archetypeDropdownRef.current.contains(e.target as Node)) {
        setIsArchetypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close archetype dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isArchetypeDropdownOpen) {
        setIsArchetypeDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isArchetypeDropdownOpen]);

  // Current archetype resolution
  const currentArchetypeId = useMemo(() => {
    if (selectedPartyId === 'war_galley') return 'fleet';
    if (selectedPartyId === 'courier') return 'messenger';
    if (EXPEDITION_ARCHETYPES.some((a) => a.id === selectedPartyId)) {
      return selectedPartyId;
    }
    if (selectedMode === 'dragon') return 'dragon';
    if (selectedMode === 'crow_flight') return 'crow';
    return 'retinue';
  }, [selectedPartyId, selectedMode]);

  const currentArchetype = useMemo(() => {
    return EXPEDITION_ARCHETYPES.find((a) => a.id === currentArchetypeId) || EXPEDITION_ARCHETYPES[0];
  }, [currentArchetypeId]);

  // Helper to map archetype selection to party & corridor mode
  const handleSelectArchetype = (archetypeId: string) => {
    onSelectParty(archetypeId);
    if (archetypeId === 'dragon') {
      onSelectMode('dragon');
    } else if (archetypeId === 'crow') {
      onSelectMode('crow_flight');
    } else if (selectedMode === 'dragon' || selectedMode === 'crow_flight') {
      onSelectMode('balanced');
    }
    setIsArchetypeDropdownOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="glass-panel"
        style={{
          position: 'absolute',
          top: 70,
          left: 16,
          zIndex: 2000,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          color: 'var(--text-gold)',
          fontWeight: 700,
          fontSize: 13,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.9)'
        }}
        title="Open Citadel Wayfinding Ledger"
      >
        <Navigation size={16} color="var(--text-gold)" />
        <span className="font-serif">Open Ledger</span>
        {routeResult && (
          <span className="citadel-badge-pill" style={{ background: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8' }}>
            {routeResult.totalDays}d
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      <aside
        className="glass-panel"
        style={{
          position: 'absolute',
          top: 100,
          left: 16,
          width: 390,
          maxWidth: 'calc(100vw - 32px)',
          height: 'calc(90vh - 84px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.9)',
          border: '1px solid var(--border-gold-glow)',
          overflow: 'hidden'
        }}
      >
        {/* Sidebar Header & Tab Switcher */}
        <div
          style={{
            padding: '10px 12px 8px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #dfb15b 0%, #78350f 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(223, 177, 91, 0.6)'
                }}
              >
                <Compass size={14} color="#0a0e14" strokeWidth={2.5} />
              </div>
              <span
                className="font-serif"
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '1px',
                  color: 'var(--text-gold)',
                  textTransform: 'uppercase'
                }}
              >
                Citadel Ledger
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {hasActiveRoute && (
                <button
                  type="button"
                  onClick={handleClearRoute}
                  className="btn-secondary"
                  style={{
                    padding: '4px 8px',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: '#f87171',
                    borderColor: 'rgba(239, 68, 68, 0.35)',
                    background: 'rgba(239, 68, 68, 0.08)'
                  }}
                  title="Clear Current Route"
                >
                  <RotateCcw size={12} />
                  <span>Clear</span>
                </button>
              )}

              <button
                onClick={onToggle}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: 12 }}
                title="Minimize Ledger"
              >
                <Minimize2 size={13} />
              </button>
            </div>
          </div>

          {/* Primary View Tabs */}
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 3, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('planner')}
              style={{
                flex: 1,
                padding: '7px 10px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: activeTab === 'planner' ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                color: activeTab === 'planner' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              <Navigation size={13} />
              <span>Plan Journey</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              style={{
                flex: 1,
                padding: '7px 10px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: activeTab === 'ledger' ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                color: activeTab === 'ledger' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              <Compass size={13} />
              <span>Itinerary</span>
              {routeResult && (
                <span style={{ fontSize: 10, padding: '1px 5px', background: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', borderRadius: 3, fontWeight: 800 }}>
                  {routeResult.totalDays}d
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px' }}>
          {/* =========================================================
              TAB 1: PLAN JOURNEY
             ========================================================= */}
          {activeTab === 'planner' && (
            <div>
              {/* Departure Point */}
              <AutocompleteInput
                label="Departure Point"
                value={originId}
                placeholder="Choose origin city / castle..."
                dotColor="#22c55e"
                onChangeId={onSetOrigin}
                isPickingActive={mapPickingTarget?.type === 'origin'}
                onStartPicking={onStartPicking ? () => onStartPicking({ type: 'origin' }) : undefined}
                onCancelPicking={onCancelPicking}
              />

              {/* Intermediate Stops */}
              {waypointIds.map((wpId, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <AutocompleteInput
                      label={`Intermediate Stop ${idx + 1}`}
                      value={wpId}
                      placeholder="Select stop or click city on map..."
                      dotColor="#0ea5e9"
                      onChangeId={(newId) => handleUpdateWaypoint(idx, newId)}
                      isPickingActive={mapPickingTarget?.type === 'waypoint' && mapPickingTarget.index === idx}
                      onStartPicking={onStartPicking ? () => onStartPicking({ type: 'waypoint', index: idx }) : undefined}
                      onCancelPicking={onCancelPicking}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
                    <button
                      type="button"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="btn-secondary"
                      style={{ padding: '3px 5px', opacity: idx === 0 ? 0.3 : 1 }}
                      title="Move stop earlier"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === waypointIds.length - 1}
                      className="btn-secondary"
                      style={{ padding: '3px 5px', opacity: idx === waypointIds.length - 1 ? 0.3 : 1 }}
                      title="Move stop later"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveWaypoint(idx)}
                    className="btn-secondary"
                    style={{ padding: 8, marginBottom: 12, color: '#ef4444' }}
                    title="Remove this stop"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Add Stop & Swap Endpoints Buttons */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {waypointIds.length < 8 && (
                  <button
                    onClick={handleAddWaypoint}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '7px 10px', fontSize: 12, fontWeight: 600 }}
                  >
                    <Plus size={14} />
                    <span>Add Stop</span>
                  </button>
                )}
                <button
                  onClick={handleSwap}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '7px 10px', fontSize: 12, fontWeight: 600 }}
                  title="Swap Departure and Arrival"
                >
                  <ArrowRightLeft size={14} />
                  <span>Swap Endpoints</span>
                </button>
              </div>

              {/* 1-Click Optimize Stop Order Action */}
              {validWaypointsCount >= 2 && onOptimizeWaypoints && (
                <div style={{ marginBottom: 14 }}>
                  <button
                    type="button"
                    onClick={onOptimizeWaypoints}
                    className={routeResult?.isSuboptimalOrder ? 'btn-primary' : 'btn-secondary'}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      gap: 6,
                      background: routeResult?.isSuboptimalOrder ? 'linear-gradient(135deg, #f59e0b, #d97706)' : undefined,
                      color: routeResult?.isSuboptimalOrder ? '#0f172a' : undefined,
                      borderColor: routeResult?.isSuboptimalOrder ? '#f59e0b' : undefined,
                      boxShadow: routeResult?.isSuboptimalOrder ? '0 0 16px rgba(245, 158, 11, 0.45)' : undefined
                    }}
                    title="Sort intermediate stops into the most efficient geographical order"
                  >
                    <Sparkles size={14} />
                    <span>
                      {routeResult?.isSuboptimalOrder && routeResult.potentialSavingsMiles
                        ? `⚡ Optimize Stops (Save ${routeResult.potentialSavingsMiles.toLocaleString()} mi)`
                        : '⚡ Optimize Stop Order'}
                    </span>
                  </button>

                  {onToggleAutoOptimize && (
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      marginTop: 6,
                      paddingLeft: 2
                    }}>
                      <input
                        type="checkbox"
                        checked={autoOptimize}
                        onChange={(e) => onToggleAutoOptimize(e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: 'var(--border-gold)' }}
                      />
                      <span>Auto-sort intermediate stops into optimal sequence</span>
                    </label>
                  )}
                </div>
              )}

              {/* Arrival Point */}
              <AutocompleteInput
                label="Arrival Point"
                value={destinationId}
                placeholder="Choose destination port / castle..."
                dotColor="#ef4444"
                onChangeId={onSetDestination}
                isPickingActive={mapPickingTarget?.type === 'destination'}
                onStartPicking={onStartPicking ? () => onStartPicking({ type: 'destination' }) : undefined}
                onCancelPicking={onCancelPicking}
              />

              {/* Expedition Archetype Selection */}
              <div style={{ marginTop: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <label className="citadel-label" style={{ margin: 0 }}>
                    <span>Expedition Archetype</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPartyInfoModal(true)}
                    style={{
                      background: 'rgba(223, 177, 91, 0.12)',
                      border: '1px solid var(--border-gold-glow)',
                      borderRadius: 12,
                      padding: '3px 3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      color: 'var(--text-gold)',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                    title="How Fast & Why: Canon logistics and travel endurance"
                  >
                    <Info size={12} />
                    {/* <span>How Fast & Why?</span> */}
                  </button>

                </div>

                {/* Expedition Archetype Dropdown List */}
                <div ref={archetypeDropdownRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsArchetypeDropdownOpen(!isArchetypeDropdownOpen)}
                    className="citadel-select"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={isArchetypeDropdownOpen}
                    aria-label="Expedition Archetype selector"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      gap: 8,
                      width: '100%',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderColor: isArchetypeDropdownOpen ? 'var(--border-gold)' : 'var(--border-subtle)',
                      boxShadow: isArchetypeDropdownOpen ? '0 0 10px rgba(223, 177, 91, 0.25)' : undefined,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                        {currentArchetype.icon}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--text-gold-bright)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {currentArchetype.name}
                        </span>
                        <span style={{
                          fontSize: 10,
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {currentArchetype.subtitle}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: currentArchetype.badgeColor,
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        border: '1px solid rgba(223, 177, 91, 0.2)'
                      }}>
                        {currentArchetype.pace}
                      </span>
                      <ChevronDown
                        size={14}
                        style={{
                          color: 'var(--text-gold)',
                          transform: isArchetypeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isArchetypeDropdownOpen && (
                    <div
                      className="glass-panel"
                      role="listbox"
                      aria-label="Expedition Archetypes"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        maxHeight: 280,
                        overflowY: 'auto',
                        zIndex: 1100,
                        borderRadius: 8,
                        border: '1px solid var(--border-gold-glow)',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
                        padding: 4,
                        background: 'var(--bg-card)'
                      }}
                    >
                      {['Overland', 'Naval', 'Aerial'].map((cat) => {
                        const items = EXPEDITION_ARCHETYPES.filter((a) => a.category === cat);
                        return (
                          <div key={cat} style={{ marginBottom: 4 }}>
                            <div style={{
                              fontSize: 9,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: 'var(--text-gold)',
                              padding: '4px 8px 2px 8px',
                              fontWeight: 700,
                              opacity: 0.8
                            }}>
                              {cat === 'Overland' ? 'Overland Columns' : cat === 'Naval' ? 'Maritime Fleet' : 'Aerial Flight'}
                            </div>
                            {items.map((arch) => {
                              const isSelected = arch.id === currentArchetypeId;
                              return (
                                <div
                                  key={arch.id}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => handleSelectArchetype(arch.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 8px',
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    background: isSelected ? 'rgba(223, 177, 91, 0.18)' : 'transparent',
                                    border: isSelected ? '1px solid var(--border-gold-glow)' : '1px solid transparent',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                                      {arch.icon}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                      <span style={{
                                        fontSize: 12,
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? 'var(--text-gold-bright)' : 'var(--text-parchment)'
                                      }}>
                                        {arch.name}
                                      </span>
                                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                        {arch.subtitle}
                                      </span>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                    <span style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: arch.badgeColor,
                                      background: 'rgba(0, 0, 0, 0.25)',
                                      padding: '1px 5px',
                                      borderRadius: 4
                                    }}>
                                      {arch.pace}
                                    </span>
                                    {isSelected && <Check size={13} color="var(--border-gold)" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Advanced Routing Options */}
              <div style={{ marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: 'var(--text-gold)',
                    fontSize: 12,
                    fontWeight: 700
                  }}
                >
                  <span>Advanced Routing & Corridor Rules</span>
                  {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {showAdvanced && (
                  <div
                    className="glass-card"
                    style={{
                      padding: 12,
                      marginTop: 6,
                      background: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}
                  >
                    <div>
                      <label className="citadel-label">Optimization Goal</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                        {[
                          { id: 'balanced' as OptimizationGoal, label: 'Optimal' },
                          { id: 'shortest' as OptimizationGoal, label: 'Shortest' },
                          { id: 'fastest' as OptimizationGoal, label: 'Fastest' }
                        ].map((g) => {
                          const isActive = selectedGoal === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => onSelectGoal(g.id)}
                              className="btn-secondary"
                              style={{
                                padding: '6px 4px',
                                fontSize: 11,
                                justifyContent: 'center',
                                background: isActive ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                                color: isActive ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                                borderColor: isActive ? 'var(--border-gold)' : 'var(--border-subtle)'
                              }}
                            >
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="citadel-label">Corridor Constraint</label>
                      <select
                        className="citadel-select"
                        value={selectedMode}
                        onChange={(e) => onSelectMode(e.target.value as RoutingPreference)}
                        style={{ fontSize: 12, padding: '6px 8px' }}
                      >
                        <option value="balanced">Optimal Multimodal (Roads & Sea)</option>
                        <option value="land_only">Strictly Overland (No Ships)</option>
                        <option value="sea_only">Strictly Maritime (Coastal Lanes)</option>
                        <option value="crow_flight">Messenger Crow / Raven (Direct)</option>
                        <option value="dragon">Direct Dragon Flight (High Altitude)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Prominent Action Buttons: Calculate Journey & Clear Route */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                <button
                  disabled={!originId || !destinationId}
                  onClick={() => {
                    onCalculateRoute();
                    setActiveTab('ledger');
                  }}
                  className="btn-citadel"
                  style={{ flex: 1, padding: '12px', fontSize: 14 }}
                >
                  <Navigation size={16} />
                  <span>Calculate Journey</span>
                </button>

                {hasActiveRoute && (
                  <button
                    type="button"
                    onClick={handleClearRoute}
                    className="btn-secondary"
                    style={{
                      padding: '12px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#f87171',
                      borderColor: 'rgba(239, 68, 68, 0.4)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                    title="Clear current route and stops"
                  >
                    <RotateCcw size={15} />
                    <span>Clear Route</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 2: ITINERARY & LEDGER
             ========================================================= */}
          {activeTab === 'ledger' && (
            <div>
              {!routeResult ? (
                <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                  <Compass size={36} color="var(--text-gold)" style={{ margin: '0 auto 12px', opacity: 0.7 }} />
                  <h4 className="font-serif" style={{ fontSize: 15, color: 'var(--text-gold)', marginBottom: 8 }}>
                    No Journey Calculated
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                    Select departure and arrival settlements in the "Plan Journey" tab to chart your route across the Known World.
                  </p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="btn-secondary"
                    style={{ margin: '0 auto', fontSize: 12 }}
                  >
                    Go to Plan Journey
                  </button>
                </div>
              ) : (
                <div>
                  {/* Origin -> Destination Banner */}
                  <div className="glass-card" style={{ padding: '10px 12px', marginBottom: 12, borderLeft: '3px solid var(--border-gold)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                        <strong className="font-serif" style={{ fontSize: 14, color: 'var(--text-gold)' }}>
                          {routeResult.origin.name}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                        <strong className="font-serif" style={{ fontSize: 14, color: 'var(--text-gold)' }}>
                          {routeResult.destination.name}
                        </strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="citadel-badge-pill" style={{ background: 'rgba(223, 177, 91, 0.2)', color: 'var(--text-gold-bright)' }}>
                          {routeResult.optimizationGoal === 'shortest' ? 'Shortest' : routeResult.optimizationGoal === 'fastest' ? 'Fastest' : 'Optimal'}
                        </span>
                        <button
                          type="button"
                          onClick={handleClearRoute}
                          className="btn-secondary"
                          style={{
                            padding: '2px 7px',
                            fontSize: 11,
                            color: '#f87171',
                            borderColor: 'rgba(239, 68, 68, 0.35)',
                            background: 'rgba(239, 68, 68, 0.08)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title="Clear journey"
                        >
                          <RotateCcw size={12} />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Party: <b style={{ color: 'var(--text-gold-bright)' }}>{routeResult.party.name}</b></span>
                      <span>Mode: <b style={{ color: '#38bdf8' }}>{routeResult.mode.replace('_', ' ')}</b></span>
                    </div>
                  </div>

                  {/* Backtracking Warning Card */}
                  {routeResult.isSuboptimalOrder && onOptimizeWaypoints && (
                    <div
                      className="glass-card"
                      style={{
                        padding: '10px 12px',
                        marginBottom: 12,
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid #f59e0b',
                        borderRadius: 6
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <AlertTriangle size={15} color="#f59e0b" />
                        <strong style={{ fontSize: 12, color: '#f59e0b' }}>
                          Backtracking Detected in Stops
                        </strong>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-parchment)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        Reordering stops along the corridor will save{' '}
                        <b>{routeResult.potentialSavingsMiles?.toLocaleString()} miles</b> (~{routeResult.potentialSavingsDays} days).
                      </p>
                      <button
                        type="button"
                        onClick={onOptimizeWaypoints}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          gap: 6,
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#0f172a',
                          boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
                        }}
                      >
                        <Sparkles size={13} />
                        <span>⚡ Reorder Stops for Optimal Route</span>
                      </button>
                    </div>
                  )}

                  {/* Dual Readout Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div className="glass-card" style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>
                        <Milestone size={13} color="var(--text-gold)" />
                        <span>Distance</span>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-gold-bright)' }}>
                          {routeResult.totalMiles.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-parchment)' }}>miles</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          ~{routeResult.totalLeagues.toLocaleString()} leagues • {routeResult.totalKm.toLocaleString()} km
                        </div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 700 }}>
                        <Clock size={13} color="var(--text-gold)" />
                        <span>Travel Duration</span>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#38bdf8' }}>
                          {routeResult.totalDays} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-parchment)' }}>days</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          ~{(routeResult.totalDays / 7).toFixed(1)} weeks • {(routeResult.totalDays / 28).toFixed(1)} moons
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Land vs Sea Distribution Bar */}
                  {routeResult.totalMiles > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span style={{ color: '#f59e0b' }}>Land: {routeResult.landMiles.toLocaleString()} mi ({Math.round((routeResult.landMiles / routeResult.totalMiles) * 100)}%)</span>
                        <span style={{ color: '#06b6d4' }}>Sea: {routeResult.seaMiles.toLocaleString()} mi ({Math.round((routeResult.seaMiles / routeResult.totalMiles) * 100)}%)</span>
                      </div>
                      <div style={{ height: 7, width: '100%', background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${Math.round((routeResult.landMiles / routeResult.totalMiles) * 100)}%`, background: '#f59e0b' }} />
                        <div style={{ width: `${Math.round((routeResult.seaMiles / routeResult.totalMiles) * 100)}%`, background: '#06b6d4' }} />
                      </div>
                    </div>
                  )}

                  {/* Sub-tabs for Ledger Details */}
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                    <button
                      onClick={() => setLedgerSubTab('overview')}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: ledgerSubTab === 'overview' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: ledgerSubTab === 'overview' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Stages ({routeResult.journeyStages?.length || 1})
                    </button>
                    <button
                      onClick={() => setLedgerSubTab('roads')}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: ledgerSubTab === 'roads' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: ledgerSubTab === 'roads' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      All Roads ({routeResult.legs.length})
                    </button>
                    <button
                      onClick={() => setLedgerSubTab('corridors')}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: ledgerSubTab === 'corridors' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: ledgerSubTab === 'corridors' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Corridors
                    </button>
                    <button
                      onClick={() => setLedgerSubTab('guide')}
                      style={{
                        flex: 1,
                        padding: '7px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: ledgerSubTab === 'guide' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: ledgerSubTab === 'guide' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      Guide
                    </button>
                  </div>

                  {/* Sub-tab 1: Stages */}
                  {ledgerSubTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(routeResult.journeyStages && routeResult.journeyStages.length > 0 ? routeResult.journeyStages : [{
                        stageIndex: 1,
                        fromNode: routeResult.origin,
                        toNode: routeResult.destination,
                        legs: routeResult.legs,
                        distanceMiles: routeResult.totalMiles,
                        distanceKm: routeResult.totalKm,
                        distanceLeagues: routeResult.totalLeagues,
                        totalDays: routeResult.totalDays
                      }]).map((stage, sIdx) => {
                        const isFirst = sIdx === 0;
                        const isLast = sIdx === (routeResult.journeyStages?.length || 1) - 1;

                        return (
                          <div
                            key={sIdx}
                            className="glass-card"
                            style={{
                              padding: '10px 12px',
                              borderLeft: `4px solid ${isFirst ? '#22c55e' : isLast ? '#ef4444' : '#0ea5e9'}`
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: '#fff',
                                  background: isFirst ? '#15803d' : isLast ? '#b91c1c' : '#0369a1',
                                  padding: '2px 7px',
                                  borderRadius: 4
                                }}>
                                  Stage {sIdx + 1}
                                </span>
                                <strong style={{ fontSize: 13, color: 'var(--text-gold)' }}>
                                  {stage.fromNode.name} &rarr; {stage.toNode.name}
                                </strong>
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>
                                ~{stage.totalDays}d
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                              <span>{stage.distanceMiles.toLocaleString()} miles ({stage.distanceKm.toLocaleString()} km)</span>
                              <span>{stage.legs.length} {stage.legs.length === 1 ? 'road' : 'roads'}</span>
                            </div>

                            <div style={{ background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {stage.legs.map((leg, lIdx) => (
                                <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-parchment)' }}>
                                  <span>• {leg.edge.name}</span>
                                  <span style={{ color: 'var(--text-gold)' }}>{leg.distanceMiles} mi</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-tab 2: All Roads (Turn-by-turn) */}
                  {ledgerSubTab === 'roads' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {routeResult.legs.map((leg, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                            <strong style={{ fontSize: 13, color: 'var(--text-parchment)' }}>
                              {idx + 1}. {leg.edge.name}
                            </strong>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                              ~{leg.transitDays}d
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                            <span>{leg.fromNode.name} &rarr; {leg.toNode.name}</span>
                            <span style={{ color: 'var(--text-gold)' }}>{leg.distanceMiles} mi</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-tab 3: Corridors Comparison */}
                  {ledgerSubTab === 'corridors' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(() => {
                        const alts = calculateRouteAlternatives(originId, destinationId, selectedPartyId);
                        const cards = [
                          {
                            id: 'balanced',
                            mode: 'balanced' as RoutingPreference,
                            title: 'Optimal Multimodal',
                            icon: <Compass size={15} color="var(--text-gold)" />,
                            route: alts.balanced,
                            desc: 'Balanced combination of royal highways and coastal sea passages.'
                          },
                          {
                            id: 'land_only',
                            mode: 'land_only' as RoutingPreference,
                            title: 'Strictly Overland',
                            icon: <Footprints size={15} color="#f59e0b" />,
                            route: alts.overland,
                            desc: 'Royal roads and mountain defiles without boarding ships.'
                          },
                          {
                            id: 'sea_only',
                            mode: 'sea_only' as RoutingPreference,
                            title: 'Strictly Maritime',
                            icon: <Ship size={15} color="#06b6d4" />,
                            route: alts.maritime,
                            desc: 'Coastal and open-water shipping channels connecting ports.'
                          },
                          {
                            id: 'dragon',
                            mode: 'dragon' as RoutingPreference,
                            title: 'Dragon Flight',
                            icon: <Flame size={15} color="#ef4444" />,
                            route: alts.dragon,
                            desc: 'Direct high-speed aerial flight over mountains and seas.'
                          }
                        ];

                        return cards.map((c) => {
                          const isCurrent = selectedMode === c.mode;
                          const isViable = c.route && c.route.routeFound;

                          return (
                            <div
                              key={c.id}
                              className="glass-card"
                              style={{
                                padding: '10px 12px',
                                borderColor: isCurrent ? 'var(--border-gold)' : 'var(--border-subtle)',
                                background: isCurrent ? 'rgba(223, 177, 91, 0.15)' : 'var(--bg-card)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {c.icon}
                                  <strong style={{ fontSize: 13, color: 'var(--text-parchment)' }}>{c.title}</strong>
                                </div>
                                {isCurrent && (
                                  <span style={{ fontSize: 11, color: 'var(--text-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Check size={13} /> ACTIVE
                                  </span>
                                )}
                              </div>

                              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.3 }}>
                                {c.desc}
                              </p>

                              {isViable && c.route ? (
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                                    <span style={{ color: 'var(--text-gold-bright)' }}>{c.route.totalMiles.toLocaleString()} miles</span>
                                    <span style={{ color: '#38bdf8' }}>~{c.route.totalDays} days</span>
                                  </div>

                                  {!isCurrent && (
                                    <button
                                      onClick={() => onSelectMode(c.mode)}
                                      className="btn-secondary"
                                      style={{ width: '100%', marginTop: 8, justifyContent: 'center', fontSize: 12 }}
                                    >
                                      Switch to this Corridor
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                                  No viable corridor found.
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {/* Sub-tab 4: Cartography Guide */}
                  {ledgerSubTab === 'guide' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="glass-card" style={{ padding: '10px 12px' }}>
                        <strong style={{ fontSize: 13, color: 'var(--text-gold-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Milestone size={14} /> Citadel Scale Calibration
                        </strong>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0', lineHeight: 1.4 }}>
                          Calibrated directly to the canonical printed 600-mile map bar:
                        </p>
                        <div style={{ fontSize: 12, color: 'var(--text-parchment)', background: 'var(--bg-secondary)', padding: 8, borderRadius: 4, lineHeight: 1.5 }}>
                          • 1 pixel = <b>0.875 miles</b> (0.292 leagues • 1.408 km)<br />
                          • The Wall (Shadow Tower to Eastwatch): <b>305 miles</b><br />
                          • Kingsroad (King's Landing to Winterfell): <b>~1,565 miles</b>
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '10px 12px' }}>
                        <strong style={{ fontSize: 13, color: 'var(--text-gold-bright)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <BookOpen size={14} /> Settlement Hierarchy
                        </strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                          <div>★ <b>Regional Capital</b> (King's Landing, Winterfell, Oldtown)</div>
                          <div>⚓ <b>Seaport / Anchorage</b> (White Harbor, Gulltown, Lannisport)</div>
                          <div>🏰 <b>Castle / Stronghold</b> (The Twins, Harrenhal, Riverrun)</div>
                          <div>⚔️ <b>Strategic Pass</b> (Moat Cailin, Bloody Gate, Golden Tooth)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Speed Modal */}
      <PartySpeedInfoModal
        isOpen={showPartyInfoModal}
        onClose={() => setShowPartyInfoModal(false)}
        selectedPartyId={selectedPartyId}
        onSelectParty={onSelectParty}
      />
    </>
  );
};

export default CitadelSidebar;
