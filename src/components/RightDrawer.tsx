import React, { useState, useEffect } from 'react';
import {
  Compass,
  AlertTriangle,
  Clock,
  Milestone,
  BookOpen,
  Split,
  X,
  Flame,
  Ship,
  Footprints,
  Bird,
  Check,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import type { RouteResult, RoutingPreference, OptimizationGoal } from '../types';
import { TERRAIN_MODIFIERS } from '../engine/parties';
import { calculateRouteAlternatives } from '../engine/pathfinder';

export type RightDrawerTab = 'itinerary' | 'corridors' | 'guide';

interface RightDrawerProps {
  isOpen: boolean;
  activeTab: RightDrawerTab;
  onTabChange: (tab: RightDrawerTab) => void;
  onClose: () => void;
  routeResult: RouteResult | null;
  originId: string;
  destinationId: string;
  selectedPartyId: string;
  currentMode: RoutingPreference;
  currentGoal: OptimizationGoal;
  onApplyMode: (mode: RoutingPreference) => void;
  onApplyGoal: (goal: OptimizationGoal) => void;
  onOptimizeWaypoints?: () => void;
}

export const RightDrawer: React.FC<RightDrawerProps> = ({
  isOpen,
  activeTab,
  onTabChange,
  onClose,
  routeResult,
  originId,
  destinationId,
  selectedPartyId,
  currentMode,
  currentGoal,
  onApplyMode,
  onApplyGoal,
  onOptimizeWaypoints
}) => {
  const [itinerarySubTab, setItinerarySubTab] = useState<'stages' | 'turnByTurn' | 'terrain' | 'hazards'>('turnByTurn');
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-switch to itinerary tab when new route is computed
  useEffect(() => {
    if (routeResult) {
      setIsMinimized(false);
      if (routeResult.journeyStages && routeResult.journeyStages.length > 1) {
        setItinerarySubTab('stages');
      } else {
        setItinerarySubTab('turnByTurn');
      }
    }
  }, [routeResult]);

  if (!isOpen) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 68,
        right: 16,
        width: 420,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: isMinimized ? 'auto' : 'calc(100vh - 84px)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.9)',
        border: '1px solid var(--border-gold-glow)',
        transition: 'height 0.2s ease, transform 0.2s ease'
      }}
    >
      {/* Top Drawer Tab Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          padding: '4px 6px'
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => { onTabChange('itinerary'); setIsMinimized(false); }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              borderRadius: 6,
              background: activeTab === 'itinerary' ? 'rgba(223, 177, 91, 0.2)' : 'transparent',
              color: activeTab === 'itinerary' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
              border: activeTab === 'itinerary' ? '1px solid var(--border-gold)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Compass size={13} />
            <span>Itinerary</span>
            {routeResult && (
              <span style={{ fontSize: 9, padding: '1px 4px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', borderRadius: 3 }}>
                {routeResult.totalDays}d
              </span>
            )}
          </button>

          <button
            onClick={() => { onTabChange('corridors'); setIsMinimized(false); }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              borderRadius: 6,
              background: activeTab === 'corridors' ? 'rgba(223, 177, 91, 0.2)' : 'transparent',
              color: activeTab === 'corridors' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
              border: activeTab === 'corridors' ? '1px solid var(--border-gold)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Split size={13} />
            <span>Corridors</span>
          </button>

          <button
            onClick={() => { onTabChange('guide'); setIsMinimized(false); }}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              borderRadius: 6,
              background: activeTab === 'guide' ? 'rgba(223, 177, 91, 0.2)' : 'transparent',
              color: activeTab === 'guide' ? 'var(--text-gold-bright)' : 'var(--text-muted)',
              border: activeTab === 'guide' ? '1px solid var(--border-gold)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <BookOpen size={13} />
            <span>Guide</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn-secondary"
            style={{ padding: '4px 6px', fontSize: 11 }}
            title={isMinimized ? 'Expand Drawer' : 'Minimize Drawer'}
          >
            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '4px 6px', fontSize: 11 }}
            title="Close Drawer"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px' }}>
          {/* ================= TAB 1: ITINERARY & METRICS ================= */}
          {activeTab === 'itinerary' && (
            <div>
              {!routeResult ? (
                <div style={{ textAlign: 'center', padding: '30px 16px' }}>
                  <Compass size={32} color="var(--text-gold)" style={{ margin: '0 auto 10px', opacity: 0.7 }} />
                  <h4 className="font-serif" style={{ fontSize: 14, color: 'var(--text-gold)', marginBottom: 6 }}>
                    Citadel Wayfinding Ready
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Select departure and arrival destinations on the left, or click on any map settlement marker to calculate your route.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Origin -> Destination Header Banner */}
                  <div className="glass-card" style={{ padding: '10px 12px', marginBottom: 12, borderLeft: '3px solid var(--border-gold)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                        <strong className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)' }}>
                          {routeResult.origin.name}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                        <strong className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)' }}>
                          {routeResult.destination.name}
                        </strong>
                      </div>
                      <span style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        background: 'rgba(223, 177, 91, 0.15)',
                        color: 'var(--text-gold-bright)',
                        borderRadius: 4,
                        fontWeight: 600
                      }}>
                        {routeResult.optimizationGoal === 'shortest' ? 'Shortest Distance' : routeResult.optimizationGoal === 'fastest' ? 'Fastest Transit' : 'Optimal Balanced'}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Party: <b style={{ color: 'var(--text-gold-bright)' }}>{routeResult.party.name}</b></span>
                      <span>Mode: <b style={{ color: '#38bdf8' }}>{routeResult.mode.replace('_', ' ')}</b></span>
                    </div>
                  </div>

                  {/* Backtracking Warning Card with 1-Click Optimize */}
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
                      <p style={{ fontSize: 11, color: 'var(--text-parchment)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                        The current stop sequence zig-zags back and forth. Reordering stops along the corridor will save{' '}
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
                          fontSize: 11,
                          fontWeight: 700,
                          gap: 6,
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#0f172a',
                          boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
                        }}
                      >
                        <Sparkles size={12} />
                        <span>⚡ Reorder Stops for Optimal Route</span>
                      </button>
                    </div>
                  )}

                  {/* Dual Readout Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div className="glass-card" style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
                        <Milestone size={12} color="var(--text-gold)" />
                        <span>Distance</span>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-gold-bright)' }}>
                          {routeResult.totalMiles.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-parchment)' }}>miles</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                          ~{routeResult.totalLeagues.toLocaleString()} leagues • {routeResult.totalKm.toLocaleString()} km
                        </div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
                        <Clock size={12} color="var(--text-gold)" />
                        <span>Travel Duration</span>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#38bdf8' }}>
                          {routeResult.totalDays} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-parchment)' }}>days</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                          ~{(routeResult.totalDays / 7).toFixed(1)} weeks • {(routeResult.totalDays / 28).toFixed(1)} moons
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Land vs Sea Distribution Bar */}
                  {routeResult.totalMiles > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span style={{ color: '#f59e0b' }}>Land: {routeResult.landMiles.toLocaleString()} mi ({Math.round((routeResult.landMiles / routeResult.totalMiles) * 100)}%)</span>
                        <span style={{ color: '#06b6d4' }}>Sea: {routeResult.seaMiles.toLocaleString()} mi ({Math.round((routeResult.seaMiles / routeResult.totalMiles) * 100)}%)</span>
                      </div>
                      <div style={{ height: 6, width: '100%', background: '#1e293b', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${Math.round((routeResult.landMiles / routeResult.totalMiles) * 100)}%`, background: '#f59e0b' }} />
                        <div style={{ width: `${Math.round((routeResult.seaMiles / routeResult.totalMiles) * 100)}%`, background: '#06b6d4' }} />
                      </div>
                    </div>
                  )}

                  {/* Sub-tabs for Detailed Breakdown */}
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
                    {routeResult.journeyStages && routeResult.journeyStages.length > 1 && (
                      <button
                        onClick={() => setItinerarySubTab('stages')}
                        style={{
                          flex: 1,
                          padding: '6px 0',
                          fontSize: 11,
                          background: 'transparent',
                          border: 'none',
                          borderBottom: itinerarySubTab === 'stages' ? '2px solid var(--border-gold)' : '2px solid transparent',
                          color: itinerarySubTab === 'stages' ? 'var(--text-gold)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Stops ({routeResult.journeyStages.length})
                      </button>
                    )}
                    <button
                      onClick={() => setItinerarySubTab('turnByTurn')}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 11,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: itinerarySubTab === 'turnByTurn' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: itinerarySubTab === 'turnByTurn' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      All Roads ({routeResult.legs.length})
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('terrain')}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 11,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: itinerarySubTab === 'terrain' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: itinerarySubTab === 'terrain' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Terrain
                    </button>
                    <button
                      onClick={() => setItinerarySubTab('hazards')}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 11,
                        background: 'transparent',
                        border: 'none',
                        borderBottom: itinerarySubTab === 'hazards' ? '2px solid var(--border-gold)' : '2px solid transparent',
                        color: itinerarySubTab === 'hazards' ? 'var(--text-gold)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Hazards ({routeResult.hazards.length})
                    </button>
                  </div>

                  {/* Sub-tab Content: Stages (When waypoints exist) */}
                  {itinerarySubTab === 'stages' && routeResult.journeyStages && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {routeResult.journeyStages.map((stage, sIdx) => {
                        const isFirst = sIdx === 0;
                        const isLast = sIdx === routeResult.journeyStages!.length - 1;

                        return (
                          <div
                            key={sIdx}
                            className="glass-card"
                            style={{
                              padding: '10px 12px',
                              borderLeft: `4px solid ${isFirst ? '#22c55e' : isLast ? '#ef4444' : '#0ea5e9'}`
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: '#fff',
                                  background: isFirst ? '#15803d' : isLast ? '#b91c1c' : '#0369a1',
                                  padding: '2px 6px',
                                  borderRadius: 4
                                }}>
                                  Stage {sIdx + 1}
                                </span>
                                <strong style={{ fontSize: 12, color: 'var(--text-gold)' }}>
                                  {stage.fromNode.name} &rarr; {stage.toNode.name}
                                </strong>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
                                ~{stage.totalDays}d
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                              <span>{stage.distanceMiles.toLocaleString()} miles ({stage.distanceKm.toLocaleString()} km)</span>
                              <span>{stage.legs.length} {stage.legs.length === 1 ? 'link' : 'links'}</span>
                            </div>

                            {/* Micro-legs within this stage */}
                            <div style={{ background: 'rgba(15, 23, 42, 0.45)', padding: '6px 8px', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {stage.legs.map((leg, lIdx) => (
                                <div key={lIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-parchment)' }}>
                                  <span>• {leg.edge.name}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>{leg.distanceMiles} mi</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-tab Content: Legs */}
                  {itinerarySubTab === 'turnByTurn' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {routeResult.legs.map((leg, idx) => {
                        const isSea = leg.segmentType === 'sea';
                        const isFlight = leg.segmentType === 'flight';

                        return (
                          <div
                            key={idx}
                            className="glass-card"
                            style={{
                              padding: '10px 12px',
                              borderLeft: `3px solid ${isFlight ? '#ef4444' : isSea ? '#06b6d4' : '#f59e0b'}`,
                              transition: 'border-color 0.2s, background 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  background: isFlight ? '#ef4444' : isSea ? '#06b6d4' : '#f59e0b',
                                  padding: '1px 5px',
                                  borderRadius: 3
                                }}>
                                  Leg {idx + 1}
                                </span>
                                <strong style={{ fontSize: 12, color: 'var(--text-parchment)' }}>
                                  {leg.fromNode.name} &rarr; {leg.toNode.name}
                                </strong>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
                                ~{leg.transitDays}d
                              </span>
                            </div>

                            <div style={{ fontSize: 11, color: 'var(--text-gold-bright)', marginBottom: 2 }}>
                              {leg.edge.name}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                              <span>{leg.distanceMiles.toLocaleString()} miles ({leg.distanceKm.toLocaleString()} km)</span>
                              <span style={{ color: TERRAIN_MODIFIERS[leg.terrainType]?.color || '#fff' }}>
                                {TERRAIN_MODIFIERS[leg.terrainType]?.label.split('(')[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Sub-tab Content: Terrain Matrix */}
                  {itinerarySubTab === 'terrain' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {routeResult.terrainBreakdown.map((item, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '8px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-parchment)' }}>
                                {item.label}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-gold-bright)' }}>
                              {item.percentage}%
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)' }}>
                            <span>{item.miles.toLocaleString()} miles</span>
                            <span>{Math.round(item.miles * 1.609)} km</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sub-tab Content: Hazards */}
                  {itinerarySubTab === 'hazards' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {routeResult.hazards.length === 0 ? (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', padding: 8 }}>
                          No acute environmental or bandit perils identified along this corridor.
                        </div>
                      ) : (
                        routeResult.hazards.map((h, idx) => (
                          <div key={idx} className="glass-card" style={{ padding: '10px 12px', borderLeft: '3px solid #f59e0b', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: 11, color: 'var(--text-parchment)', margin: 0, lineHeight: 1.3 }}>
                              {h}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: CORRIDOR COMPARISON ================= */}
          {activeTab === 'corridors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ marginBottom: 4 }}>
                <h4 className="font-serif" style={{ fontSize: 12, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: 2 }}>
                  Corridor Comparison Matrix
                </h4>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
                  Compare multimodal, overland, maritime, and aerial routes for this journey:
                </p>
              </div>

              {/* Optimization Goal Selector inside comparison */}
              <div className="glass-card" style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optimization Goal:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['balanced', 'shortest', 'fastest'] as OptimizationGoal[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => onApplyGoal(g)}
                      className="btn-secondary"
                      style={{
                        padding: '3px 8px',
                        fontSize: 10,
                        borderRadius: 4,
                        background: currentGoal === g ? 'rgba(223, 177, 91, 0.25)' : 'transparent',
                        color: currentGoal === g ? 'var(--text-gold-bright)' : 'var(--text-muted)',
                        borderColor: currentGoal === g ? 'var(--border-gold)' : 'var(--border-subtle)'
                      }}
                    >
                      {g === 'shortest' ? 'Shortest' : g === 'fastest' ? 'Fastest' : 'Optimal'}
                    </button>
                  ))}
                </div>
              </div>

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
                    id: 'shortest',
                    mode: 'balanced' as RoutingPreference,
                    title: 'Shortest Physical Distance',
                    icon: <Milestone size={15} color="#22c55e" />,
                    route: alts.shortest,
                    desc: 'Minimum total distance in miles along established roads and sea lanes.'
                  },
                  {
                    id: 'land_only',
                    mode: 'land_only' as RoutingPreference,
                    title: 'Strictly Overland',
                    icon: <Footprints size={15} color="#f59e0b" />,
                    route: alts.overland,
                    desc: 'Follows royal roads and mountain defiles without boarding ships.'
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
                    id: 'crow',
                    mode: 'crow_flight' as RoutingPreference,
                    title: 'Messenger Crow / Raven',
                    icon: <Bird size={15} color="#a855f7" />,
                    route: alts.crow,
                    desc: 'Direct rookery message flight as the crow flies (~240 miles / day).'
                  },
                  {
                    id: 'dragon',
                    mode: 'dragon' as RoutingPreference,
                    title: 'Dragon Flight',
                    icon: <Flame size={15} color="#ef4444" />,
                    route: alts.dragon,
                    desc: 'Direct high-speed aerial flight over mountains and open seas (~520 miles / day).'
                  }
                ];

                return cards.map((c) => {
                  const isCurrent = currentMode === c.mode;
                  const isViable = c.route && c.route.routeFound;

                  return (
                    <div
                      key={c.id}
                      className="glass-card"
                      style={{
                        padding: '10px 12px',
                        borderColor: isCurrent ? 'var(--border-gold)' : 'var(--border-subtle)',
                        background: isCurrent ? 'rgba(223, 177, 91, 0.12)' : 'var(--bg-card)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {c.icon}
                          <strong style={{ fontSize: 12, color: 'var(--text-parchment)' }}>{c.title}</strong>
                        </div>
                        {isCurrent && (
                          <span style={{ fontSize: 10, color: 'var(--text-gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Check size={12} /> ACTIVE
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.3 }}>
                        {c.desc}
                      </p>

                      {isViable && c.route ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
                            <span style={{ color: 'var(--text-gold-bright)' }}>{c.route.totalMiles.toLocaleString()} miles</span>
                            <span style={{ color: '#38bdf8' }}>~{c.route.totalDays} days</span>
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                            {c.route.totalKm.toLocaleString()} km • {c.route.totalLeagues.toLocaleString()} leagues
                          </div>

                          {!isCurrent && (
                            <button
                              onClick={() => onApplyMode(c.mode)}
                              className="btn-secondary"
                              style={{ width: '100%', marginTop: 8, justifyContent: 'center', fontSize: 11 }}
                            >
                              Switch to this Mode
                            </button>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                          No viable route found for this corridor.
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* ================= TAB 3: CARTOGRAPHY GUIDE ================= */}
          {activeTab === 'guide' && (
            <div>
              {/* Scale Calibration Card */}
              <div className="glass-card" style={{ padding: '10px 12px', marginBottom: 12 }}>
                <strong style={{ fontSize: 11, color: 'var(--text-gold-bright)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Milestone size={13} /> Scale Calibration (Cartographer's Bar)
                </strong>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '4px 0 6px', lineHeight: 1.4 }}>
                  Calibrated directly to the printed 600-mile bar (686 px = 600 miles):
                </p>
                <div style={{ fontSize: 10, color: 'var(--text-parchment)', background: '#0f172a', padding: 8, borderRadius: 4, lineHeight: 1.5 }}>
                  • 1 pixel = <b>0.875 miles</b> (0.292 leagues • 1.408 km)<br />
                  • The Wall (Shadow Tower to Eastwatch): <b>305 miles</b> (Canon: ~300 miles)<br />
                  • Kingsroad (King's Landing to Winterfell): <b>~1,565 miles</b> (Canon: ~1,500 miles)
                </div>
              </div>

              {/* Settlement Hierarchy */}
              <div style={{ marginBottom: 14 }}>
                <h4 className="font-serif" style={{ fontSize: 11, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Settlement Hierarchy
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="citadel-marker marker-capital" style={{ width: 16, height: 16 }}>
                      <span style={{ fontSize: 9 }}>★</span>
                    </div>
                    <div>
                      <strong>Regional Capital</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Winterfell, King's Landing, Braavos, Meereen, Qarth</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="citadel-marker marker-city" style={{ width: 14, height: 14 }} />
                    <div>
                      <strong>Major Metropolis</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Oldtown, Lannisport, Gulltown, White Harbor</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="citadel-marker marker-port" style={{ width: 13, height: 13 }}>
                      <span style={{ fontSize: 7 }}>⚓</span>
                    </div>
                    <div>
                      <strong>Seaport / Naval Anchorage</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Harbor access for boarding and disembarking vessels</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="citadel-marker marker-castle" style={{ width: 11, height: 11 }} />
                    <div>
                      <strong>Castle / Stronghold</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>The Twins, Dreadfort, Harrenhal, Crakehall</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="citadel-marker marker-junction" style={{ width: 9, height: 9 }} />
                    <div>
                      <strong>Strategic Junction / Pass</strong>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Crossroads Inn, Moat Cailin, Golden Tooth, Bloody Gate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terrain Quality Modifiers */}
              <div>
                <h4 className="font-serif" style={{ fontSize: 11, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Road Quality & Terrain Modifiers
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10 }}>
                  {Object.entries(TERRAIN_MODIFIERS).map(([key, mod]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '3px 0' }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: mod.color,
                        marginTop: 3,
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-parchment)' }}>
                          {mod.label} ({mod.speedMultiplier}x speed)
                        </div>
                        <div style={{ color: 'var(--text-muted)', lineHeight: 1.3 }}>
                          {mod.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
