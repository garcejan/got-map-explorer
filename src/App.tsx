import React, { useState, useEffect, useCallback } from 'react';
import { MapCanvas } from './components/MapCanvas';
import { Header, type Theme } from './components/Header';
import { CitadelSidebar } from './components/CitadelSidebar';
import type { PresetJourney } from './components/QuickPresets';
import type { RouteResult, RoutingPreference, OptimizationGoal, MapPickingTarget } from './types';
import { calculateRealisticRoute, optimizeWaypointOrder } from './engine/pathfinder';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('citadel_theme');
    return saved === 'beige' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('citadel_theme', theme);
  }, [theme]);

  const [originId, setOriginId] = useState<string>('kings_landing');
  const [destinationId, setDestinationId] = useState<string>('winterfell');
  const [waypointIds, setWaypointIds] = useState<string[]>([]);
  const [mapPickingTarget, setMapPickingTarget] = useState<MapPickingTarget>(null);
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string>('retinue');
  const [selectedMode, setSelectedMode] = useState<RoutingPreference>('balanced');
  const [selectedGoal, setSelectedGoal] = useState<OptimizationGoal>('balanced');

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
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
    setMapPickingTarget((prev) => {
      if (prev && target && prev.type === target.type) {
        if (prev.type === 'waypoint' && target.type === 'waypoint') {
          return prev.index === target.index ? null : target;
        }
        return null;
      }
      return target;
    });
  }, []);

  const handleCancelPicking = useCallback(() => {
    setMapPickingTarget(null);
  }, []);

  const handleQuickRoute = useCallback((nodeId: string) => {
    setDestinationId(nodeId);
    setSidebarOpen(true);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Full-bleed Map Canvas */}
      <MapCanvas
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
      />

      {/* Top Banner Navigation Bar */}
      <Header
        theme={theme}
        onSelectTheme={setTheme}
        onSelectPreset={handleSelectPreset}
        onSelectCity={handleZoomToCity}
        onSetOrigin={(nodeId) => {
          setOriginId(nodeId);
          handleZoomToCity(nodeId);
        }}
        onSetDestination={(nodeId) => {
          setDestinationId(nodeId);
          handleZoomToCity(nodeId);
        }}
      />

      {/* Consolidated Left Citadel Ledger (Plan Journey + Itinerary + Corridors + Guide) */}
      <CitadelSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        originId={originId}
        destinationId={destinationId}
        waypointIds={waypointIds}
        selectedPartyId={selectedPartyId}
        selectedMode={selectedMode}
        selectedGoal={selectedGoal}
        autoOptimize={autoOptimize}
        routeResult={routeResult}
        mapPickingTarget={mapPickingTarget}
        onSetOrigin={setOriginId}
        onSetDestination={setDestinationId}
        onSetWaypoints={setWaypointIds}
        onStartPicking={handleStartPicking}
        onCancelPicking={handleCancelPicking}
        onOptimizeWaypoints={handleOptimizeWaypoints}
        onToggleAutoOptimize={setAutoOptimize}
        onSelectParty={handleSelectParty}
        onSelectMode={handleSelectMode}
        onSelectGoal={setSelectedGoal}
        onCalculateRoute={handleCalculate}
      />
    </div>
  );
};

export default App;

