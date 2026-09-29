import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { MapCanvas } from './components/MapCanvas';
import { Header, type Theme } from './components/Header';
import { CitadelSidebar } from './components/CitadelSidebar';
import type { PresetJourney } from './components/HistoricalPresetsDropdown';
import type { RouteResult, RoutingPreference, OptimizationGoal, MapPickingTarget } from './types';
import { calculateRealisticRoute, optimizeWaypointOrder } from './engine/pathfinder';
import { useIsMobile } from './hooks/useIsMobile';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('citadel_theme');
    return saved === 'beige' || saved === 'dark' ? saved : 'beige';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('citadel_theme', theme);
  }, [theme]);

  const isMobile = useIsMobile();

  const [originId, setOriginId] = useState<string>('kings_landing');
  const [destinationId, setDestinationId] = useState<string>('winterfell');
  const [waypointIds, setWaypointIds] = useState<string[]>([]);
  const [mapPickingTarget, setMapPickingTarget] = useState<MapPickingTarget>(null);
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('retinue');
  const [selectedMode, setSelectedMode] = useState<RoutingPreference>('balanced');
  const [selectedGoal, setSelectedGoal] = useState<OptimizationGoal>('balanced');

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [focusedCity, setFocusedCity] = useState<{ id: string; timestamp: number } | null>(null);

  const handleZoomToCity = (nodeId: string) => {
    setFocusedCity({ id: nodeId, timestamp: Date.now() });
  };

  // Reorder waypoints to minimize travel distance/time
  const handleOptimizeWaypoints = useCallback(() => {
    if (!originId || !destinationId || waypointIds.filter(Boolean).length < 2) return;
    const optimized = optimizeWaypointOrder(
      originId,
      destinationId,
      waypointIds,
      selectedPartyId,
      selectedMode,
      selectedGoal
    );
    setWaypointIds(optimized);
  }, [originId, destinationId, waypointIds, selectedPartyId, selectedMode, selectedGoal]);

  // Calculate realistic route
  const handleCalculate = useCallback(() => {
    if (!originId || !destinationId || originId === destinationId) {
      setRouteResult(null);
      return;
    }

    const res = calculateRealisticRoute(
      originId,
      destinationId,
      waypointIds,
      selectedPartyId,
      selectedMode,
      selectedGoal,
      autoOptimize
    );

    // If auto-optimize was active and changed the waypoint sequence, synchronize input state
    if (autoOptimize && res && res.waypointsVisited.length > 1) {
      const optimizedIds = res.waypointsVisited.map(n => n.id);
      const isDifferent = optimizedIds.some((id, idx) => id !== waypointIds[idx]);
      if (isDifferent) {
        setWaypointIds(optimizedIds);
      }
    }

    setRouteResult(res);
  }, [originId, destinationId, waypointIds, selectedPartyId, selectedMode, selectedGoal, autoOptimize]);

  // Synchronized Party & Corridor Mode Selection
  const handleSelectParty = (partyId: string) => {
    setSelectedPartyId(partyId);
    if (partyId === 'crow') {
      setSelectedMode('crow_flight');
    } else if (partyId === 'dragon') {
      setSelectedMode('dragon');
    } else if (partyId === 'fleet') {
      setSelectedMode('sea_only');
    } else if (selectedMode === 'crow_flight' || selectedMode === 'dragon' || selectedMode === 'sea_only') {
      setSelectedMode('balanced');
    }
  };

  const handleSelectMode = (mode: RoutingPreference) => {
    setSelectedMode(mode);
    if (mode === 'crow_flight') {
      setSelectedPartyId('crow');
    } else if (mode === 'dragon') {
      setSelectedPartyId('dragon');
    } else if (mode === 'sea_only') {
      setSelectedPartyId('fleet');
    } else if (selectedPartyId === 'crow' || selectedPartyId === 'dragon' || selectedPartyId === 'fleet') {
      setSelectedPartyId('retinue');
    }
  };

  // Initial calculation on load
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Handle preset selection
  const handleSelectPreset = (preset: PresetJourney) => {
    setActivePresetId(preset.id);
    setOriginId(preset.originId);
    setDestinationId(preset.destinationId);
    setWaypointIds(preset.waypoints || []);
    setSelectedPartyId(preset.partyId);
    setSelectedMode(preset.mode);
    if (preset.goal) {
      setSelectedGoal(preset.goal);
    }
    setSidebarOpen(true);
  };

  // Handle map node selection from popup or click
  const handleSelectNode = useCallback((nodeId: string, role: 'origin' | 'destination' | 'waypoint') => {
    setActivePresetId(null);
    if (role === 'origin') {
      setOriginId(nodeId);
    } else if (role === 'destination') {
      setDestinationId(nodeId);
    } else {
      setWaypointIds((prev) => {
        if (prev.includes(nodeId)) {
          return prev.filter((id) => id !== nodeId);
        }
        const emptyIdx = prev.indexOf('');
        if (emptyIdx !== -1) {
          const next = [...prev];
          next[emptyIdx] = nodeId;
          return next;
        }
        if (prev.length < 8) {
          return [...prev, nodeId];
        }
        return prev;
      });
    }
    setMapPickingTarget(null);
    setSidebarOpen(true);
  }, []);

  const handleNodePicked = useCallback((nodeId: string, target: NonNullable<MapPickingTarget>) => {
    if (target.type === 'origin') {
      setOriginId(nodeId);
    } else if (target.type === 'destination') {
      setDestinationId(nodeId);
    } else if (target.type === 'waypoint') {
      setWaypointIds((prev) => {
        const next = [...prev];
        if (target.index < next.length) {
          next[target.index] = nodeId;
        } else {
          next.push(nodeId);
        }
        return next;
      });
    }
    setMapPickingTarget(null);
    setSidebarOpen(true);
  }, []);

  const handleStartPicking = useCallback((target: MapPickingTarget) => {
    setMapPickingTarget(target);
  }, []);

  const handleCancelPicking = useCallback(() => {
    setMapPickingTarget(null);
  }, []);

  const handleQuickRoute = useCallback((nodeId: string) => {
    setActivePresetId(null);
    setDestinationId(nodeId);
    setSidebarOpen(true);
  }, []);

  const handleClearRoute = useCallback(() => {
    setActivePresetId(null);
    setOriginId('');
    setDestinationId('');
    setWaypointIds([]);
    setRouteResult(null);
    setMapPickingTarget(null);
  }, []);

  // Citadel Sidebar position & docking state
  const [sidebarPos, setSidebarPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 16, y: 70 };
    try {
      const saved = localStorage.getItem('citadel_sidebar_position');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return { x: 16, y: 70 };
  });

  const isSidebarDockedRight = sidebarPos.x > (typeof window !== 'undefined' ? (window.innerWidth - 450) / 2 : 500);

  const handleDockSidebarLeft = useCallback(() => {
    const newPos = { x: 16, y: 70 };
    setSidebarPos(newPos);
    try {
      localStorage.setItem('citadel_sidebar_position', JSON.stringify(newPos));
    } catch {
      // ignore
    }
  }, []);

  const handleDockSidebarRight = useCallback(() => {
    const sidebarWidth = Math.min(390, window.innerWidth - 32);
    const newPos = { x: Math.max(16, window.innerWidth - sidebarWidth - 16), y: 70 };
    setSidebarPos(newPos);
    try {
      localStorage.setItem('citadel_sidebar_position', JSON.stringify(newPos));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', minHeight: '100vh', overflow: 'hidden' }}>
      <Analytics />
      {/* Full-bleed Map Canvas with Overlays */}
      <MapCanvas
        theme={theme}
        originId={originId}
        destinationId={destinationId}
        waypointIds={waypointIds}
        routeResult={routeResult}
        focusedCity={focusedCity}
        mapPickingTarget={mapPickingTarget}
        onSelectNode={handleSelectNode}
        onNodePicked={handleNodePicked}
        onCancelPicking={handleCancelPicking}
        onQuickRoute={handleQuickRoute}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarDockedRight={isSidebarDockedRight}
        onDockSidebarLeft={handleDockSidebarLeft}
        onDockSidebarRight={handleDockSidebarRight}
      >
        {/* Consolidated Movable Citadel Ledger (Plan Journey + Itinerary + Corridors + Guide) */}
        <CitadelSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
          originId={originId}
          destinationId={destinationId}
          waypointIds={waypointIds}
          selectedPartyId={selectedPartyId}
          selectedMode={selectedMode}
          selectedGoal={selectedGoal}
          autoOptimize={autoOptimize}
          routeResult={routeResult}
          mapPickingTarget={mapPickingTarget}
          position={sidebarPos}
          onPositionChange={setSidebarPos}
          onSetOrigin={(id) => {
            setActivePresetId(null);
            setOriginId(id);
            setMapPickingTarget(null);
          }}
          onSetDestination={(id) => {
            setActivePresetId(null);
            setDestinationId(id);
            setMapPickingTarget(null);
          }}
          onSetWaypoints={(ids) => {
            setActivePresetId(null);
            setWaypointIds(ids);
            setMapPickingTarget(null);
          }}
          onStartPicking={handleStartPicking}
          onCancelPicking={handleCancelPicking}
          onOptimizeWaypoints={handleOptimizeWaypoints}
          onToggleAutoOptimize={setAutoOptimize}
          onSelectParty={handleSelectParty}
          onSelectMode={handleSelectMode}
          onSelectGoal={setSelectedGoal}
          onCalculateRoute={handleCalculate}
          onClearRoute={handleClearRoute}
        />
      </MapCanvas>

      {/* Top Banner Navigation Bar */}
      <Header
        theme={theme}
        onSelectTheme={setTheme}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        onClearPreset={handleClearRoute}
        onSelectCity={handleZoomToCity}
        onSetOrigin={(nodeId) => {
          setActivePresetId(null);
          setOriginId(nodeId);
          handleZoomToCity(nodeId);
        }}
        onSetDestination={(nodeId) => {
          setActivePresetId(null);
          setDestinationId(nodeId);
          handleZoomToCity(nodeId);
        }}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default App;

