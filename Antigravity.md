# Antigravity Agent Guidelines & Repository Specification

> **Repository:** The Known World Navigator (Citadel Route & Distance Engine)  
> **Platform:** Google Antigravity & Antigravity IDE  
> **Version Target:** React 19, TypeScript 6.0, Vite 8.3, Leaflet 1.9, Oxlint 1.81  
> **Scope:** Master architectural context, physics calibration, cartographic constraints, routing algorithms, coding conventions, and testing protocols for AI agents.

---

## 1. Executive Overview & Domain Context

**The Known World Navigator** is a high-precision cartographic and route calculation engine for George R. R. Martin's *A Song of Ice and Fire* / *Game of Thrones* universe. Built in the tradition of the Archmaesters of the Citadel of Oldtown, it models the known world across Westeros, Essos, the Summer Isles, and the lands Beyond the Wall.

### Core Capabilities
* **Realistic Multimodal Pathfinding:** Weighted Dijkstra and A* pathfinding incorporating canonical roads, mountain passes, causeways, sea lanes, and river crossings.
* **Physics & Scale Calibration:** Exact pixel-to-mile and pixel-to-league conversions calibrated against the 600-mile cartographer's scale bar and the canonical 300-mile length of the Wall.
* **Terrain & Party Travel Simulation:** Real-world transit time calculations accounting for party composition (Raven, Dragon, Royal Progress, Armored Host, Caravan, Fleet) and terrain speed multipliers (paved Valyrian roads to neck bogs and desert wastes).
* **Multi-Stop Itineraries & TSP Optimization:** Dynamic waypoint sequencing with Traveling Salesperson Problem (TSP) 2-opt permutations and backtracking detection.
* **Interactive Citadel Cartography:** Leaflet-powered 10,000 x 8,300 custom canvas rendering with glow effects, route elevation/terrain composition breakdowns, hazard alerts, and alternative route comparisons.

---

## 2. Technology Stack & Architecture

| Layer | Technology | Key Details & Version |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | `react` 19.2.8, `react-dom` 19.2.8 (Strict Mode, Modern Hooks) |
| **Language** | TypeScript 6.0 | Strict mode, full type coverage, zero implicit `any` |
| **Bundler & Server** | Vite 8.3 | HMR, ES modules, fast build pipeline (`tsc -b && vite build`) |
| **Cartography & Map** | Leaflet 1.9 | `L.CRS.Simple`, custom pixel coordinate projection, canvas layers |
| **Icons & Visuals** | Lucide React, Canvas Confetti | Consistent medieval/citadel glyphs and victory effects |
| **Styling** | Vanilla CSS | Bespoke Citadel Maester aesthetic (`src/index.css`), glassmorphism |
| **Linter** | Oxlint 1.81 | Ultra-fast Rust-based linter (`oxlint src`) |
| **Auditing & Test Runner** | `tsx` scripts | Graph reachability, hairpin angle auditing, TSP verification |

---

## 3. Cartography, Coordinates & Physics Calibration (CRITICAL)

### The Coordinate Spaces
The engine operates across two distinct coordinate spaces. **Agents must NEVER confuse or conflate them:**

```
                  [0, 0] ───────────────────────► [10000, 0] (x)
                    │                                 │
     Image Space    │   (0,0) is Top-Left             │
     [x, y]         │   Width:  10,000 px             │
                    │   Height:  8,300 px             │
                    ▼                                 ▼
                 [0, 8300] ─────────────────────► [10000, 8300]

                                  ▲
                                  │ toLeafletLatLng([x, y])   = [8300 - y, x]
                                  │ fromLeafletLatLng([lat,lng]) = [lng, 8300 - lat]
                                  ▼

                 [8300, 0] ─────────────────────► [8300, 10000]
                    ▲                                 ▲
     Leaflet Space  │   lat = MAP_HEIGHT - y          │
     CRS.Simple     │   lng = x                       │
     [lat, lng]     │   (0,0) is Bottom-Left          │
                    │                                 │
                  [0, 0] ───────────────────────► [0, 10000] (lng)
```

### Conversion API (`src/engine/scale.ts`)
* `toLeafletLatLng(coords: [number, number]): [number, number]`
  Converts `[x, y]` image space to `[lat, lng]` for Leaflet markers and polylines.
  Formula: `[MAP_HEIGHT - y, x]`
* `fromLeafletLatLng(latLng: [number, number]): [number, number]`
  Converts `[lat, lng]` back to `[x, y]` image space.
  Formula: `[lng, MAP_HEIGHT - lat]`

### Geodetic World Coordinate API (`src/engine/coordinates.ts`)
Calibrated via bivariate least-squares regression against the [ArcGIS Game of Thrones Spatial Dataset](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview) ([MapViewer](https://www.arcgis.com/apps/mapviewer/index.html?webmap=43d03779288048bfb5d3c46e4bc4ccb0)):
* `imageToWorld(coords: [number, number]): WorldCoordinate`
  Converts `[x, y]` to `{ latDeg, lngDeg, formattedLat, formattedLng, formattedFull }`.
  - Latitude: `latDeg = (7663.0 - y) / 86.97022` (aligned with canonical red line Equator at `y=7663.0`).
  - Longitude: `lngDeg = (x - 5972.0950764) / 68.6714114` (0° at Prime Meridian `x=5972.1`).
* `worldToImage(latDeg: number, lngDeg: number): [number, number]`
* `leafletToWorld(latLng: [number, number]): WorldCoordinate`
* `worldToLeaflet(latDeg: number, lngDeg: number): [number, number]`

### Physical Scale Calibration
* **Scale Bar Measurement:** 686 pixels = 600 miles.
* **Miles per Pixel:** `MILES_PER_PIXEL = 600 / 686` ≈ `0.8746355685 mi/px`
* **Leagues per Pixel:** `LEAGUES_PER_PIXEL = MILES_PER_PIXEL / 3.0` ≈ `0.291545 leagues/px` (1 league = 3 miles)
* **Kilometers per Pixel:** `KM_PER_PIXEL = MILES_PER_PIXEL * 1.609344` ≈ `1.4075895 km/px`
* **Canonical Anchor:** The Wall from Shadow Tower (`[1130, 1968]`) to Eastwatch-by-the-Sea (`[1470, 1968]`) = 340 px * (600 / 686) = **297.4 miles** (canonical ~300 miles).

### Waypoint Sanitization (`sanitizeRouteWaypoints`)
When generating or modifying route waypoints:
1. **Endpoint Snapping:** First point must equal `fromCoords`; last point must equal `toCoords`.
2. **Vector Projection Pruning:** Discard intermediate points projecting negatively behind the origin or past the destination along the overall leg vector.
3. **Hairpin Turn Elimination:** Iteratively prune sharp hairpin turns where the turn angle exceeds 95° (`angle > 95°`), preventing visual zigzagging on rendered map polylines.

---

## 4. Graph Network & Routing Engine

### Graph Topology & Composition
The routing graph is an undirected, weighted planar/spatial multigraph composed of three datasets:

```
┌───────────────────────────────────────────────────────────────┐
│                    Graph Composition                          │
├──────────────────────┬────────────────────────────────────────┤
│ Nodes (325+)         │ src/data/nodes.ts                      │
│ Major Roads (60+)    │ src/data/roads.ts                      │
│ Sea Lanes (40+)      │ src/data/seaLanes.ts                   │
│ Regional Connectors  │ src/data/regionalConnectors.ts         │
└──────────────────────┴────────────────────────────────────────┘
                               │
                               ▼
               pathfinder.ts: buildGraph()
                               │
                               ▼
       100% Reachability across all 325+ Canonical Nodes
```

1. **`NODES` (`src/data/nodes.ts`):** 325+ settlements, castles, ports, ruins, and crossroads across Westeros, Essos, Slaver's Bay, Dothraki Sea, Jade Sea, and Yi Ti.
   * Node attributes: `id`, `name`, `region`, `type`, `coords: [x, y]`, `isPort`, `allegiance`, `loreSnippet`.
2. **`ROADS` (`src/data/roads.ts`):** High-traffic overland arteries: Kingsroad, Roseroad, Ocean Road, Goldroad, River Road, Sea Road, High Road, Boneway, Prince's Pass, Demon Road, and Valyrian Stone Highways.
3. **`SEA_LANES` (`src/data/seaLanes.ts`):** Open-ocean and coastal maritime corridors: Sunset Sea, Narrow Sea, Summer Sea, Shivering Sea, Jade Sea, and Slaver's Bay passages.
4. **`REGIONAL_CONNECTORS` (`src/data/regionalConnectors.ts`):** Over 100 KB of secondary roads, spur tracks, river ferries, mountain defiles, and harbor approaches ensuring **100% graph reachability** (0 isolated settlements).

### Pathfinding Logic (`src/engine/pathfinder.ts`)
* **Dijkstra Search:** Evaluates edges based on cumulative transit cost.
* **Port Transitions:** Switching between land and sea segments incurs `PORT_TRANSITION_DAYS = 3.0` (docking, customs, loading supplies, rigging).
* **Direct Flight Logic (Crows & Dragons):**
  * `crow`: Straight-line direct rookery flight (`crow_flight`), speed 240 mi/day, ignoring topography.
  * `dragon`: High-altitude aerial flight (`dragon`), speed 520 mi/day, soaring over mountain barriers and oceans.
* **Routing Preferences:**
  * `balanced`: Optimal blend of overland roads and maritime transit.
  * `land_only`: Strictly forbids maritime corridors (returns null if water crossing required).
  * `sea_only`: Strictly enforces coastal/sea corridors.
  * `crow_flight`: Synthetic direct flight for ravens.
  * `dragon`: High-speed direct dragon flight.
* **Optimization Goals:**
  * `balanced`: Standard trade-off between total miles and transit days.
  * `shortest`: Pure distance minimization (miles).
  * `fastest`: Transit time minimization (days), aggressively utilizing paved highways and fair-wind sea lanes.

### TSP Multi-Stop Optimization
* When 2+ intermediate waypoints are provided, `optimizeWaypointOrder` computes optimal permutations to prevent backtracking.
* If manual ordering results in > 15 miles of avoidable travel, the engine flags `isSuboptimalOrder = true` and reports `potentialSavingsMiles` and `potentialSavingsDays`.

---

## 5. Travel Parties & Terrain Physics

### Travel Parties (`src/engine/parties.ts`)

| Party ID | Name | Land Speed | Sea Speed | Can Fly | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `messenger` | Fast Courier / Raven Rider | 58 mi/day | 90 mi/day | No | Lone rider with fresh post-horse relays |
| `retinue` | Noble Retinue / Royal Progress | 18 mi/day | 95 mi/day | No | Heavy wheelhouses, litters, baggage carts |
| `army` | Marching Host / Army | 12 mi/day | 75 mi/day | No | Foot infantry, supply trains, siege engines |
| `caravan` | Merchant Caravan | 15 mi/day | 100 mi/day | No | Pack mules, spice wagons, armed sellswords |
| `fleet` | War Galley / Sailing Fleet | 14 mi/day | 115 mi/day | No | Oared war galleys and triple-masted cogs |
| `crow` | Messenger Crow / Raven | 240 mi/day | 240 mi/day | **Yes** | Direct flight ("as the crow flies") |
| `dragon` | Dragon Flight (e.g. Balerion) | 520 mi/day | 520 mi/day | **Yes** | High-altitude supersonic beast flight |

### Terrain Modifiers (`TERRAIN_MODIFIERS`)

| Terrain Type | Multiplier | Visual Color | Real-World Lore Context |
| :--- | :--- | :--- | :--- |
| `paved_highway` | **1.25x** | `#8b5cf6` | Valyrian dragon-fused basalt highway |
| `royal_road` | **1.10x** | `#dfb15b` | Kingsroad, Roseroad, coaching waystations |
| `dirt_track` | **1.00x** | `#94a3b8` | Standard unpaved cart road |
| `northern_snow` | **0.65x** | `#38bdf8` | Deep northern drifts, freezing ruts |
| `mountain_pass` | **0.60x** | `#ef4444` | High Road, Prince's Pass, rockfalls |
| `desert_waste` | **0.50x** | `#f97316` | Red Waste, scorching sun, dry wells |
| `swamp_causeway`| **0.45x** | `#10b981` | The Neck bog, crannogmen, sunken ruts |
| `coastal_sea` | **1.00x** | `#0ea5e9` | Standard coastal navigable waters |
| `fair_winds` | **1.30x** | `#06b6d4` | Steady trade wind passages (Jade Sea) |
| `dangerous_sea` | **0.70x** | `#ec4899` | Stepstones pirate waters, Shipbreaker Bay |

---

## 6. Directory Structure & File Map

```
GOT/
├── Antigravity.md              # THIS FILE: Master Agent Specification
├── AGENTS.md                   # Hierarchical agent rules mirror
├── package.json                # Scripts and dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript base config
├── tsconfig.app.json           # Client TypeScript configuration (strict)
├── .oxlintrc.json              # Oxlint rules configuration
├── public/
│   ├── map_known_world.jpg     # High-resolution raster map (10000x8300)
│   └── favicon.ico
├── src/
│   ├── main.tsx                # React DOM mount point
│   ├── App.tsx                 # Root application state & coordination
│   ├── index.css               # Citadel Maester design system & theme tokens
│   ├── types/
│   │   └── index.ts            # Canonical domain TypeScript definitions
│   ├── engine/
│   │   ├── scale.ts            # Map coordinate math & waypoint sanitization
│   │   ├── parties.ts          # Travel party parameters & terrain modifiers
│   │   └── pathfinder.ts       # Dijkstra, A*, TSP & route alternative engine
│   ├── data/
│   │   ├── nodes.ts            # 325+ canonical settlements & pixel coords
│   │   ├── roads.ts            # Major overland highway waypoints
│   │   ├── seaLanes.ts         # Maritime shipping corridors
│   │   ├── regionalConnectors.ts # Regional spur routes ensuring 100% reachability
│   │   ├── presets.ts          # Canonical lore journeys (Robert's progress, etc.)
│   │   └── regions.ts          # Realm definitions, capital IDs, theme colors
│   └── components/
│       ├── MapCanvas.tsx       # Leaflet CRS.Simple map canvas & polyline render
│       ├── CitadelSidebar.tsx  # Master tabbed drawer (Route, Ledger, Directory)
│       ├── RoutePlanner.tsx    # Origin, Destination, Waypoints, Party selector
│       ├── JourneyBreakdown.tsx# Granular stage-by-stage itinerary & terrain stats
│       ├── CitySearch.tsx      # Fuzzy settlement directory & zoom-to-city
│       ├── RouteComparison.tsx # Alternative route strategies side-by-side
│       ├── PartySpeedInfoModal.tsx # Scholarly Citadel treatise on travel speeds
│       ├── RightDrawer.tsx     # Auxiliary telemetry drawer
│       ├── Header.tsx          # Top navigation bar & quick links
│       ├── Legend.tsx          # Map symbology & road type legend
│       └── QuickPresets.tsx    # Historical journey selector chips
└── scripts/
    ├── verify_all_nodes_routing.ts  # 100% reachability & random pair test suite
    ├── audit_all_routes.ts          # Waypoint geometry & hairpin turn auditor
    ├── check_nodes_and_connectivity.ts # Graph component analyzer
    └── test_all_pairs.ts            # Exhaustive pathfinding stress tester
```

---

## 7. Development Commands & Verification Runbook

AI agents operating on this repository must verify their work using these commands:

### Key Commands

```bash
# 1. Start development server (port 5173)
npm run dev

# 2. Typecheck and production bundle build (MUST PASS WITH 0 ERRORS)
npm run build

# 3. Static code analysis (Oxlint)
npm run lint

# 4. Full Route Verification & Graph Audit (MUST PASS 100%)
npm test

# 5. Preview production build locally
npm run preview
```

### Verification Scripts
* **`npm test`**: Executes both:
  1. `tsx scripts/verify_all_nodes_routing.ts`: Tests previously isolated nodes, multi-stop itineraries, and 200 random node pairs across all 325 settlements. **Requirement: 100% success rate (200/200 pairs routed).**
  2. `tsx scripts/audit_all_routes.ts`: Scans all 60+ roads and 40+ sea lanes for missing endpoints, turn angles > 95°, and path-to-straight distance ratios.
* **`npx tsx scripts/check_nodes_and_connectivity.ts`**: Verifies node IDs and checks connected components.

---

## 8. Mandatory Agent Rules of Engagement

Agents working on this repository must adhere to the following rules:

### Rule 1: Coordinate Integrity
* Never pass Leaflet coordinates `[lat, lng]` to functions expecting image coordinates `[x, y]`, or vice versa.
* All data files (`nodes.ts`, `roads.ts`, `seaLanes.ts`, `regionalConnectors.ts`) strictly use `[x, y]` image space.
* Leaflet components (`MapCanvas.tsx`) strictly consume `[lat, lng]` produced via `toLeafletLatLng([x, y])`.

### Rule 2: Graph Connectivity Guarantee (100% Reachability)
* Every node in `NODES` must be reachable from any other node via at least one valid path.
* When adding a new node to `src/data/nodes.ts`, you **must** also add at least one connecting edge in `src/data/regionalConnectors.ts` or `src/data/roads.ts`.
* Run `npm test` after any graph data modification to verify reachability.

### Rule 3: Zero Build & Linter Errors
* Never leave unused imports, unhandled type mismatches, or implicit `any` types.
* `npm run build` runs `tsc -b && vite build`. Any unused import (e.g. `TS6133`) will fail the build.
* Always verify that `npm run build` exits with code 0 before completing any task.

### Rule 4: Citadel Maester Aesthetic Standards
* Maintain the dark fantasy, antique brass, parchment, and slate aesthetic.
* Use existing design tokens in `src/index.css` (`--bg-primary`, `--accent-gold`, `--text-primary`, `--border-stone`).
* Avoid bright, generic primary colors. Use muted, thematic hues matching the heraldic regions of Westeros and Essos.

### Rule 5: Non-Destructive Edits
* Preserve all lore snippets, node allegiances, historical notes, and preset journeys.
* Do not remove existing test scripts or bypass pathfinding verification checks.

---

## 9. Common Pitfalls & How to Avoid Them

| Pitfall | Root Cause | Solution |
| :--- | :--- | :--- |
| **`TS6133: 'Symbol' is declared but its value is never read`** | Unused import left during refactoring | Remove unused imports immediately; run `npm run build` to verify. |
| **Inverted Leaflet Map Coordinates** | Passing `[x, y]` directly to `L.polyline` or `L.marker` | Always transform with `toLeafletLatLng([x, y])`. Leaflet expects `[8300 - y, x]`. |
| **Isolated Node / Failed Route** | Adding a node to `nodes.ts` without connecting edges | Add matching connector edges in `src/data/regionalConnectors.ts`. Run `npm test`. |
| **Jagged / Zigzag Polylines** | Raw waypoints containing acute hairpin turns | Run through `sanitizeRouteWaypoints(waypoints, from, to)`. |
| **Vite Chunk Size Warnings** | Large static graph datasets in single bundle | Acceptable for cartographic client data; dynamic imports can be added if needed. |

---

*Last Updated: Citadel Maester Cartography Engine v2.0*
