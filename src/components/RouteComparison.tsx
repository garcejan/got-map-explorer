import React from 'react';
import type { RoutingPreference } from '../types';
import { calculateRouteAlternatives } from '../engine/pathfinder';
import { Check, Compass, Flame, Ship, Footprints, Bird } from 'lucide-react';

interface RouteComparisonProps {
  originId: string;
  destinationId: string;
  selectedPartyId: string;
  currentMode: RoutingPreference;
  onApplyMode: (mode: RoutingPreference) => void;
  onClose: () => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  originId,
  destinationId,
  selectedPartyId,
  currentMode,
  onApplyMode,
  onClose
}) => {
  const alts = calculateRouteAlternatives(originId, destinationId, selectedPartyId);

  const cards = [
    {
      id: 'balanced',
      mode: 'balanced' as RoutingPreference,
      title: 'Fastest Multimodal',
      icon: <Compass size={16} color="var(--text-gold)" />,
      route: alts.balanced,
      desc: 'Optimal combination of royal roads and coastal sea passages.'
    },
    {
      id: 'land_only',
      mode: 'land_only' as RoutingPreference,
      title: 'Strictly Overland',
      icon: <Footprints size={16} color="#f59e0b" />,
      route: alts.overland,
      desc: 'Follows highways and mountain passes without boarding ships.'
    },
    {
      id: 'sea_only',
      mode: 'sea_only' as RoutingPreference,
      title: 'Strictly Maritime',
      icon: <Ship size={16} color="#06b6d4" />,
      route: alts.maritime,
      desc: 'Coastal and open-water shipping lanes connecting ports.'
    },
    {
      id: 'crow',
      mode: 'crow_flight' as RoutingPreference,
      title: 'Messenger Crow / Raven',
      icon: <Bird size={16} color="#c084fc" />,
      route: alts.crow,
      desc: 'Direct rookery message flight as the crow flies (~240 miles / day).'
    },
    {
      id: 'dragon',
      mode: 'dragon' as RoutingPreference,
      title: 'Dragon Flight',
      icon: <Flame size={16} color="#ef4444" />,
      route: alts.dragon,
      desc: 'Direct high-speed aerial flight over mountains, forests, and oceans (~520 miles / day).'
    }
  ];

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: 80,
        left: 370,
        width: 320,
        zIndex: 1000,
        padding: 16,
        boxShadow: '0 12px 35px rgba(0,0,0,0.85)',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)', textTransform: 'uppercase' }}>
          Corridor Route Comparison
        </h3>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '2px 6px', fontSize: 11 }}>
          Close
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cards.map((c) => {
          const isCurrent = currentMode === c.mode;
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
        })}
      </div>
    </div>
  );
};
