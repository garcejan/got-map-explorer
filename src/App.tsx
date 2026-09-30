import React, { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { MapCanvas } from './components/MapCanvas';
import { Header, type Theme } from './components/Header';
import { CitadelSidebar } from './components/CitadelSidebar';
import { CartographyLayersModal } from './components/CartographyLayersModal';
import type { PresetJourney } from './components/HistoricalPresetsDropdown';
import type { RouteResult, RoutingPreference, OptimizationGoal, MapPickingTarget } from './types';
import { type CartographyLayersConfig, DEFAULT_CARTOGRAPHY_LAYERS } from './types';
import { calculateRealisticRoute, optimizeWaypointOrder } from './engine/pathfinder';
import { useIsMobile } from './hooks/useIsMobile';
import confetti from 'canvas-confetti';
import { CitadelGuideModal } from './components/CitadelGuideModal';
import { PRESET_JOURNEYS } from './data/presets';
import { NODES } from './data/nodes';

/**
 * Parses deep-linked journeys from URL query parameters on initial page load.
 * Supports:
 * - `preset`: Canonical lore journeys (e.g. ?preset=robert_royal_progress)
 * - `origin` & `destination`: Valid settlement keys from NODES (e.g. ?origin=winterfell&destination=kings_landing)
 * - `waypoints`: Comma-delimited settlement keys (e.g. ?waypoints=harrenhal,crossroads_inn)
 * - `party`: Travel party archetype (e.g. ?party=dragon)
 * - `mode` & `goal`: Routing constraints and optimization goals
 *
 * Ensures zero functional regressions by safely falling back to default King's Landing -> Winterfell route.
 */
const getInitialRouteState = () => {
  if (typeof window === 'undefined') {
    return {
      originId: 'kings_landing',
      destinationId: 'winterfell',
      waypointIds: [] as string[],
      partyId: 'retinue',
      mode: 'balanced' as RoutingPreference,
      goal: 'balanced' as OptimizationGoal,
      presetId: null as string | null
    };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const presetParam = params.get('preset');
    if (presetParam) {
      const preset = PRESET_JOURNEYS.find((p) => p.id === presetParam);
      if (preset) {
        return {
          originId: preset.originId,
          destinationId: preset.destinationId,
          waypointIds: preset.waypoints || [],
          partyId: preset.partyId,
          mode: preset.mode,
          goal: preset.goal || 'balanced',
          presetId: preset.id
        };
      }
    }

    const originParam = params.get('origin');
    const destParam = params.get('destination');
    const partyParam = params.get('party');
    const modeParam = params.get('mode');
    const goalParam = params.get('goal');
    const waypointsParam = params.get('waypoints');

    const validPartyIds = ['messenger', 'retinue', 'army', 'caravan', 'fleet', 'crow', 'dragon'];
    const validModes: RoutingPreference[] = ['balanced', 'land_only', 'sea_only', 'dragon', 'crow_flight'];
    const validGoals: OptimizationGoal[] = ['balanced', 'shortest', 'fastest'];

    return {
      originId: (originParam && NODES[originParam]) ? originParam : 'kings_landing',
      destinationId: (destParam && NODES[destParam]) ? destParam : 'winterfell',
      waypointIds: waypointsParam ? waypointsParam.split(',').filter((id) => Boolean(NODES[id])) : [],
      partyId: (partyParam && validPartyIds.includes(partyParam)) ? partyParam : 'retinue',
      mode: (modeParam && validModes.includes(modeParam as RoutingPreference)) ? (modeParam as RoutingPreference) : 'balanced',
      goal: (goalParam && validGoals.includes(goalParam as OptimizationGoal)) ? (goalParam as OptimizationGoal) : 'balanced',
      presetId: null
    };
  } catch {
    return {
      originId: 'kings_landing',
      destinationId: 'winterfell',
      waypointIds: [],
      partyId: 'retinue',
      mode: 'balanced' as RoutingPreference,
      goal: 'balanced' as OptimizationGoal,
      presetId: null
    };
  }
};

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

  const [layersConfig, setLayersConfig] = useState<CartographyLayersConfig>(DEFAULT_CARTOGRAPHY_LAYERS);
  const [isLayersModalOpen, setIsLayersModalOpen] = useState<boolean>(false);

  const handleToggleLayer = useCallback((layer: keyof CartographyLayersConfig) => {
    setLayersConfig((prev) => ({ ...prev, [layer]: !prev[layer] }));
  }, []);

  const handleResetLayers = useCallback(() => {
    setLayersConfig(DEFAULT_CARTOGRAPHY_LAYERS);
  }, []);

  const handleEnableAllLayers = useCallback(() => {
    setLayersConfig({
      roads: true,
      kingdomPaths: true,
      seaLanes: true,
      battles: true,
      labels: true,
      graticules: true,
      waterMask: true
    });
  }, []);

  // Initialize journey inputs with deep link from URL or canonical defaults
  const [initialRoute] = useState(getInitialRouteState);
  const [originId, setOriginId] = useState<string>(initialRoute.originId);
  const [destinationId, setDestinationId] = useState<string>(initialRoute.destinationId);
  const [waypointIds, setWaypointIds] = useState<string[]>(initialRoute.waypointIds);
  const [mapPickingTarget, setMapPickingTarget] = useState<MapPickingTarget>(null);
  const [autoOptimize, setAutoOptimize] = useState<boolean>(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string>(initialRoute.partyId);
  const [selectedMode, setSelectedMode] = useState<RoutingPreference>(initialRoute.mode);
  const [selectedGoal, setSelectedGoal] = useState<OptimizationGoal>(initialRoute.goal);

  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialRoute.presetId);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [focusedCity, setFocusedCity] = useState<{ id: string; timestamp: number } | null>(null);

  // Unified Citadel Guide & Onboarding Tutorial state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideInitialTab, setGuideInitialTab] = useState<'tutorial' | 'codex'>('tutorial');

  // Check for first-time visitor to launch tutorial with a gentle 600ms grace period (skip if deep-linked)
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('citadel_tutorial_v1');
      const hasDeepLink = typeof window !== 'undefined' && (
        Boolean(initialRoute.presetId) ||
        window.location.search.includes('origin=') ||
        window.location.search.includes('destination=')
      );
      if (!hasSeen && !hasDeepLink) {
        const timer = setTimeout(() => {
          setGuideInitialTab('tutorial');
          setIsGuideOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Safe fallback if localStorage is unavailable
    }
  }, [initialRoute.presetId]);

  const handleOpenGuide = useCallback((tab: 'tutorial' | 'codex' = 'tutorial') => {
    setGuideInitialTab(tab);
    setIsGuideOpen(true);
  }, []);

  const handleCloseGuide = useCallback((markAsCompleted = true) => {
    if (markAsCompleted) {
      try {
        localStorage.setItem('citadel_tutorial_v1', 'true');
      } catch {
        // Safe fallback
      }
    }
    setIsGuideOpen(false);
  }, []);

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

  /**
   * Bi-directional URL synchronization and dynamic document title updating:
   * 1. Updates address bar query params via `window.history.replaceState` without triggering page reload or canvas re-render.
   * 2. Dynamically updates `document.title` on route calculation with origin, destination, distance, and transit days.
   * 3. Falls back to default site title when no route is active.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams();

      if (activePresetId) {
        params.set('preset', activePresetId);
      } else {
        if (originId) params.set('origin', originId);
        if (destinationId) params.set('destination', destinationId);
        if (waypointIds.length > 0) params.set('waypoints', waypointIds.join(','));
        if (selectedPartyId && selectedPartyId !== 'retinue') params.set('party', selectedPartyId);
        if (selectedMode && selectedMode !== 'balanced') params.set('mode', selectedMode);
        if (selectedGoal && selectedGoal !== 'balanced') params.set('goal', selectedGoal);
      }

      const queryString = params.toString();
      const newSearch = queryString ? `?${queryString}` : '';
      if (window.location.search !== newSearch) {
        window.history.replaceState(null, '', `${window.location.pathname}${newSearch}`);
      }

      if (routeResult && routeResult.origin && routeResult.destination) {
        const dist = Math.round(routeResult.totalMiles).toLocaleString();
        const days = routeResult.totalDays.toFixed(1);
        document.title = `${routeResult.origin.name} to ${routeResult.destination.name} (${dist} mi, ${days} days) — The Known World`;
      } else {
        document.title = 'The Known World — Interactive Westeros & Essos Map';
      }
    } catch {
      // Safe fallback if history manipulation is restricted
    }
  }, [originId, destinationId, waypointIds, selectedPartyId, selectedMode, selectedGoal, activePresetId, routeResult]);

  // Handle preset selection
  const handleSelectPreset = useCallback((preset: PresetJourney) => {
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
  }, []);

  // Quick-Launch Actions from the Tutorial Launchpad
  const handleQuickLaunchPreset = useCallback((presetId: string) => {
    const preset = PRESET_JOURNEYS.find((p) => p.id === presetId);
    if (preset) {
      handleSelectPreset(preset);
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#dfb15b', '#ffd700', '#c99738', '#ffffff']
        });
      } catch {
        // ignore
      }
    }
    handleCloseGuide(true);
  }, [handleSelectPreset, handleCloseGuide]);

  const handleQuickLaunchCustom = useCallback(() => {
    setSidebarOpen(true);
    handleCloseGuide(true);
  }, [handleCloseGuide]);

  const handleQuickLaunchBattles = useCallback(() => {
    setLayersConfig((prev) => ({ ...prev, battles: true }));
    setFocusedCity({ id: 'crossroads_inn', timestamp: Date.now() });
    handleCloseGuide(true);
  }, [handleCloseGuide]);

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
        isMobile={isMobile}
        layersConfig={layersConfig}
        onToggleLayer={handleToggleLayer}
        isLayersModalOpen={isLayersModalOpen}
        onToggleLayersModal={() => setIsLayersModalOpen((prev) => !prev)}
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
        onToggleLayers={() => setIsLayersModalOpen((prev) => !prev)}
        isLayersOpen={isLayersModalOpen}
        onOpenGuide={handleOpenGuide}
      />

      {/* Mobile Cartography Layers Modal */}
      {isMobile && (
        <CartographyLayersModal
          isOpen={isLayersModalOpen}
          onClose={() => setIsLayersModalOpen(false)}
          layers={layersConfig}
          onToggleLayer={handleToggleLayer}
          onResetLayers={handleResetLayers}
          onEnableAllLayers={handleEnableAllLayers}
        />
      )}

      {/* Unified Citadel Guide & Onboarding Walkthrough Modal */}
      <CitadelGuideModal
        key={`${isGuideOpen}-${guideInitialTab}`}
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
        initialTab={guideInitialTab}
        onQuickLaunchPreset={handleQuickLaunchPreset}
        onQuickLaunchCustom={handleQuickLaunchCustom}
        onQuickLaunchBattles={handleQuickLaunchBattles}
      />
    </div>
  );
};

export default App;

