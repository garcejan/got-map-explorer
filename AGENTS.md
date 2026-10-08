# Antigravity Agent Guidelines & Master Repository Specification

> **Repository:** The Known World Navigator (`got-map-explorer`)  
> **Platform:** Google Antigravity & Antigravity IDE  
> **Version Target:** React 19.2+, TypeScript 6.0+, Vite 8.3+, Leaflet 1.9+, Oxlint 1.81+  
> **Scope:** Consolidated master specification, coordinate math, routing graph topology, travel party mechanics, terrain calibration, design tokens, coding conventions, and verification protocols for AI agents.

---

## 1. Quick Reference & Core Invariants (CRITICAL)

All AI agents, subagents, and automated workflows operating in this repository must strictly adhere to these core invariants:

1. **Coordinate System Invariant:**
   * **Image Space:** `[x, y]` in `10 000 x 8 300` px space (`[0, 0]` is Top-Left).
   * **Leaflet Space:** `[lat, lng]` in `CRS.Simple` where `lat = 8300 - y` and `lng = x` (`[0, 0]` is Bottom-Left).
   * **Mandatory Conversions:** Always use `toLeafletLatLng([x, y])` and `fromLeafletLatLng([lat, lng])` from [scale.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/scale.ts).
   * **Strict Boundary:** Never pass Leaflet `[lat, lng]` into data files or engine calculations, and never pass raw image `[x, y]` to Leaflet map layers.

2. **Graph Connectivity Invariant:**
   * All 325+ settlements in [nodes.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/nodes.ts) must maintain **100% reachability** across all modes.
   * Whenever adding a node to `nodes.ts`, you **must** immediately add connecting edges in [regionalConnectors.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/regionalConnectors.ts) or [roads.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/roads.ts).
   * Verify using `npm test`. Zero isolated nodes are permitted.

3. **Strict Build & Quality Gates:**
   * **Build:** `npm run build` (`tsc -b && vite build`) must pass with **0 errors**. Unused imports (`TS6133`) fail the build.
   * **Lint:** `npm run lint` (`oxlint src`) must pass without new errors.
   * **Tests:** `npm test` runs `audit_collisions.ts`, `verify_all_nodes_routing.ts`, and `audit_all_routes.ts`. All test suites must pass with **100% success rate**.

4. **Code Complexity & Script Execution Invariant:**
   * Rather than generating long shell commands, complex pipes, or `.sh` scripts, create an executable Python (`.py`) or Node.js (`.js`/`.ts`) script in `scripts/` or your scratch directory.
   * Execute the script with `python3` or `node`/`npx tsx`, inspect the output, and clean up temporary scripts upon completion.

5. **Branching, Logical PR Clustering & Mandatory User Checkpoint (CRITICAL):**
   * **Mandatory PR Invariant:** Direct pushes to `main` are strictly blocked by GitHub ruleset GH013 ("Changes must be made through a pull request"). Every change without exception must be merged through a Pull Request.
   * **Logical Clustering Invariant:** Do NOT create a separate PR for every trivial line or file edit. Group and cluster related tasks into a cohesive thematic branch (`feat/<cluster-name>`, `fix/<cluster-name>`, `chore/<cluster-name>`). Commit atomically per sub-task.
   * **Mandatory Conversational Checkpoint:** In agent conversations, whenever a task or feature implementation is completed, the agent **MUST ALWAYS ask the user**:
     > *"Are there other features or adjustments you would like to implement in this cluster, or would you like me to go ahead and create the Pull Request now?"*
   * **Automated Delivery:** Once confirmed or instructed by the user, execute `npm run pr` (`npx tsx scripts/create_pr.ts`). It automatically validates all quality gates, pushes the branch, and generates the PR targeting `main`.

6. **Parallel Subagent Decomposition:**
   * For complex, modular, or multi-file tasks, actively decompose workloads into independent sub-tasks and spawn subagents to execute them in parallel wherever sequential dependencies do not exist.

---

## 2. Executive Overview & Domain Context

**The Known World Navigator** is a high-precision cartographic and route calculation engine for George R. R. Martin's *A Song of Ice and Fire* / *Game of Thrones* universe. Built in the tradition of the Archmaesters of the Citadel of Oldtown, it models the known world across Westeros, Essos, the Summer Isles, and the lands Beyond the Wall.

### Core Capabilities
* **Realistic Multimodal Pathfinding:** Weighted Dijkstra and A* pathfinding incorporating canonical royal highways, mountain passes, causeways, sea lanes, and river crossings.
* **Physics & Scale Calibration:** Exact pixel-to-mile, pixel-to-league, and pixel-to-kilometer conversions calibrated against the 600-mile cartographer's scale bar and the canonical 300-mile length of the Wall.
* **Terrain & Party Travel Simulation:** Real-world transit time calculations accounting for party composition (Raven, Dragon, Royal Progress, Armored Host, Caravan, Fleet) and terrain speed multipliers (paved Valyrian roads to neck bogs and desert wastes).
* **Multi-Stop Itineraries & TSP Optimization:** Dynamic waypoint sequencing with Traveling Salesperson Problem (TSP) 2-opt permutations and backtracking detection.
* **Interactive Citadel Cartography:** Leaflet-powered 10 000 x 8 300 custom canvas rendering with glow effects, route elevation/terrain composition breakdowns, hazard alerts, alternative route comparisons, and dynamic animated traveler tokens.
* **Geodetic World Coordinates:** Real-world latitude and longitude projection calibrated against the ArcGIS Game of Thrones Spatial Dataset.
* **Water Navigation & Bathymetry:** O(1) raster land/water classification and obstacle-avoiding maritime routing.
* **Major Historical Battles Layer:** Interactive tactical battle sites (Trident, Blackwater, Field of Fire, Redgrass Field, etc.) with commanders, combatant factions, casualties, outcomes, and lore wiki links.

---

## 3. Technology Stack & Architecture

| Layer | Technology | Key Details & Version | Role |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 19 | `react` 19.2.8, `react-dom` 19.2.8 | Component architecture, portal dialogs, modern hooks |
| **Language** | TypeScript 6.0 | Strict mode (`tsconfig.app.json`), zero implicit `any` | Domain types, data integrity, compile-time safety |
| **Bundler & Server** | Vite 8.3 | `vite` 8.3.0, fast HMR, ES module pipeline | Production bundle (`tsc -b && vite build`) |
| **Cartography & Map** | Leaflet 1.9 | `leaflet` 1.9.4, `L.CRS.Simple`, custom projection | 10000x8300 canvas, vector polylines, layer controls |
| **Icons & Glyphs** | Lucide React | `lucide-react` 1.47.0 | Medieval, navigation, and UI glyphs |
| **Celebrations** | Canvas Confetti | `canvas-confetti` 1.9.4 | Route completion and milestone visual effects |
| **Styling & Tokens** | Modular CSS + TS | Bespoke Citadel Maester aesthetic (`src/styles/`) | Dual-theme (Dark Citadel & Parchment Beige), tokens |
| **Linter** | Oxlint 1.81 | `oxlint` 1.81.0, Rust-based ultra-fast linter | Code quality and hygiene (`npm run lint`) |
| **Test & Script Runner** | `tsx` | `tsx` 4.23.13 | Direct TypeScript execution for verification suites |
| **Spatial Precompute** | Python 3 | `scripts/precompute/*.py` | Raster costmaps, GIS projection, coordinate calibration |

---

## 4. Cartography, Coordinates & Physics Calibration (CRITICAL)

### The Coordinate Spaces
The engine operates across two distinct coordinate spaces. **Agents must NEVER confuse or conflate them:**

```
                  [0, 0] ───────────────────────► [10000, 0] (x)
                    │                                 │
     Image Space    │   (0,0) is Top-Left             │
     [x, y]         │   Width:  10 000 px             │
                    │   Height:  8 300 px             │
                    ▼                                 ▼
                 [0, 8300] ─────────────────────► [10000, 8300]

                                  ▲
                                  │ toLeafletLatLng([x, y])      = [8300 - y, x]
                                  │ fromLeafletLatLng([lat, lng]) = [lng, 8300 - lat]
                                  ▼

                 [8300, 0] ─────────────────────► [8300, 10000]
                    ▲                                 ▲
     Leaflet Space  │   lat = MAP_HEIGHT - y          │
     CRS.Simple     │   lng = x                       │
     [lat, lng]     │   (0,0) is Bottom-Left          │
                    │                                 │
                  [0, 0] ───────────────────────► [0, 10000] (lng)
```

### Conversion API ([src/engine/scale.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/scale.ts))
* `toLeafletLatLng(coords: [number, number]): [number, number]`
  Converts `[x, y]` image space to `[lat, lng]` for Leaflet markers and polylines:
  $$\text{lat} = 8300 - y, \quad \text{lng} = x$$
* `fromLeafletLatLng(latLng: [number, number]): [number, number]`
  Converts `[lat, lng]` back to `[x, y]` image space:
  $$x = \text{lng}, \quad y = 8300 - \text{lat}$$
* `pixelDistance(p1, p2): number` — Euclidean distance $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
* `calculatePathLengthPixels(waypoints): number` — Cumulative polyline pixel distance.

### Geodetic World Coordinate API ([src/engine/coordinates.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/coordinates.ts))
Calibrated via bivariate least-squares regression against the [ArcGIS Game of Thrones Spatial Dataset](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview):
* **Latitude Formula:**
  $$\text{latDeg} = \frac{7663.0 - y}{86.97022}$$
  * Canonical red Equator is at $y = 7663.0$ ($0^\circ$).
  * $1^\circ$ of latitude corresponds to $86.97022\text{ px}$.
* **Longitude Formula:**
  $$\text{lngDeg} = \frac{x - 5972.0950764}{68.6714114}$$
  * Prime Meridian ($0^\circ$) is at $x = 5972.095$.
  * $1^\circ$ of longitude corresponds to $68.67141\text{ px}$.

#### Key Canonical Parallels & Markers
| Parallel / Landmark | Latitude | Image Y | Leaflet Lat | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Arctic Circle** | 66.5° N | 1879.5 | 6420.5 | Beyond the Wall / Land of Always Winter |
| **Winterfell** | 54.86° N | 2892.0 | 5408.0 | Seat of House Stark |
| **White Harbor** | 50.17° N | 3300.0 | 5000.0 | Northern naval hub |
| **Riverrun** | 40.36° N | 4153.0 | 4147.0 | The Riverlands |
| **Tropic of Cancer** | 23.5° N | 5619.2 | 2680.8 | Summer Sea northern bounds |
| **Equator (Red Line)** | 0.0° | 7663.0 | 637.0 | Canonical printed red line |
| **Prime Meridian** | 0.0° | x = 5972.1 | lng = 5972.1 | Central reference longitude |

### Physical Scale Calibration
* **Scale Bar Measurement:** 686 pixels = 600 miles.
* **Miles per Pixel:** `MILES_PER_PIXEL = 600 / 686` $\approx 0.8746355685\text{ mi/px}$
* **Leagues per Pixel:** `LEAGUES_PER_PIXEL = MILES_PER_PIXEL / 3.0` $\approx 0.291545\text{ leagues/px}$ (1 league = 3 miles)
* **Kilometers per Pixel:** `KM_PER_PIXEL = MILES_PER_PIXEL * 1.609344` $\approx 1.4075895\text{ km/px}$
* **Canonical Anchor:** The Wall from Shadow Tower (`[1130, 1968]`) to Eastwatch-by-the-Sea (`[1470, 1968]`) = 340 px * (600 / 686) = **297.4 miles** (canonical ~300 miles).

### Waypoint Sanitization (`sanitizeRouteWaypoints`)
When generating or modifying route waypoints:
1. **Endpoint Snapping:** First point must equal `fromCoords`; last point must equal `toCoords`.
2. **Duplicate Pruning:** Remove sequential points with Euclidean distance $< 0.5\text{ px}$.
3. **Severe Hairpin Reversal Elimination:** Iteratively prune acute double-backs where turn angle exceeds 150° (`angle > 150°`), while strictly preserving natural geographic headland and river curves (90°–120°).

---

## 5. Water Navigation & Bathymetry Engine

Located in [src/engine/waterNav.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/waterNav.ts), this engine provides $O(1)$ land/water detection, bathymetric classification, and landmass-avoiding maritime routing:

* **Raster Grid Resolution:** $1250 \times 1038$ grid (downsampled $8\times$ from $10000 \times 8300$).
* **Binary Assets (`public/data/`):**
  * `water_mask.bin`: Binary traversability mask ($1 = \text{navigable water}$, $0 = \text{land}$).
  * `water_distance.bin`: Distance transform buffer encoding distance to nearest shoreline.
* **Bathymetric Classification:**
  * `land`: Non-traversable landmass.
  * `coastal_shelf`: Shallow water near shorelines (harbor approaches, straits).
  * `ocean`: Standard navigable open water.
  * `deep_ocean`: High-speed open sea corridors.
* **A\* Maritime Search:** Dynamically finds smooth paths across water bodies avoiding islands, peninsulas, and reefs.

---

## 6. Graph Network & Routing Engine

### Graph Topology & Composition
The routing graph is an undirected, weighted spatial multigraph composed of four integrated datasets:

```
┌───────────────────────────────────────────────────────────────┐
│                    Graph Composition                          │
├──────────────────────┬────────────────────────────────────────┤
│ Nodes (325+)         │ src/data/nodes.ts                      │
│ Major Roads (60+)    │ src/data/roads.ts                      │
│ Sea Lanes (43)       │ src/data/seaLanes.ts                   │
│ Regional Connectors  │ src/data/regionalConnectors.ts         │
└──────────────────────┴────────────────────────────────────────┘
                               │
                               ▼
               pathfinder.ts: buildGraph()
                               │
                               ▼
        100% Reachability across all 325+ Canonical Nodes
```

1. **`NODES` ([src/data/nodes.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/nodes.ts)):** 325+ settlements, castles, ports, ruins, and crossroads.
   * Node attributes: `id`, `name`, `region`, `type` (`capital`, `major_city`, `city`, `castle`, `port`, `junction`, `ruin`), `coords: [x, y]`, `isPort`, `isHub`, `allegiance`, `loreSnippet`, `wikiUrl`.
2. **`ROADS` ([src/data/roads.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/roads.ts)):** High-traffic overland arteries: Kingsroad, Roseroad, Ocean Road, Goldroad, River Road, Sea Road, High Road, Boneway, Prince's Pass, Demon Road, and Valyrian Stone Highways.
3. **`SEA_LANES` ([src/data/seaLanes.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/seaLanes.ts)):** 43 maritime corridors across the Sunset Sea, Narrow Sea, Summer Sea, Shivering Sea, Jade Sea, and Slaver's Bay.
4. **`REGIONAL_CONNECTORS` ([src/data/regionalConnectors.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/regionalConnectors.ts)):** Comprehensive secondary roads, spur tracks, river ferries, mountain passes, and harbor approaches ensuring **100% graph reachability** (0 isolated settlements).
5. **`MAJOR_BATTLES` ([src/data/battles.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/data/battles.ts)):** 30+ canonical historical battles (Robert's Rebellion, War of the Five Kings, Dance of the Dragons, Blackfyre Rebellions) with coordinates `[x, y]`, commanders, forces, victors, and wiki dossiers.

### Pathfinding Logic ([src/engine/pathfinder.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/pathfinder.ts))
* **Dijkstra & A\* Search:** Evaluates edge costs based on cumulative transit days and distance.
* **Port Transitions:** Switching between overland and maritime corridors incurs `PORT_TRANSITION_DAYS = 3.0` (docking, provisioning, customs, loading baggage).
* **Routing Preferences (`mode`):**
  * `balanced`: Optimal blend of overland roads and maritime shipping.
  * `land_only`: Strictly forbids maritime corridors (returns null if water crossing required).
  * `sea_only`: Strictly enforces coastal and open-sea corridors.
  * `crow_flight`: Straight-line rookery flight (240 mi/day) ignoring topography.
  * `dragon`: High-altitude aerial flight (520 mi/day) soaring over mountains and oceans.
* **Optimization Goals (`optimizationGoal`):**
  * `balanced`: Standard trade-off between total miles and transit days.
  * `shortest`: Pure distance minimization (miles).
  * `fastest`: Transit time minimization (days), aggressively utilizing paved highways and fair-wind sea lanes.

### TSP Multi-Stop Optimization
* When 2+ intermediate waypoints are provided, `optimizeWaypointOrder` computes optimal permutations using 2-opt search to prevent backtracking.
* If manual ordering results in $> 15\text{ miles}$ of avoidable travel, the engine flags `isSuboptimalOrder = true` and reports `potentialSavingsMiles` and `potentialSavingsDays`.

---

## 7. Travel Parties & Terrain Physics Calibration

### Travel Parties ([src/engine/parties.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/engine/parties.ts))

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

## 8. Design System & Styling Architecture

### The Citadel Maester Aesthetic
The user interface evokes the scholarly, antique atmosphere of the Citadel of Oldtown:
* **Dark Citadel Theme (`[data-theme='dark']`):** Deep obsidian backgrounds (`#0a0e14`, `#121820`), antique gold accents (`#c99738`, `#dfb15b`), parchment text (`#f4ecd8`), and slate borders (`#2d3848`).
* **Parchment Light Theme (`[data-theme='beige']`):** Aged sheepskin parchment backgrounds (`#f6efe2`, `#ecdfcc`), deep warm gold borders (`#b3802b`), and rich sepia text (`#221a12`, `#7d4f0b`).

### Centralized Design Tokens
* **CSS Tokens ([src/styles/tokens.css](file:///Users/gary/Documents/Personal/got-map-explorer/src/styles/tokens.css)):** Custom variables for surfaces, borders, typography (`--font-serif: 'Cinzel'`, `--font-medieval: 'MedievalSharp'`, `--font-sans: 'Inter'`), shadows, badges, and overlays.
* **TypeScript Tokens ([src/styles/tokens.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/styles/tokens.ts)):** Strongly typed constants (`THEME_PALETTES`, `PARTY_ARCHETYPE_COLORS`, `NODE_TYPE_COLORS`) used directly in Leaflet canvas vector layers, custom markers, and SVG elements.

### Modular Stylesheet Structure ([src/styles/](file:///Users/gary/Documents/Personal/got-map-explorer/src/styles/))
```
src/styles/
├── tokens.css               # Theme variables & color definitions
├── tokens.ts                # TypeScript mirrored constants for canvas & engine
├── base.css                 # Typography, global reset, layout, scrollbars
├── leaflet.css              # Leaflet canvas overrides, glowing polylines, traveler token
├── index.css                # Root stylesheet aggregator
└── components/
    ├── header.css           # Citadel top navigation bar
    ├── hud.css              # Telemetry heads-up display
    ├── modal.css            # Party speed treatise & modal dialogs
    ├── presets.css          # Historical journey dropdown & chips
    ├── search.css           # Settlement fuzzy search & keyboard navigation
    └── sidebar.css          # Master draggable & dockable citadel drawer
```

---

## 9. Directory Structure & Complete File Map

```
got-map-explorer/
├── AGENTS.md                   # THIS FILE: Consolidated Master Specification & Guidelines
├── README.md                   # Project overview, quickstart, and features
├── TECHNICAL.md                # Mathematical projections, geodesy, and architecture
├── CONTRIBUTING.md             # Guidelines for open-source contributors
├── CODE_OF_CONDUCT.md          # Contributor Covenant Code of Conduct
├── SECURITY.md                 # Vulnerability disclosure and security policy
├── LICENSE                     # MIT open-source license
├── package.json                # Project scripts, dependencies, engine versions
├── package-lock.json           # Deterministic dependency lockfile
├── vite.config.ts              # Vite bundler configuration
├── tsconfig.json               # TypeScript base configuration
├── tsconfig.app.json           # Client TypeScript configuration (strict mode)
├── tsconfig.node.json          # Vite TypeScript configuration
├── .oxlintrc.json              # Oxlint linting rules
├── .gitattributes              # Git line endings, binary assets, and linguist tags
├── .gitignore                  # Git ignore rules
├── .vercelignore               # Vercel deployment bundle ignore rules
├── vercel.json                 # Vercel routing, caching, and security headers
├── .github/
│   ├── CODEOWNERS              # Repository ownership and code review rules
│   ├── dependabot.yml          # Automated dependency updates for npm and Actions
│   ├── pull_request_template.md# PR submission checklist and metadata
│   ├── ISSUE_TEMPLATE/         # Bug reports, feature requests, lore corrections
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow (lint, build, test)
├── public/
│   ├── assets/
│   │   └── known_world_map.jpg # Master 10 000 x 8 300 cartographic raster map
│   ├── compass.svg             # Transparent cartographic compass rose
│   ├── favicon.ico             # Citadel cartographic compass favicon
│   ├── favicon.svg             # Vector SVG compass favicon
│   ├── apple-touch-icon.png    # iOS touch icon (180x180)
│   ├── favicon-48x48.png       # Standard browser favicon
│   ├── favicon-96x96.png       # High-DPI browser favicon
│   ├── favicon-192x192.png     # Android web app icon
│   ├── favicon-512x512.png     # Progressive web app splash icon
│   ├── og-preview.jpg          # Open Graph social preview banner (1200x630)
│   ├── site.webmanifest        # PWA metadata manifest
│   ├── robots.txt              # Search crawler permissions and sitemap link
│   ├── sitemap.xml             # Canonical sitemap
│   └── data/
│       ├── water_mask.bin      # Binary traversability mask (1250x1038)
│       ├── water_distance.bin  # Distance-to-shoreline transform buffer
│       ├── water_metadata.json # Water raster grid dimensions & scale metadata
│       ├── gis_roads.geojson   # Projected GIS overland kingdom routes
│       ├── landmasses.geojson  # High-precision vector landmass boundaries
│       ├── lakes.geojson       # Continental inland lakes and water bodies
│       └── crs_transform.json  # Calibrated affine & projection matrix parameters
├── src/
│   ├── main.tsx                # React DOM root mounting
│   ├── App.tsx                 # Root application state & coordinator
│   ├── types/
│   │   └── index.ts            # Canonical domain TypeScript definitions
│   ├── hooks/
│   │   └── useIsMobile.ts      # Responsive viewport detection hook
│   ├── engine/
│   │   ├── scale.ts            # Map coordinate math, pixel conversion & sanitization
│   │   ├── coordinates.ts      # ArcGIS geodetic world coordinate projection
│   │   ├── waterNav.ts         # Raster water navigation, bathymetry & maritime A*
│   │   ├── parties.ts          # Travel party archetypes & terrain speed multipliers
│   │   └── pathfinder.ts       # Multimodal Dijkstra, A*, TSP & alternative routes
│   ├── data/
│   │   ├── nodes.ts            # 325+ canonical settlements, coords, lore & wikis
│   │   ├── roads.ts            # Major overland highway waypoints
│   │   ├── seaLanes.ts         # 43 maritime shipping corridors
│   │   ├── regionalConnectors.ts # Regional spur routes ensuring 100% reachability
│   │   ├── battles.ts          # 30+ major historical battles & tactical dossiers
│   │   ├── presets.ts          # Canonical lore journeys (Aegon, Nymeria, Robert, etc.)
│   │   └── regions.ts          # Realm definitions, capital IDs, theme colors
│   ├── components/
│   │   ├── MapCanvas.tsx       # Leaflet canvas, vector layers, battle markers, traveler token
│   │   ├── CitadelSidebar.tsx  # Master draggable resizer & dockable (left/right) drawer
│   │   ├── CitySearch.tsx      # Fuzzy settlement directory & zoom-to-city
│   │   ├── Header.tsx          # Top navigation bar, theme switcher, modal triggers
│   │   ├── HistoricalPresetsDropdown.tsx # Historical journey dropdown selector
│   │   ├── PartySpeedInfoModal.tsx # Citadel treatise modal on travel speeds
│   │   ├── CartographyLayersModal.tsx # Layer visibility and map styling modal
│   │   ├── CitadelGuideModal.tsx # Scholar's onboarding and navigation guide
│   │   └── TelemetryHUD.tsx    # Live coordinate heads-up display (Image, Leaflet, Geodetic)
│   └── styles/
│       ├── tokens.css          # Design system CSS variables
│       ├── tokens.ts           # TypeScript token constants for canvas/SVG
│       ├── base.css            # Base styles, typography, scrollbars
│       ├── leaflet.css         # Leaflet overrides & animated traveler token
│       ├── index.css           # Root styles aggregator
│       └── components/         # Modular component stylesheets
└── scripts/
    ├── README.md               # Overview of test suites, pipelines, and datasets
    ├── audit_collisions.ts     # Settlement node overlap & proximity auditor
    ├── verify_all_nodes_routing.ts # 100% reachability & random pair routing test
    ├── audit_all_routes.ts     # Route geometry, hairpin angle & ratio auditor
    ├── test_water_mask_and_coords.ts # Geodetics, water mask & benchmark test
    ├── check_nodes_and_connectivity.ts # Graph component analyzer
    ├── test_all_pairs.ts       # Exhaustive pathfinding stress tester
    ├── data/                   # Calibrated settlement coordinates and wiki datasets
    └── precompute/             # ArcGIS data extraction & calibration pipeline
        ├── calibrate_coordinates.py  # ArcGIS bivariate least-squares calibration
        ├── generate_water_costmap.py # Binary water mask & distance buffer generator
        ├── project_gis_roads.py      # ArcGIS spatial road projection
        ├── recalculate_sea_lanes.py  # Maritime corridor optimizer
        └── solve_everything.py       # Full graph verification & solution builder
```

---

## 10. Development Commands & Verification Runbook

AI agents operating on this repository must verify their work using these commands:

### Essential Development & Build Commands

```bash
# 1. Start development server (port 5173)
npm run dev

# 2. Strict typecheck without build
npm run typecheck

# 3. Strict typecheck and production bundle build (MUST PASS WITH 0 ERRORS)
npm run build

# 4. Static code analysis via Oxlint (MUST PASS WITHOUT ERRORS)
npm run lint

# 5. Core CI Test Suite: Route, Collision & Graph Audit (MUST PASS 100%)
npm test

# 6. Granular test suites
npm run test:collisions     # Standalone settlement collision auditor
npm run test:routing        # 100% reachability and random pair route validator
npm run test:routes         # Road and sea lane geometry & hairpin auditor
npm run test:water-coords   # Geodetics, binary water buffers, and benchmarks
npm run test:all            # Runs npm test + test:water-coords

# 7. Preview production build locally
npm run preview

# 8. Batch push and automated Pull Request creation
npm run pr               # Validates gates, pushes branch, and creates/opens PR
npm run pr:create        # Alias for npm run pr
```

### Verification Scripts Overview
* **`npm test`**: Executes three mandatory quality suites sequentially:
  1. `tsx scripts/audit_collisions.ts`: Scans all 325 settlements for overlapping coordinates or severe proximity collisions.
  2. `tsx scripts/verify_all_nodes_routing.ts`: Tests isolated nodes, multi-stop itineraries, and 200 random settlement pairs across all realms. **Requirement: 100% success rate (200/200 pairs routed).**
  3. `tsx scripts/audit_all_routes.ts`: Scans all 60+ roads, 43 sea lanes, and historical presets for missing endpoints, hairpin turn angles $> 95^\circ$, and excessive path-to-straight distance ratios.

---

## 11. Mandatory Agent Rules of Engagement

All agents and subagents must strictly adhere to these rules of engagement:

### Rule 1: Coordinate Integrity
* Never pass Leaflet coordinates `[lat, lng]` to functions expecting image coordinates `[x, y]`, or vice versa.
* All data files (`nodes.ts`, `roads.ts`, `seaLanes.ts`, `regionalConnectors.ts`) strictly use `[x, y]` image space.
* Leaflet components (`MapCanvas.tsx`) strictly consume `[lat, lng]` produced via `toLeafletLatLng([x, y])`.

### Rule 2: Graph Connectivity Guarantee (100% Reachability)
* Every node in `NODES` must be reachable from any other node via at least one valid path across all modes.
* When adding a new node to `src/data/nodes.ts`, you **must** also add at least one connecting edge in `src/data/regionalConnectors.ts` or `src/data/roads.ts`.
* Always execute `npm test` after modifying any graph or node data.

### Rule 3: Zero Build & Linter Errors
* Never leave unused imports, unhandled type mismatches, or implicit `any` types.
* `npm run build` executes `tsc -b && vite build`. Any unused import (e.g. `TS6133`) will fail the build.
* Always verify that `npm run build` exits with code 0 before completing any task.

### Rule 4: Script-Based Execution Over Long Shell Commands
* Adhere to [.agents/rules/code-complexity.md](file:///Users/gary/Documents/Personal/got-map-explorer/.agents/rules/code-complexity.md): Rather than generating long shell commands, nested pipes, or `.sh` scripts, create an executable Python (`.py`) or Node.js (`.js`/`.ts`) script in `scripts/` or your scratch directory.
* Run the script using `python3` or `node`/`npx tsx`, and remove temporary scripts after use.

### Rule 5: Feature Branching, Logical Clustering, Conversational Checkpoint & PR Automation
* **Protected `main` Enforcement:** Direct pushes to `main` are permanently blocked by GitHub ruleset GH013 ("Changes must be made through a pull request" & "Required status check 'Lint, Build & Routing Tests' is expected"). Every single change—without exception—must reach `main` via a Pull Request.
* **Logical Clustering of Changes:**
  * Do NOT create fragmented, one-off PRs for every trivial single-line or isolated file change.
  * Cluster related modifications into a logical, cohesive topic branch:
    - `feat/<topic>` (e.g. `feat/riverlands-connectors`, `feat/battle-filter-ui`, `feat/weather-layer`)
    - `fix/<topic>` (e.g. `fix/route-hairpin-sanitization`, `fix/mobile-hud-layout`)
    - `chore/<topic>` / `docs/<topic>` (e.g. `chore/dependency-updates`, `docs/technical-geodesy`)
  * Each logical cluster may contain multiple scoped, atomic commits (`feat(...)`, `fix(...)`, `test(...)`) that form a coherent deliverable.
* **Branch Lifecycle:**
  1. Always branch off up-to-date `origin/main`:
     ```bash
     git fetch origin && git checkout -b feat/my-feature origin/main
     ```
  2. Implement features or fixes in atomic, testable increments.
  3. Run quality gates locally: `npm run lint`, `npm run typecheck`, `npm test`.
  4. Stage only relevant files and commit immediately using Conventional Commits (`feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`).
* **Mandatory Conversational PR Checkpoint (CRITICAL FOR ALL AGENTS):**
  * When completing any requested task, bug fix, or feature batch, the agent **MUST ALWAYS ask the user**:
    > *"Are there any additional features, changes, or tests you would like to include in this cluster, or should I proceed to create the Pull Request now?"*
  * **Wait for user direction:**
    - If the user specifies additional features or adjustments: continue implementing on the current feature branch, commit atomically, and ask again once verified.
    - If the user confirms or requests the PR: proceed immediately with automated PR creation.
* **Automated Batch PR Delivery (`npm run pr`):**
  * When confirmed, execute:
    ```bash
    npm run pr
    ```
    or with custom title:
    ```bash
    npm run pr -- --title "feat(engine): add seasonal winter speed penalties"
    ```
  * What `npm run pr` does automatically:
    1. Verifies working tree status.
    2. If mistakenly on `main` with unpushed commits, safely moves them into a new feature branch and resets local `main` to `origin/main`.
    3. Runs all 3 quality gates (Oxlint, TypeScript typecheck, reachability & collision test suite).
    4. Pushes the branch with upstream tracking (`git push -u origin <branch>`).
    5. Gathers commits and detected subsystems to populate `.github/pull_request_template.md`.
    6. Creates the PR using GitHub CLI (`gh pr create`) if authenticated on `github.com`.
    7. If `gh` is not yet authenticated, generates and launches the pre-filled GitHub web compare PR link in the default browser.

### Rule 6: Subagent Decomposition for Parallel Work
* Decompose complex or multi-file workloads into independent sub-tasks and utilize subagents to execute them in parallel wherever sequential dependencies do not exist.

### Rule 7: Citadel Maester Aesthetic Standards
* Preserve the dark fantasy, antique brass, parchment, and slate aesthetic.
* Use existing design tokens in [src/styles/tokens.css](file:///Users/gary/Documents/Personal/got-map-explorer/src/styles/tokens.css) and [src/styles/tokens.ts](file:///Users/gary/Documents/Personal/got-map-explorer/src/styles/tokens.ts).
* Avoid bright, generic primary colors. Use muted, thematic hues matching the heraldic regions of Westeros and Essos.

### Rule 8: Non-Destructive Lore & Data Editing
* Preserve all lore snippets, node allegiances, historical notes, wiki URLs, and preset journeys.
* Do not remove existing test scripts or bypass pathfinding verification checks.

---

## 12. Common Pitfalls & Troubleshooting Matrix

| Pitfall | Root Cause | Solution |
| :--- | :--- | :--- |
| **`TS6133: 'Symbol' is declared but its value is never read`** | Unused import or variable left after refactoring | Remove unused symbols immediately; run `npm run build` to verify. |
| **Inverted Leaflet Map Coordinates** | Passing `[x, y]` directly to `L.polyline` or `L.marker` | Always transform with `toLeafletLatLng([x, y])`. Leaflet expects `[8300 - y, x]`. |
| **Isolated Node / Failed Route** | Adding a node to `nodes.ts` without connecting edges | Add matching connector edges in `src/data/regionalConnectors.ts`. Run `npm test`. |
| **Jagged / Zigzag Polylines** | Raw waypoints containing acute hairpin turns | Run waypoints through `sanitizeRouteWaypoints(waypoints, from, to)`. |
| **Water Navigation Buffers Missing** | Missing `/data/water_mask.bin` or `/data/water_distance.bin` in `public/data/` | Run `python3 scripts/precompute/generate_water_costmap.py` to regenerate binary assets. |
| **Vite Chunk Size Warnings** | Large static graph datasets in single bundle | Normal for cartographic client data; dynamic imports can be added if needed. |

---

*Last Updated: Citadel Maester Cartography Engine v2.5 — Consolidated Master Specification*
