import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import type { RouteResult, MapPickingTarget } from '../types';
import { NODES } from '../data/nodes';
import { ROADS } from '../data/roads';
import { SEA_LANES } from '../data/seaLanes';
import { TERRAIN_MODIFIERS } from '../engine/parties';
import { MAP_WIDTH, MAP_HEIGHT, toLeafletLatLng, fromLeafletLatLng, pixelDistance, pixelsToMiles } from '../engine/scale';
import { leafletToWorld, WORLD_GRATICULES } from '../engine/coordinates';
import { initWaterNav, getBathymetryZone } from '../engine/waterNav';
import { TelemetryHUD, type TelemetryData } from './TelemetryHUD';

interface MapCanvasProps {
  originId: string;
  destinationId: string;
  waypointIds: string[];
  routeResult: RouteResult | null;
  focusedCity?: { id: string; timestamp: number } | null;
  mapPickingTarget?: MapPickingTarget;
  onSelectNode: (nodeId: string, role: 'origin' | 'destination' | 'waypoint') => void;
  onNodePicked?: (nodeId: string, target: NonNullable<MapPickingTarget>) => void;
  onCancelPicking?: () => void;
  onQuickRoute: (nodeId: string) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  originId,
  destinationId,
  waypointIds,
  routeResult,
  focusedCity,
  mapPickingTarget,
  onSelectNode,
  onNodePicked,
  onCancelPicking,
  onQuickRoute
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const markerLayersRef = useRef<L.LayerGroup | null>(null);
  const roadLayersRef = useRef<L.LayerGroup | null>(null);
  const seaLaneLayersRef = useRef<L.LayerGroup | null>(null);
  const graticuleLayersRef = useRef<L.LayerGroup | null>(null);
  const waterMaskLayersRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [showRoads, setShowRoads] = useState<boolean>(false);
  const [showSeaLanes, setShowSeaLanes] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [showWaterMask, setShowWaterMask] = useState<boolean>(false);
  const [cursorTelemetry, setCursorTelemetry] = useState<TelemetryData | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapPickingTargetRef = useRef<MapPickingTarget>(mapPickingTarget);
  const onNodePickedRef = useRef(onNodePicked);

  useEffect(() => {
    mapPickingTargetRef.current = mapPickingTarget;
  }, [mapPickingTarget]);

  useEffect(() => {
    onNodePickedRef.current = onNodePicked;
  }, [onNodePicked]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Cancel picking on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mapPickingTarget && onCancelPicking) {
        onCancelPicking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapPickingTarget, onCancelPicking]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 2,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: false
    });

    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [MAP_HEIGHT, MAP_WIDTH]
    ];

    // High-resolution local image overlay with online fallback
    const localMapUrl = '/assets/known_world_map.jpg';
    const fallbackUrl = 'https://i.redd.it/amzab3ogwsk81.jpg';

    L.imageOverlay(localMapUrl, bounds, {
      errorOverlayUrl: fallbackUrl
    }).addTo(map);

    // Initial center on Westeros / Narrow Sea
    map.setView([MAP_HEIGHT - 4500, 2200], -1.5);

    // Initialize water navigation binaries
    initWaterNav();

    const graticuleGroup = L.layerGroup().addTo(map);
    const waterMaskGroup = L.layerGroup().addTo(map);
    const seaLaneGroup = L.layerGroup().addTo(map);
    const roadGroup = L.layerGroup().addTo(map);
    const markerGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    graticuleLayersRef.current = graticuleGroup;
    waterMaskLayersRef.current = waterMaskGroup;
    seaLaneLayersRef.current = seaLaneGroup;
    roadLayersRef.current = roadGroup;
    markerLayersRef.current = markerGroup;
    routeLayersRef.current = routeGroup;

    // Live mouse telemetry tracking
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const imgCoords = fromLeafletLatLng([e.latlng.lat, e.latlng.lng]);
      const world = leafletToWorld([e.latlng.lat, e.latlng.lng]);
      const zone = getBathymetryZone(imgCoords[0], imgCoords[1]);
      const distPx = pixelDistance(imgCoords, [1031, 5365]);
      const distMiles = Math.round(pixelsToMiles(distPx));

      setCursorTelemetry({
        worldCoords: world.formattedFull,
        imgCoords: `X: ${Math.round(imgCoords[0])}, Y: ${Math.round(imgCoords[1])}`,
        zone,
        distanceFromCitadelMiles: distMiles
      });
    });

    map.on('mouseout', () => {
      setCursorTelemetry(null);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Imperial Highways Overlay
  useEffect(() => {
    const roadGroup = roadLayersRef.current;
    if (!roadGroup) return;
    roadGroup.clearLayers();
    if (!showRoads) return;

    for (const road of ROADS) {
      const latLngs = road.waypoints.map(toLeafletLatLng);
      const poly = L.polyline(latLngs, {
        color: '#dfb15b',
        weight: 2.2,
        opacity: 0.55,
        dashArray: '5, 6',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(roadGroup);

      poly.bindTooltip(`
        <div style="font-family: 'Cinzel', serif; padding: 2px;">
          <strong style="color: #ffd479; font-size: 12px; letter-spacing: 0.5px;">${road.name}</strong><br>
          <span style="font-size: 11px; color: #cbd5e1; font-family: 'Inter', sans-serif;">Terrain: ${road.terrainType.replace('_', ' ')} • ~${road.distanceMiles} mi</span>
        </div>
      `, { sticky: true, className: 'citadel-tooltip' });
    }
  }, [showRoads]);

  // Render Maritime Shipping Corridors Overlay
  useEffect(() => {
    const seaGroup = seaLaneLayersRef.current;
    if (!seaGroup) return;
    seaGroup.clearLayers();
    if (!showSeaLanes) return;

    for (const lane of SEA_LANES) {
      const latLngs = lane.waypoints.map(toLeafletLatLng);
      const poly = L.polyline(latLngs, {
        color: '#0ea5e9',
        weight: 2.0,
        opacity: 0.5,
        dashArray: '4, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(seaGroup);

      poly.bindTooltip(`
        <div style="font-family: 'Cinzel', serif; padding: 2px;">
          <strong style="color: #38bdf8; font-size: 12px; letter-spacing: 0.5px;">${lane.name}</strong><br>
          <span style="font-size: 11px; color: #cbd5e1; font-family: 'Inter', sans-serif;">Maritime Sea Corridor • ~${lane.distanceMiles} mi</span>
        </div>
      `, { sticky: true, className: 'citadel-tooltip' });
    }
  }, [showSeaLanes]);

  // Render World Graticules & Tropics
  useEffect(() => {
    const graticuleGroup = graticuleLayersRef.current;
    if (!graticuleGroup) return;
    graticuleGroup.clearLayers();
    if (!showGraticules) return;

    // 10-degree parallels (10°N to 70°N)
    for (const p of WORLD_GRATICULES.parallels) {
      const pLine = L.polyline([
        [p.leafletLat, 0],
        [p.leafletLat, MAP_WIDTH]
      ], {
        color: '#94a3b8',
        weight: 0.8,
        opacity: 0.35,
        dashArray: '4, 8'
      }).addTo(graticuleGroup);
      pLine.bindTooltip(`<b>${p.name} Parallel</b>`, { sticky: true, className: 'citadel-tooltip' });
    }

    // The Canonical Equator (Red Line at 0°)
    const eqLine = L.polyline([
      [WORLD_GRATICULES.equator.leafletLat, 0],
      [WORLD_GRATICULES.equator.leafletLat, MAP_WIDTH]
    ], {
      color: WORLD_GRATICULES.equator.color,
      weight: 2.0,
      opacity: 0.85,
      dashArray: '10, 6'
    }).addTo(graticuleGroup);
    eqLine.bindTooltip('<b>THE EQUATOR (0°)</b> — The Canonical Red Equinoctial Line', { sticky: true, className: 'citadel-tooltip' });

    // Tropic of Cancer (23.5° N)
    const trLine = L.polyline([
      [WORLD_GRATICULES.tropicOfCancer.leafletLat, 0],
      [WORLD_GRATICULES.tropicOfCancer.leafletLat, MAP_WIDTH]
    ], {
      color: WORLD_GRATICULES.tropicOfCancer.color,
      weight: 1.4,
      opacity: 0.7,
      dashArray: '6, 6'
    }).addTo(graticuleGroup);
    trLine.bindTooltip('<b>TROPIC OF CANCER (23.5° N)</b> — Northern Summer Solstice', { sticky: true, className: 'citadel-tooltip' });

    // Arctic Circle (66.5° N)
    const arcLine = L.polyline([
      [WORLD_GRATICULES.arcticCircle.leafletLat, 0],
      [WORLD_GRATICULES.arcticCircle.leafletLat, MAP_WIDTH]
    ], {
      color: WORLD_GRATICULES.arcticCircle.color,
      weight: 1.4,
      opacity: 0.7,
      dashArray: '6, 6'
    }).addTo(graticuleGroup);
    arcLine.bindTooltip('<b>THE ARCTIC CIRCLE (66.5° N)</b> — Lands of Always Winter', { sticky: true, className: 'citadel-tooltip' });

    // Prime Meridian
    const pmLine = L.polyline([
      [0, WORLD_GRATICULES.primeMeridian.leafletLng],
      [MAP_HEIGHT, WORLD_GRATICULES.primeMeridian.leafletLng]
    ], {
      color: WORLD_GRATICULES.primeMeridian.color,
      weight: 1.0,
      opacity: 0.45,
      dashArray: '4, 8'
    }).addTo(graticuleGroup);
    pmLine.bindTooltip('<b>PRIME MERIDIAN (0°)</b> — Meridian of the Citadel', { sticky: true, className: 'citadel-tooltip' });
  }, [showGraticules]);

  // Render Navigable Water Mask & Landmass Contours
  useEffect(() => {
    const waterGroup = waterMaskLayersRef.current;
    if (!waterGroup) return;
    waterGroup.clearLayers();
    if (!showWaterMask) return;

    fetch('/data/landmasses.geojson')
      .then(res => res.json())
      .then(geoJsonData => {
        if (!waterMaskLayersRef.current) return;
        L.geoJSON(geoJsonData, {
          coordsToLatLng: (coords) => L.latLng(MAP_HEIGHT - coords[1], coords[0]),
          style: {
            fillColor: '#0f172a',
            fillOpacity: 0.35,
            color: '#06b6d4',
            weight: 1.5,
            opacity: 0.75
          }
        }).addTo(waterGroup);
      })
      .catch(err => console.warn('Failed to load landmasses.geojson for overlay:', err));
  }, [showWaterMask]);

  // Render Settlement Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerLayersRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    for (const [id, node] of Object.entries(NODES)) {
      const isOrigin = id === originId;
      const isDestination = id === destinationId;
      const wpIndex = waypointIds.indexOf(id);
      const isWaypoint = wpIndex !== -1;
      const isSelected = isOrigin || isDestination || isWaypoint;

      const latLng = toLeafletLatLng(node.coords);

      let markerClass = 'citadel-marker ';
      let size = 12;

      if (node.type === 'capital') {
        markerClass += 'marker-capital';
        size = 18;
      } else if (node.type === 'major_city') {
        markerClass += 'marker-city';
        size = 14;
      } else if (node.type === 'port') {
        markerClass += 'marker-port';
        size = 13;
      } else if (node.type === 'castle') {
        markerClass += 'marker-castle';
        size = 11;
      } else {
        markerClass += 'marker-junction';
        size = 9;
      }

      let innerHtml = '';
      if (node.type === 'capital') innerHtml = '<span style="font-size: 10px; line-height: 1;">★</span>';
      else if (node.type === 'port') innerHtml = '<span style="font-size: 8px; line-height: 1;">⚓</span>';

      if (isOrigin) {
        markerClass += ' marker-origin';
        size = Math.max(size, 20);
        innerHtml = '<span style="font-size: 11px; font-weight: 900; color: #ffffff; line-height: 1;">S</span>';
      } else if (isDestination) {
        markerClass += ' marker-destination';
        size = Math.max(size, 20);
        innerHtml = '<span style="font-size: 11px; font-weight: 900; color: #ffffff; line-height: 1;">E</span>';
      } else if (isWaypoint) {
        markerClass += ' marker-waypoint';
        size = Math.max(size, 20);
        innerHtml = `<span style="font-size: 11px; font-weight: 900; color: #ffffff; line-height: 1;">${wpIndex + 1}</span>`;
      } else if (isSelected) {
        markerClass += ' marker-selected';
      }

      const iconHtml = `
        <div class="${markerClass}" style="width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;" title="${node.name}">
          ${innerHtml}
        </div>
        ${showLabels && (isSelected || node.type === 'capital' || node.type === 'major_city') ? `
          <div class="citadel-node-label" style="position: absolute; top: ${size + 2}px; left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; font-size: 10px; font-weight: 600; color: #f4ecd8; text-shadow: 0 1px 3px rgba(0,0,0,0.95), 0 0 4px #000; font-family: serif; letter-spacing: 0.5px;">
            ${node.name}
          </div>
        ` : ''}
      `;

      const icon = L.divIcon({
        html: iconHtml,
        className: 'custom-citadel-div-icon',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker(latLng, { icon }).addTo(markerGroup);
      markersRef.current[id] = marker;

      // Popup Content built as DOM element with isolated click propagation
      const popupDiv = document.createElement('div');
      popupDiv.style.minWidth = '240px';
      popupDiv.style.fontFamily = "'Inter', sans-serif";

      let statusBadge = '';
      if (isOrigin) {
        statusBadge = `<span style="font-size: 11px; font-weight: 700; text-transform: uppercase; background: #15803d; color: #fff; padding: 3px 8px; border-radius: 4px;">Departure</span>`;
      } else if (isDestination) {
        statusBadge = `<span style="font-size: 11px; font-weight: 700; text-transform: uppercase; background: #b91c1c; color: #fff; padding: 3px 8px; border-radius: 4px;">Arrival</span>`;
      } else if (isWaypoint) {
        statusBadge = `<span style="font-size: 11px; font-weight: 700; text-transform: uppercase; background: #0369a1; color: #fff; padding: 3px 8px; border-radius: 4px;">Stop ${wpIndex + 1}</span>`;
      }

      popupDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 10px;">
          <strong style="font-family: 'Cinzel', serif; font-size: 15px; color: #dfb15b; letter-spacing: 0.5px;">${node.name}</strong>
          <div style="display: flex; align-items: center; gap: 5px;">
            ${statusBadge}
            <span style="font-size: 11px; text-transform: uppercase; background: #1e293b; color: #cbd5e1; font-weight: 600; padding: 3px 6px; border-radius: 4px;">
              ${node.type.replace('_', ' ')}
            </span>
          </div>
        </div>
        ${node.allegiance ? `<div style="font-size: 12px; color: #ffd479; margin-bottom: 6px;"><b>Allegiance:</b> ${node.allegiance}</div>` : ''}
        ${node.loreSnippet ? `<p style="font-size: 12px; color: #94a3b8; margin: 4px 0 10px; font-style: italic; line-height: 1.4;">"${node.loreSnippet}"</p>` : ''}
        ${node.wikiUrl ? `
          <div style="margin-bottom: 10px;">
            <a href="${node.wikiUrl}" target="_blank" rel="noopener noreferrer" class="citadel-popup-wiki-btn" title="View historical records and lore on the Wiki of Westeros">
              <span style="display: flex; align-items: center; gap: 5px;">
                <span>📜</span>
                <span>Wiki of Westeros Details</span>
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>
        ` : ''}
        <div class="citadel-popup-actions">
          <button type="button" class="citadel-popup-btn citadel-popup-btn-origin" style="font-size: 12px; padding: 6px 10px;">
            ${isOrigin ? '✓ Departure' : 'Set Departure'}
          </button>
          <button type="button" class="citadel-popup-btn citadel-popup-btn-dest" style="font-size: 12px; padding: 6px 10px;">
            ${isDestination ? '✓ Arrival' : 'Set Arrival'}
          </button>
          <button type="button" class="citadel-popup-btn ${isWaypoint ? 'citadel-popup-btn-way-active' : 'citadel-popup-btn-way'}" style="font-size: 12px; padding: 6px 10px;">
            ${isWaypoint ? `✕ Remove Stop ${wpIndex + 1}` : '+ Add Stop'}
          </button>
        </div>
      `;

      // Prevent clicks/drags inside popup from bubbling to the Leaflet map
      L.DomEvent.disableClickPropagation(popupDiv);
      L.DomEvent.disableScrollPropagation(popupDiv);

      const wikiLink = popupDiv.querySelector('.citadel-popup-wiki-btn') as HTMLAnchorElement | null;
      if (wikiLink) {
        L.DomEvent.on(wikiLink, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
        });
      }

      const btnOrig = popupDiv.querySelector('.citadel-popup-btn-origin') as HTMLButtonElement | null;
      const btnDest = popupDiv.querySelector('.citadel-popup-btn-dest') as HTMLButtonElement | null;
      const btnWay = popupDiv.querySelector(isWaypoint ? '.citadel-popup-btn-way-active' : '.citadel-popup-btn-way') as HTMLButtonElement | null;

      if (btnOrig) {
        L.DomEvent.on(btnOrig, 'click', (e) => {
          L.DomEvent.stop(e);
          onSelectNode(id, 'origin');
          marker.closePopup();
        });
      }

      if (btnDest) {
        L.DomEvent.on(btnDest, 'click', (e) => {
          L.DomEvent.stop(e);
          onSelectNode(id, 'destination');
          marker.closePopup();
        });
      }

      if (btnWay) {
        L.DomEvent.on(btnWay, 'click', (e) => {
          L.DomEvent.stop(e);
          onSelectNode(id, 'waypoint');
          marker.closePopup();
        });
      }

      marker.bindPopup(popupDiv, { className: 'citadel-popup' });

      // Direct 1-click selection during map picking mode
      marker.on('click', (e) => {
        const currentTarget = mapPickingTargetRef.current;
        if (currentTarget) {
          L.DomEvent.stop(e);
          marker.closePopup();
          const targetRole =
            currentTarget.type === 'origin'
              ? 'Departure Point'
              : currentTarget.type === 'destination'
                ? 'Arrival Point'
                : `Intermediate Stop ${currentTarget.index + 1}`;
          showToast(`✓ ${node.name} selected as ${targetRole}`);
          if (onNodePickedRef.current) {
            onNodePickedRef.current(id, currentTarget);
          }
        }
      });

      marker.on('popupopen', () => {
        if (mapPickingTargetRef.current) {
          marker.closePopup();
        }
      });

      // Double-click provides quick route convenience while single click opens info popup
      marker.on('dblclick', (e) => {
        L.DomEvent.stop(e);
        onQuickRoute(id);
      });
    }
  }, [originId, destinationId, waypointIds, onSelectNode, onQuickRoute, showToast, showLabels]);

  // Smooth Zoom in on Chosen City with Radar Beacon and Popup
  useEffect(() => {
    if (!focusedCity) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const node = NODES[focusedCity.id];
    if (!node) return;

    const latLng = toLeafletLatLng(node.coords);

    // Smoothly fly camera to chosen city
    map.flyTo(latLng, 0, {
      duration: 1.3,
      easeLinearity: 0.25
    });

    // Auto-open city marker popup after camera arrives
    let popupOpened = false;
    const openPopupHandler = () => {
      if (popupOpened) return;
      popupOpened = true;
      const currentMarker = markersRef.current[focusedCity.id];
      if (currentMarker) {
        currentMarker.openPopup();
      }
    };

    map.once('moveend', openPopupHandler);
    const popupTimer = setTimeout(openPopupHandler, 1400);

    // Glowing Radar Beacon Pulse Animation
    const beaconIcon = L.divIcon({
      html: `<div class="citadel-city-beacon"></div>`,
      className: 'custom-beacon-div-icon',
      iconSize: [80, 80],
      iconAnchor: [40, 40]
    });

    const beacon = L.marker(latLng, { icon: beaconIcon, zIndexOffset: 3000 }).addTo(map);

    const timer = setTimeout(() => {
      if (map.hasLayer(beacon)) {
        map.removeLayer(beacon);
      }
    }, 3200);

    return () => {
      map.off('moveend', openPopupHandler);
      clearTimeout(popupTimer);
      clearTimeout(timer);
      if (map.hasLayer(beacon)) {
        map.removeLayer(beacon);
      }
    };
  }, [focusedCity]);

  // Render Curved Route Polylines, Directional Chevrons & Animated Traveler Token
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayersRef.current;
    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    if (!routeResult || routeResult.legs.length === 0) return;

    const isDragonRoute = routeResult.party.id === 'dragon' || routeResult.mode === 'dragon';
    const isCrowRoute = routeResult.party.id === 'crow' || routeResult.party.id === 'raven' || routeResult.mode === 'crow_flight';

    let ambientGlowColor = '#dfb15b';
    if (isDragonRoute) ambientGlowColor = '#ef4444';
    else if (isCrowRoute) ambientGlowColor = '#a855f7';

    // Draw background outer ambient glow for entire path
    const glowPolyline = L.polyline(routeResult.allCoordinates, {
      color: ambientGlowColor,
      weight: 10,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(routeGroup);

    // Draw each leg with thematic glowing stroke & directional chevrons
    for (const leg of routeResult.legs) {
      let legColor = '#f59e0b'; // Consistent gold/amber for overland travel
      let dashClass = 'route-flowing-land';
      let weight = 4.5;

      if (leg.segmentType === 'sea') {
        legColor = '#06b6d4'; // Luminous ocean-cyan for maritime corridors
        dashClass = 'route-flowing-sea';
        weight = 4;
      } else if (leg.segmentType === 'flight') {
        const isDragon = leg.edge.name.toLowerCase().includes('dragon') || isDragonRoute;
        legColor = isDragon ? '#ef4444' : '#c084fc'; // Crimson strictly for dragon, radiant purple strictly for crow/raven
        dashClass = isDragon ? 'route-flowing-flight' : 'route-flowing-crow';
        weight = 3.5;
      }

      const legPolyline = L.polyline(leg.waypoints, {
        color: legColor,
        weight,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        className: dashClass
      }).addTo(routeGroup);

      // Leg hover tooltip with terrain lore and speed calibration
      const terrainLabel = leg.terrainType.replace('_', ' ');
      const terrainMod = TERRAIN_MODIFIERS[leg.terrainType]?.speedMultiplier || 1.0;
      legPolyline.bindTooltip(`
        <div style="font-family: 'Cinzel', serif; padding: 3px;">
          <b style="font-size: 13px; color: ${legColor};">${leg.edge.name}</b><br>
          <span style="font-size: 12px; color: #f4ecd8; font-family: 'Inter', sans-serif;">${leg.distanceMiles} miles (${leg.distanceKm} km) • ~${leg.transitDays} days</span><br>
          <span style="font-size: 11px; color: #94a3b8; font-family: 'Inter', sans-serif; text-transform: capitalize;">Terrain: ${terrainLabel} (${terrainMod}x speed modifier)</span>
        </div>
      `, {
        sticky: true,
        direction: 'top',
        className: 'citadel-tooltip'
      });

      // Place Repeating Directional Chevron Arrows along the forward path
      if (leg.waypoints.length >= 2) {
        let cumulativeDist = 0;
        const subsegments: { p1: [number, number]; p2: [number, number]; len: number; startDist: number }[] = [];
        for (let i = 0; i < leg.waypoints.length - 1; i++) {
          const p1 = leg.waypoints[i];
          const p2 = leg.waypoints[i + 1];
          const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
          if (len > 0.001) {
            subsegments.push({ p1, p2, len, startDist: cumulativeDist });
            cumulativeDist += len;
          }
        }

        if (subsegments.length > 0) {
          const chevronSpacing = 65; // Coordinate units between chevrons
          const count = Math.max(1, Math.floor(cumulativeDist / chevronSpacing));
          const step = cumulativeDist / (count + 1);

          for (let c = 1; c <= count; c++) {
            const targetDist = c * step;
            const sub = subsegments.find(s => targetDist >= s.startDist && targetDist <= s.startDist + s.len) || subsegments[subsegments.length - 1];
            const t = Math.max(0, Math.min(1, (targetDist - sub.startDist) / sub.len));
            const lat = sub.p1[0] + (sub.p2[0] - sub.p1[0]) * t;
            const lng = sub.p1[1] + (sub.p2[1] - sub.p1[1]) * t;

            // Screen angle: screen X increases right (+lng), screen Y increases downward (-lat)
            const screenDx = sub.p2[1] - sub.p1[1];
            const screenDy = sub.p1[0] - sub.p2[0];
            const angleDeg = Math.round((Math.atan2(screenDy, screenDx) * 180) / Math.PI);

            const chevronIcon = L.divIcon({
              className: 'route-chevron-icon',
              html: `
                <div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; transform: rotate(${angleDeg}deg); transform-origin: center; pointer-events: none;">
                  <svg width="14" height="14" viewBox="0 0 14 14" style="filter: drop-shadow(0 0 3px rgba(0,0,0,0.95));">
                    <path d="M 4 2 L 10 7 L 4 12" fill="none" stroke="${legColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              `,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            L.marker([lat, lng], { icon: chevronIcon, interactive: false }).addTo(routeGroup);
          }
        }
      }
    }

    // Intermediate Stage Milestone Badges
    if (routeResult.journeyStages && routeResult.journeyStages.length > 1) {
      for (const stage of routeResult.journeyStages) {
        if (stage.stageIndex < routeResult.journeyStages.length) {
          const latLng = toLeafletLatLng(stage.toNode.coords);
          const stageBadge = L.divIcon({
            className: 'citadel-stage-milestone-icon',
            html: `
              <div style="background: rgba(15, 23, 42, 0.92); border: 1px solid #dfb15b; color: #ffd479; border-radius: 12px; padding: 2px 8px; font-size: 10px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.8); pointer-events: none; font-family: 'Cinzel', serif;">
                Stage ${stage.stageIndex} • ${stage.distanceMiles} mi
              </div>
            `,
            iconSize: [90, 20],
            iconAnchor: [45, -12]
          });
          L.marker(latLng, { icon: stageBadge, interactive: false, zIndexOffset: 2500 }).addTo(routeGroup);
        }
      }
    }

    // Animated Traveling Heraldic Token
    let animId: number | null = null;
    const allCoords = routeResult.allCoordinates;

    if (allCoords.length >= 2) {
      const dists: number[] = [0];
      for (let i = 1; i < allCoords.length; i++) {
        const d = Math.hypot(allCoords[i][0] - allCoords[i - 1][0], allCoords[i][1] - allCoords[i - 1][1]);
        dists.push(dists[i - 1] + d);
      }
      const totalDist = dists[dists.length - 1];

      if (totalDist > 0.1) {
        // Map each polyline coordinate segment to its corresponding leg for dynamic multimodal adaptation
        const legPerSegment: (typeof routeResult.legs[0])[] = [];
        for (const leg of routeResult.legs) {
          const segCount = leg.waypoints.length - 1;
          for (let s = 0; s < segCount; s++) {
            legPerSegment.push(leg);
          }
        }

        let defaultPartyEmoji = '👑';
        let defaultTokenBg = 'radial-gradient(circle, #f59e0b 0%, #78350f 100%)';
        let defaultTokenBorder = '#ffd700';

        if (routeResult.party.id === 'dragon' || isDragonRoute) {
          defaultPartyEmoji = '🐉';
          defaultTokenBg = 'radial-gradient(circle, #ef4444 0%, #7f1d1d 100%)';
          defaultTokenBorder = '#f87171';
        } else if (routeResult.party.id === 'crow' || routeResult.party.id === 'raven' || isCrowRoute) {
          defaultPartyEmoji = '🦅';
          defaultTokenBg = 'radial-gradient(circle, #a855f7 0%, #581c87 100%)';
          defaultTokenBorder = '#c084fc';
        } else if (routeResult.party.id === 'fleet' || routeResult.party.id === 'war_galley' || routeResult.mode === 'sea_only') {
          defaultPartyEmoji = '⛵';
          defaultTokenBg = 'radial-gradient(circle, #06b6d4 0%, #0e7490 100%)';
          defaultTokenBorder = '#38bdf8';
        } else if (routeResult.party.id === 'army' || routeResult.party.id === 'host') {
          defaultPartyEmoji = '🛡️';
          defaultTokenBg = 'radial-gradient(circle, #e11d48 0%, #881337 100%)';
          defaultTokenBorder = '#fb7185';
        } else if (routeResult.party.id === 'courier' || routeResult.party.id === 'fast_courier') {
          defaultPartyEmoji = '🐎';
          defaultTokenBg = 'radial-gradient(circle, #10b981 0%, #065f46 100%)';
          defaultTokenBorder = '#34d399';
        }

        const createTravelerIcon = (emoji: string, bg: string, border: string) => L.divIcon({
          className: 'route-traveler-div-icon',
          html: `
            <div class="citadel-traveler-token" title="Expedition in Transit: ${routeResult.party.name}">
              <div class="citadel-traveler-pulse" style="border-color: ${border}; box-shadow: 0 0 12px ${border};"></div>
              <div class="citadel-traveler-core" style="background: ${bg}; border: 2px solid ${border};">
                <span style="font-size: 13px; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));">${emoji}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const initialLeg = legPerSegment[0] || routeResult.legs[0];
        let currentMode = initialLeg.segmentType;
        let activeEmoji = (currentMode === 'sea') ? '⛵' : defaultPartyEmoji;
        let activeBg = (currentMode === 'sea') ? 'radial-gradient(circle, #06b6d4 0%, #0e7490 100%)' : defaultTokenBg;
        let activeBorder = (currentMode === 'sea') ? '#38bdf8' : defaultTokenBorder;

        const travelerMarker = L.marker(allCoords[0], {
          icon: createTravelerIcon(activeEmoji, activeBg, activeBorder),
          zIndexOffset: 4000,
          interactive: false
        }).addTo(routeGroup);

        const journeyDurationMs = Math.max(8000, Math.min(20000, totalDist * 12));
        const startTime = performance.now();

        const stepAnimation = (now: number) => {
          const elapsed = (now - startTime) % journeyDurationMs;
          const currentProgress = elapsed / journeyDurationMs;
          const targetDist = currentProgress * totalDist;

          let segIdx = 1;
          while (segIdx < dists.length && dists[segIdx] < targetDist) {
            segIdx++;
          }
          if (segIdx >= dists.length) segIdx = dists.length - 1;

          // Adapt token appearance if traveler enters sea vs land vs aerial transit
          const activeLeg = legPerSegment[segIdx - 1] || routeResult.legs[0];
          if (activeLeg && activeLeg.segmentType !== currentMode) {
            currentMode = activeLeg.segmentType;
            if (currentMode === 'sea') {
              activeEmoji = '⛵';
              activeBg = 'radial-gradient(circle, #06b6d4 0%, #0e7490 100%)';
              activeBorder = '#38bdf8';
            } else if (currentMode === 'flight') {
              activeEmoji = isDragonRoute ? '🐉' : '🦅';
              activeBg = isDragonRoute ? 'radial-gradient(circle, #ef4444 0%, #7f1d1d 100%)' : 'radial-gradient(circle, #a855f7 0%, #581c87 100%)';
              activeBorder = isDragonRoute ? '#f87171' : '#c084fc';
            } else {
              activeEmoji = defaultPartyEmoji;
              activeBg = defaultTokenBg;
              activeBorder = defaultTokenBorder;
            }
            travelerMarker.setIcon(createTravelerIcon(activeEmoji, activeBg, activeBorder));
          }

          const d0 = dists[segIdx - 1];
          const d1 = dists[segIdx];
          const segSpan = d1 - d0;
          const t = segSpan > 0.0001 ? (targetDist - d0) / segSpan : 0;

          const p0 = allCoords[segIdx - 1];
          const p1 = allCoords[segIdx];

          const curLat = p0[0] + (p1[0] - p0[0]) * t;
          const curLng = p0[1] + (p1[1] - p0[1]) * t;

          travelerMarker.setLatLng([curLat, curLng]);
          animId = requestAnimationFrame(stepAnimation);
        };

        animId = requestAnimationFrame(stepAnimation);
      }
    }

    // Smoothly fly map to fit the route
    map.flyToBounds(glowPolyline.getBounds(), {
      padding: [80, 80],
      duration: 1.2,
      maxZoom: 0
    });

    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [routeResult]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
      }}
      className={mapPickingTarget ? 'citadel-map-picking-active' : ''}
    >
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />


      {/* Top Floating Picking HUD Banner */}
      {mapPickingTarget && (
        <div className="citadel-picking-hud">
          <span style={{ fontSize: 16 }}>📍</span>
          <span style={{ fontSize: 13, color: 'var(--text-parchment)', fontWeight: 600 }}>
            {mapPickingTarget.type === 'origin' && 'Select Departure Point — Click any settlement on the map'}
            {mapPickingTarget.type === 'destination' && 'Select Arrival Point — Click any settlement on the map'}
            {mapPickingTarget.type === 'waypoint' && `Select Intermediate Stop ${mapPickingTarget.index + 1} — Click any settlement on the map`}
          </span>
          {onCancelPicking && (
            <button
              type="button"
              onClick={onCancelPicking}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                borderRadius: 14,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                marginLeft: 8
              }}
            >
              Cancel (Esc)
            </button>
          )}
        </div>
      )}

      {/* Citadel Bottom-Right Dock: Telemetry HUD & Cartography Layers */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          pointerEvents: 'none'
        }}
      >
        {/* Live Citadel Telemetry HUD */}
        <TelemetryHUD telemetry={cursorTelemetry} />

        {/* Citadel Cartography Layer Toggle Widget */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
            pointerEvents: 'auto'
          }}
        >
          {layerPanelOpen && (
          <div
            style={{
              background: 'var(--bg-panel, rgba(16, 22, 31, 0.95))',
              border: '1px solid var(--border-gold-glow, rgba(223, 177, 91, 0.4))',
              borderRadius: 12,
              padding: '14px 16px',
              width: 260,
              boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(223, 177, 91, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'var(--text-parchment, #f4ecd8)',
              fontFamily: "'Cinzel', serif"
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(223, 177, 91, 0.2)', paddingBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--text-gold, #dfb15b)' }}>
                <Layers size={16} />
                <span>Citadel Cartography</span>
              </div>
              <button
                type="button"
                onClick={() => setLayerPanelOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  fontSize: 16,
                  lineHeight: 1
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#dfb15b' }}>🛣️</span>
                  <span>Imperial Highways</span>
                </span>
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={(e) => setShowRoads(e.target.checked)}
                  style={{ accentColor: 'var(--border-gold, #c99738)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#0ea5e9' }}>⛵</span>
                  <span>Maritime Corridors</span>
                </span>
                <input
                  type="checkbox"
                  checked={showSeaLanes}
                  onChange={(e) => setShowSeaLanes(e.target.checked)}
                  style={{ accentColor: '#0ea5e9', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#f59e0b' }}>🏷️</span>
                  <span>Settlement Labels</span>
                </span>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  style={{ accentColor: 'var(--border-gold, #c99738)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#dfb15b' }}>🧭</span>
                  <span>World Graticules</span>
                </span>
                <input
                  type="checkbox"
                  checked={showGraticules}
                  onChange={(e) => setShowGraticules(e.target.checked)}
                  style={{ accentColor: 'var(--border-gold, #c99738)', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#06b6d4' }}>🌊</span>
                  <span>Water Mask & Land</span>
                </span>
                <input
                  type="checkbox"
                  checked={showWaterMask}
                  onChange={(e) => setShowWaterMask(e.target.checked)}
                  style={{ accentColor: '#06b6d4', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
        )}

          <button
            type="button"
            onClick={() => setLayerPanelOpen(!layerPanelOpen)}
            style={{
              background: layerPanelOpen ? 'var(--border-gold, #c99738)' : 'var(--bg-panel, rgba(16, 22, 31, 0.92))',
              border: '1px solid var(--border-gold-glow, rgba(223, 177, 91, 0.4))',
              color: layerPanelOpen ? '#0a0e14' : 'var(--text-parchment, #f4ecd8)',
              padding: '0 14px',
              height: 36,
              boxSizing: 'border-box',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
              transition: 'all 0.2s ease',
              fontFamily: "'Cinzel', serif"
            }}
            title="Toggle Cartography Overlay Layers"
          >
            <Layers size={16} />
            <span>Cartography Layers</span>
          </button>
        </div>
      </div>

      {/* Floating Confirmation Toast */}
      {toastMessage && (
        <div className="citadel-toast-notification">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
