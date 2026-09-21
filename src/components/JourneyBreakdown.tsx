import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Clock,
  Milestone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { RouteResult } from '../types';

interface JourneyBreakdownProps {
  routeResult: RouteResult | null;
  onHoverLeg?: (legIndex: number | null) => void;
}

export const JourneyBreakdown: React.FC<JourneyBreakdownProps> = ({
  routeResult,
  onHoverLeg
}) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'terrain' | 'hazards'>('itinerary');

  if (!routeResult) {
    return (
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 360,
          padding: 16,
          zIndex: 1000,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
        }}
      >
        <Compass size={28} color="var(--text-gold)" style={{ margin: '0 auto 8px', opacity: 0.7 }} />
        <h4 className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)', marginBottom: 4 }}>
          Citadel Wayfinding Ready
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Select departure and arrival destinations along established historical routes or click directly on any settlement marker on the map.
        </p>
      </div>
    );
  }

  const {
    totalMiles,
    totalKm,
    totalLeagues,
    totalDays,
    landMiles,
    seaMiles,
    legs,
    terrainBreakdown,
    origin,
    destination,
    party,
    hazards
  } = routeResult;

  const totalLunarMonths = (totalDays / 28).toFixed(1);
  const totalWeeks = (totalDays / 7).toFixed(1);

  const landPct = totalMiles > 0 ? Math.round((landMiles / totalMiles) * 100) : 0;
  const seaPct = totalMiles > 0 ? Math.round((seaMiles / totalMiles) * 100) : 0;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 380,
        maxHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.9)',
        border: '1px solid var(--border-gold-glow)'
      }}
    >
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '12px 16px',
          borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'var(--bg-secondary)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            <strong className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)' }}>
              {origin.name}
            </strong>
            <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <strong className="font-serif" style={{ fontSize: 13, color: 'var(--text-gold)' }}>
              {destination.name}
            </strong>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Party: <span style={{ color: 'var(--text-gold-bright)' }}>{party.name.split('/')[0]}</span>
          </div>
        </div>

        <button className="btn-secondary" style={{ padding: 4 }}>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {expanded && (
        <div style={{ overflowY: 'auto', padding: '14px 16px' }}>
          {/* Dual Readout Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {/* Distance Card */}
            <div className="glass-card" style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Milestone size={12} color="var(--text-gold)" />
                <span>Corridor Distance</span>
              </div>
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-gold-bright)' }}>
                  {totalMiles.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-parchment)' }}>miles</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                  ~{totalLeagues.toLocaleString()} leagues • {totalKm.toLocaleString()} km
                </div>
              </div>
            </div>

            {/* Travel Time Card */}
            <div className="glass-card" style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Clock size={12} color="var(--text-gold)" />
                <span>Journey Duration</span>
              </div>
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--badge-sea-val, #38bdf8)' }}>
                  {totalDays} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-parchment)' }}>days</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                  ~{totalWeeks} weeks • {totalLunarMonths} lunar moons
                </div>
              </div>
            </div>
          </div>

          {/* Land vs Sea Progress Bar */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
              <span style={{ color: '#f59e0b' }}>Overland: {landMiles.toLocaleString()} mi ({landPct}%)</span>
              <span style={{ color: '#06b6d4' }}>Maritime: {seaMiles.toLocaleString()} mi ({seaPct}%)</span>
            </div>
            <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${landPct}%`, background: '#f59e0b', transition: 'width 0.4s ease' }} />
              <div style={{ width: `${seaPct}%`, background: '#06b6d4', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 12 }}>
            <button
              onClick={() => setActiveTab('itinerary')}
              style={{
                flex: 1,
                padding: '6px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'itinerary' ? '2px solid var(--border-gold)' : '2px solid transparent',
                color: activeTab === 'itinerary' ? 'var(--text-gold)' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              Legs ({legs.length})
            </button>
            <button
              onClick={() => setActiveTab('terrain')}
              style={{
                flex: 1,
                padding: '6px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'terrain' ? '2px solid var(--border-gold)' : '2px solid transparent',
                color: activeTab === 'terrain' ? 'var(--text-gold)' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              Terrain ({terrainBreakdown.length})
            </button>
            <button
              onClick={() => setActiveTab('hazards')}
              style={{
                flex: 1,
                padding: '6px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'hazards' ? '2px solid var(--border-gold)' : '2px solid transparent',
                color: activeTab === 'hazards' ? '#ef4444' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}
            >
              Hazards ({hazards.length})
            </button>
          </div>

          {/* Tab 1: Itinerary Legs */}
          {activeTab === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
              {legs.map((leg, index) => (
                <div
                  key={leg.edge.id + index}
                  className="glass-card"
                  style={{ padding: '8px 10px', fontSize: 11 }}
                  onMouseEnter={() => onHoverLeg && onHoverLeg(index)}
                  onMouseLeave={() => onHoverLeg && onHoverLeg(null)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-gold-bright)' }}>
                      {index + 1}. {leg.fromNode.name} &rarr; {leg.toNode.name}
                    </span>
                    <span style={{
                      fontSize: 9,
                      padding: '2px 5px',
                      borderRadius: 3,
                      background: leg.segmentType === 'sea' ? '#0369a1' : '#78350f',
                      color: '#fff',
                      textTransform: 'uppercase'
                    }}>
                      {leg.segmentType}
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 2 }}>
                    via <i>{leg.edge.name}</i>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: 10 }}>
                    <span>{leg.distanceMiles} mi ({leg.distanceKm} km)</span>
                    <span style={{ color: '#38bdf8' }}>~{leg.transitDays} days</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Terrain Breakdown */}
          {activeTab === 'terrain' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
              {terrainBreakdown.map((t) => (
                <div key={t.terrain} className="glass-card" style={{ padding: '8px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: t.color, fontWeight: 600 }}>{t.label}</span>
                    <span style={{ color: 'var(--text-gold)' }}>{t.percentage}%</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {t.miles.toLocaleString()} miles ({Math.round(t.miles * 1.60934).toLocaleString()} km)
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Regional Hazards */}
          {activeTab === 'hazards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
              {hazards.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
                  No high-risk bottlenecks identified along this route.
                </div>
              ) : (
                hazards.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 6,
                      padding: '8px 10px',
                      display: 'flex',
                      gap: 8,
                      fontSize: 11,
                      color: '#fca5a5'
                    }}
                  >
                    <AlertTriangle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ lineHeight: 1.3 }}>{h}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
