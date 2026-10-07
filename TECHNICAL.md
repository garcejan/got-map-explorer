# Technical Architecture & Engineering Specifications ⚙️
### *The Known World Navigator — Engine, Geodesy, and Cartographic Systems*

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.81-orange?logo=rust&logoColor=white)](https://oxc.rs/)
[![Graph Connectivity](https://img.shields.io/badge/Graph%20Reachability-100%25%20(325%2B%20Nodes)-success)](#-routing-engine--graph-topology)
[![ArcGIS GIS](https://img.shields.io/badge/ArcGIS-GIS%20Calibrated-0079C1?logo=esri&logoColor=white)](#-arcgis-online-gis-integration--precompute-pipeline)

---

## 📖 Table of Contents
- [System Architecture Overview](#-system-architecture-overview)
- [Cartography & Tri-Coordinate Geodesy](#-cartography--tri-coordinate-geodesy)
- [ArcGIS Online GIS Integration & Precompute Pipeline](#-arcgis-online-gis-integration--precompute-pipeline)
- [Water Navigation & Maritime Bathymetry Engine](#-water-navigation--maritime-bathymetry-engine)
- [Routing Engine & Graph Topology](#-routing-engine--graph-topology)
- [Travel Party Physics & Terrain Calibration](#-travel-party-physics--terrain-calibration)
- [Project Directory & Module Structure](#-project-directory--module-structure)
- [Development, Testing & Quality Verification](#-development-testing--quality-verification)

---

## 🏛️ System Architecture Overview

The Known World Navigator is built as a client-side spatial calculation and rendering engine. It combines high-resolution custom raster canvas rendering with graph algorithms, spherical geodetics, and precomputed binary spatial buffers.

```mermaid
graph TD
    subgraph Data Layer
        N[nodes.ts - 325+ Settlements]
        R[roads.ts - 65+ Highways]
        S[seaLanes.ts - 43 Sea Corridors]
        RC[regionalConnectors.ts]
        B[battles.ts - 30+ Battles]
        WM[water_mask.bin & water_distance.bin]
    end

    subgraph Computational Engines
        SCALE[scale.ts - Coordinate Space Math]
        GEO[coordinates.ts - ArcGIS World Geodesy]
        WNAV[waterNav.ts - Bathymetry & O(1) Mask]
        PARTY[parties.ts - Terrain Physics]
        PATH[pathfinder.ts - Dijkstra / A* / TSP 2-Opt]
    end

    subgraph UI & Presentation Layer
        APP[App.tsx State Coordinator]
        MAP[MapCanvas.tsx - Leaflet CRS.Simple]
        SIDE[CitadelSidebar.tsx - Planner & Drawer]
        HUD[TelemetryHUD.tsx]
        HEAD[Header.tsx - Lore Chronicles]
    end

    N & R & S & RC --> PATH
    WM --> WNAV
    WNAV --> PATH
    PARTY --> PATH
    SCALE --> MAP
    GEO --> HUD
    PATH --> APP
    APP --> MAP
    APP --> SIDE
    APP --> HUD
    APP --> HEAD
```

---

## 📐 Cartography & Tri-Coordinate Geodesy

The application synchronizes three distinct coordinate reference frames:

```
                           [0, 0] ───────────────────────► [10000, 0] (x)
                             │                                 │
              Image Space    │   (0,0) is Top-Left             │
              [x, y]         │   Width:  10 000 px             │
                             │   Height:  8 300 px             │
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

                                           ▲
                                           │ imageToWorld([x, y])
                                           │ worldToImage(latDeg, lngDeg)
                                           ▼

                  World Geodetic Space (ArcGIS Calibrated Latitude & Longitude)
                  Latitude:  latDeg = (7663.0 - y) / 86.97022  (0° at Red Line Equator)
                  Longitude: lngDeg = (x - 5972.0950764) / 68.6714114  (0° at Prime Meridian)
                  Display:   54° 52' N, 35° 05' W
```

### 1. Coordinate Conversion APIs (`src/engine/scale.ts` & `src/engine/coordinates.ts`)

* **Image Space to Leaflet Space:**
  $$\text{lat} = 8300 - y, \quad \text{lng} = x$$
  Function: `toLeafletLatLng([x, y])`
* **Leaflet Space to Image Space:**
  $$x = \text{lng}, \quad y = 8300 - \text{lat}$$
  Function: `fromLeafletLatLng([lat, lng])`
* **Image Space to World Geodetics:**
  $$\text{latDeg} = \frac{7663.0 - y}{86.97022}, \quad \text{lngDeg} = \frac{x - 5972.0950764}{68.6714114}$$
  Function: `imageToWorld([x, y])` $\rightarrow$ `{ latDeg, lngDeg, formattedLat, formattedLng, formattedFull }`
* **World Geodetics to Image Space:**
  $$x = \text{lngDeg} \times 68.6714114 + 5972.0950764, \quad y = 7663.0 - \text{latDeg} \times 86.97022$$
  Function: `worldToImage(latDeg, lngDeg)` $\rightarrow$ `[x, y]`

### 2. Canonical Graticules & Parallels

The spherical projection aligns with printed map borders, ticks, and the canonical red Equator line:

| Graticule | World Deg | Image Space `[x, y]` | Leaflet `[lat, lng]` | Visual Accent | Description |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **The Equator** | `0°` | `y = 7663.0` | `lat = 637.0` | `#ef4444` (Red) | Canonical printed red horizontal equator line |
| **Northern Tropic (Cancer)** | `23.5° N` | `y = 5619.2` | `lat = 2680.8` | `#f59e0b` (Amber) | Printed tropic mark at `y = 5607.5` |
| **The Arctic Circle** | `66.5° N` | `y = 1879.5` | `lat = 6420.5` | `#38bdf8` (Cyan) | Printed arctic mark at `y = 1876.5` |
| **Prime Meridian** | `0°` | `x = 5972.1` | `lng = 5972.1` | `#94a3b8` (Slate) | Central reference meridian |
| **10° N Parallel** | `10° N` | `y = 6793.3` | `lat = 1506.7` | Subtle Graticule | Printed margin tick at `y = 6804.5` |
| **20° N Parallel** | `20° N` | `y = 5923.6` | `lat = 2376.4` | Subtle Graticule | Printed margin tick at `y = 5931.5` |
| **30° N Parallel** | `30° N` | `y = 5053.9` | `lat = 3246.1` | Subtle Graticule | Printed margin tick at `y = 5060.5` |
| **40° N Parallel** | `40° N` | `y = 4184.2` | `lat = 4115.8` | Subtle Graticule | Riverrun latitude reference (`40.36° N`) |
| **50° N Parallel** | `50° N` | `y = 3314.5` | `lat = 4985.5` | Subtle Graticule | White Harbor latitude reference (`50.17° N`) |
| **60° N Parallel** | `60° N` | `y = 2444.8` | `lat = 5855.2` | Subtle Graticule | Printed margin tick at `y = 2444.5` |
| **70° N Parallel** | `70° N` | `y = 1575.1` | `lat = 6724.9` | Subtle Graticule | Lands of Always Winter, tick at `y = 1571.5` |

### 3. Canonical Ground-Truth Settlement Benchmarks

The geodetic coordinate calibration is audited against canonical literature landmarks:
* **The Equator (`0.00°`):** Matches canonical red line at `y = 7663.0` with 0.0° error.
* **Riverrun (`[1515, 4153]`):** `40.36° N, 64.90° W` (matches canonical ~40° N Riverlands latitude).
* **White Harbor (`[1780, 3300]`):** `50.17° N, 61.05° W` (matches canonical ~50° N Manderly port latitude).
* **Winterfell (`[1631, 2892]`):** `54.86° N, 63.22° W` (matches canonical ~55° N Stark seat latitude).
* **The Wall (`y = 1968`):** `65.48° N` (runs east-west just below the Arctic Circle at 66.5° N).

### 4. Physical Scale Calibration
* **Scale Bar Measurement:** 686 pixels = 600 miles.
* **Miles per Pixel:** $\text{MILES\_PER\_PIXEL} = \frac{600}{686} \approx 0.8746355685\text{ mi/px}$
* **Leagues per Pixel:** $\text{LEAGUES\_PER\_PIXEL} = \frac{\text{MILES\_PER\_PIXEL}}{3.0} \approx 0.291545\text{ leagues/px}$
* **Kilometers per Pixel:** $\text{KM\_PER\_PIXEL} = \text{MILES\_PER\_PIXEL} \times 1.609344 \approx 1.4075895\text{ km/px}$
* **The Wall Benchmark:** The Wall from Shadow Tower (`[1130, 1968]`) to Eastwatch-by-the-Sea (`[1470, 1968]`) = 340 px $\times$ (600 / 686) = **297.4 miles** (canonical ~300 miles).

### 5. Waypoint Sanitization (`sanitizeRouteWaypoints`)
When generating or modifying route waypoints:
1. **Endpoint Snapping:** First point strictly matches `fromCoords`; last point strictly matches `toCoords`.
2. **Duplicate Pruning:** Removes sequential points with Euclidean distance $< 0.5\text{ px}$.
3. **Hairpin Turn Elimination:** Iteratively eliminates acute reversal angles ($> 150^\circ$) where paths needlessly backtrack, while preserving natural geography (straits, capes, and river curves between $90^\circ$ and $120^\circ$).

---

## 🌐 ArcGIS Online GIS Integration & Precompute Pipeline

To achieve mathematical cartographic fidelity, this project integrates spatial data from the authoritative Game of Thrones GIS dataset hosted on **ArcGIS Online**:

* **ArcGIS Online Item Overview:** [Game of Thrones Map Data Layers (Item #43d03779288048bfb5d3c46e4bc4ccb0)](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview)
* **Interactive ArcGIS MapViewer:** [Game of Thrones Webmap (webmap=43d03779288048bfb5d3c46e4bc4ccb0)](https://www.arcgis.com/apps/mapviewer/index.html?webmap=43d03779288048bfb5d3c46e4bc4ccb0)
* **ArcGIS FeatureServer REST Service:** `https://services8.arcgis.com/bq7onQo4vkjSA8x6/arcgis/rest/services/GameofThronesMapDataLayers_WFL1/FeatureServer`

### 1. ArcGIS Spatial Layers
The ArcGIS FeatureServer supplies 9 fundamental spatial layers extracted into GeoJSON format:

| Layer ID | Name | Output File | Features & Description |
| :---: | :--- | :--- | :--- |
| `0` | **Locations** | `locations.geojson` | 325+ settlements, castles, citadels, ports, and ruins with names and coordinates |
| `1` | **The Wall** | `wall.geojson` | Polyline geometry of the 300-mile defensive barrier |
| `2` | **Roads** | `roads.geojson` | Arterial trade routes, Kingsroad, Roseroad, and Valyrian causeways |
| `3` | **Rivers** | `rivers.geojson` | The Trident, Mander, Rhoyne, Greenblood, and tributary systems |
| `4` | **Boundaries** | `boundary.geojson` | Regional borders of the Seven Kingdoms, Free Cities, and realms |
| `5` | **Lakes** | `lakes.geojson` | Inland freshwater bodies (Gods Eye, Dagger Lake) |
| `6` | **Landscape** | `landscape.geojson` | Mountain ranges, forests (Wolfswood, Kingswood), and marshes |
| `7` | **Continents** | `continents.geojson` | Continental landmass polygons for Westeros, Essos, Sothoryos, and Ulthos |
| `8` | **Islands** | `islands.geojson` | Archipelago polygons (Iron Islands, Stepstones, Summer Isles, Ibben) |

### 2. Precompute & Calibration Pipeline

The spatial preprocessing pipeline (`scripts/precompute/`) automates data extraction, regression calibration, and asset generation:

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 ArcGIS FeatureServer REST                   │
  │     (Item ID: 43d03779288048bfb5d3c46e4bc4ccb0)             │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
               extract_arcgis_layers.py (Layer query)
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │         Raw GeoJSON Data (scripts/precompute/raw/)          │
  │   locations.geojson, continents.geojson, islands.geojson    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
               calibrate_coordinates.py (Bivariate regression)
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │         Affine Transform & Reprojected Vector Data          │
  │   public/data/crs_transform.json                            │
  │   public/data/landmasses.geojson & lakes.geojson            │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
               generate_water_costmap.py (EDT & Rasterization)
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │             Binary Runtime Navigation Assets                │
  │   public/data/water_mask.bin     (162 KB, 1-bit bitfield)   │
  │   public/data/water_distance.bin (1.3 MB, 8-bit distance)   │
  │   public/data/water_metadata.json                           │
  └─────────────────────────────────────────────────────────────┘
```

1. **Extraction (`scripts/precompute/extract_arcgis_layers.py`):** Automatically downloads all 9 spatial layers from the ArcGIS Online FeatureServer into local GeoJSON representations.
2. **Calibration & Inlier Regression (`scripts/precompute/calibrate_coordinates.py`):** Correlates ArcGIS GIS coordinates (`lng, lat`) with image pixel anchors (`[x, y]`) across all common settlement names using least-squares linear regression with outlier elimination (< 60 px residual threshold).
3. **Reprojection (`landmasses.geojson` & `lakes.geojson`):** Projects continental and island polygons into image coordinate space `[x, y]` for fast client-side rendering or rasterization.
4. **Water Costmap Rasterization (`scripts/precompute/generate_water_costmap.py`):** Rasterizes landmasses and lakes onto a $1250 \times 1038$ grid (1 cell $\approx$ 8 pixels $\approx$ 7.0 miles). Computes Euclidean Distance Transform (EDT) for coastal clearance and packs into ultra-compact binary files.

---

## 🌊 Water Navigation & Maritime Bathymetry Engine

Located in `src/engine/waterNav.ts`, this engine provides $O(1)$ land/water detection, bathymetric classification, and landmass-avoiding maritime routing:

* **Raster Grid Resolution:** $1250 \times 1038$ grid (downsampled $8\times$ from $10000 \times 8300$).
* **Binary Footprint:**
  * `water_mask.bin`: **162 KB** (1-bit packed bitfield, `bit = 1` for water, `0` for land).
  * `water_distance.bin`: **1.3 MB** (8-bit distance field, $0 \dots 255$ cells to the nearest shoreline).
* **$O(1)$ Bitfield Indexing:**
  ```typescript
  const maskIndex = (gy * gridWidth + gx) >> 3;
  const bitOffset = 7 - ((gy * gridWidth + gx) & 7);
  const isWater = (maskData[maskIndex] & (1 << bitOffset)) !== 0;
  ```
* **Bathymetric Classification:**
  * 🏖️ **Coastal Shelf (`coastal_shelf`):** $\le 8$ cells ($< 55$ miles from shore). High traffic, safe navigation, harbor approaches.
  * 🌊 **Open Ocean (`ocean`):** $8$ to $36$ cells ($55 - 250$ miles). Deep navigable waters, steady currents, standard sea lanes.
  * 🌌 **Deep Abyssal Ocean (`deep_ocean`):** $> 36$ cells ($\ge 250$ miles). Deep waters across the Sunset, Summer, and Jade Seas.
* **A\* Maritime Search:** Dynamically finds smooth paths across water bodies avoiding islands, peninsulas, and reefs while heavily penalizing coastal grounding.

---

## 🗺️ Routing Engine & Graph Topology

### Graph Composition
The routing graph is an undirected, weighted spatial multigraph composed of four integrated datasets:

```
┌───────────────────────────────────────────────────────────────┐
│                    Graph Composition                          │
├──────────────────────┬────────────────────────────────────────┤
│ Nodes (325+)         │ src/data/nodes.ts                      │
│ Major Roads (65+)    │ src/data/roads.ts                      │
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

1. **`NODES` (`src/data/nodes.ts`):** 325+ settlements, castles, ports, ruins, and crossroads with coordinates, regions, allegiances, port flags, and lore dossiers.
2. **`ROADS` (`src/data/roads.ts`):** 65+ major overland arteries including Kingsroad, Roseroad, Ocean Road, Goldroad, River Road, Sea Road, High Road, Boneway, Prince's Pass, Demon Road, and Valyrian Stone Highways.
3. **`SEA_LANES` (`src/data/seaLanes.ts`):** 43 maritime shipping corridors spanning the Sunset Sea, Narrow Sea, Summer Sea, Shivering Sea, Jade Sea, and Slaver's Bay.
4. **`REGIONAL_CONNECTORS` (`src/data/regionalConnectors.ts`):** Over 100 KB of secondary roads, spur tracks, river ferries, mountain passes, and harbor approaches ensuring **100% graph reachability** (0 isolated settlements).
5. **`MAJOR_BATTLES` (`src/data/battles.ts`):** 30+ canonical historical battles with coordinates `[x, y]`, commanders, combatants, casualties, outcomes, and lore wiki dossiers.

### Pathfinding Logic (`src/engine/pathfinder.ts`)
* **Dijkstra & A\* Search:** Evaluates edge costs based on transit days and distance.
* **Port Transitions:** Switching between overland and maritime corridors incurs `PORT_TRANSITION_DAYS = 3.0` (docking, provisioning, customs, cargo handling).
* **Routing Preferences (`mode`):**
  * `balanced`: Optimal blend of overland roads and maritime shipping.
  * `land_only`: Strictly forbids maritime corridors (returns null if water crossing required).
  * `sea_only`: Strictly enforces coastal and open-sea corridors.
  * `crow_flight`: Straight-line rookery flight (240 mi/day) ignoring topography.
  * `dragon`: High-altitude aerial flight (520 mi/day) soaring over mountains and oceans.
* **Optimization Goals (`optimizationGoal`):**
  * `balanced`: Standard trade-off between total miles and transit days.
  * `shortest`: Pure distance minimization (miles).
  * `fastest`: Transit time minimization (days), prioritizing paved highways and fair-wind sea lanes.

### TSP Multi-Stop Optimization
* When 2+ intermediate waypoints are provided, `optimizeWaypointOrder` computes optimal permutations using 2-opt search to prevent backtracking.
* If manual ordering results in $> 15\text{ miles}$ of avoidable travel, the engine flags `isSuboptimalOrder = true` and reports `potentialSavingsMiles` and `potentialSavingsDays`.

---

## 🐎 Travel Party Physics & Terrain Calibration

### Travel Parties (`src/engine/parties.ts`)

| Party ID | Name | Land Speed | Sea Speed | Can Fly | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `messenger` | Fast Courier / Raven Rider | 58 mi/day | 90 mi/day | No | Lone rider with fresh post-horse relays at roadside inns |
| `retinue` | Noble Retinue / Royal Progress | 18 mi/day | 95 mi/day | No | Heavy wheelhouses, royal baggage carts, noble court |
| `army` | Marching Host / Army | 12 mi/day | 75 mi/day | No | Armored infantry, siege equipment, heavy baggage trains |
| `caravan` | Merchant Caravan | 15 mi/day | 100 mi/day | No | Pack animals, spice wagons, mercenary guards |
| `fleet` | War Galley / Sailing Fleet | 14 mi/day | 115 mi/day | No | Oared warships and trading cogs; slow overland port transfers |
| `crow` | Messenger Raven | 240 mi/day | 240 mi/day | **Yes** | Direct flight between castle rookeries |
| `dragon` | Dragon Flight | 520 mi/day | 520 mi/day | **Yes** | High-altitude soaring beast bypassing all ground friction |

### Terrain Modifiers (`TERRAIN_MODIFIERS`)

| Terrain Type | Speed Multiplier | Visual Accent | Real-World Lore Context |
| :--- | :---: | :---: | :--- |
| `paved_highway` | **1.25x** | `#8b5cf6` | Valyrian dragon-fused basalt highway |
| `royal_road` | **1.10x** | `#dfb15b` | Kingsroad, Roseroad, coaching waystations |
| `dirt_track` | **1.00x** | `#94a3b8` | Standard unpaved cart road |
| `northern_snow` | **0.65x** | `#38bdf8` | Deep northern drifts, freezing ruts Beyond the Wall |
| `mountain_pass` | **0.60x** | `#ef4444` | High Road, Prince's Pass, rockslides, ambush zones |
| `desert_waste` | **0.50x** | `#f97316` | Red Waste, shifting sands, water scarcity |
| `swamp_causeway`| **0.45x** | `#10b981` | The Neck bog, crannogmen, sunken ruts |
| `coastal_sea` | **1.00x** | `#0ea5e9` | Standard coastal navigable waters |
| `fair_winds` | **1.30x** | `#06b6d4` | Steady trade wind passages (Jade Sea) |
| `dangerous_sea` | **0.70x** | `#ec4899` | Stepstones pirate waters, Shipbreaker Bay |

---

## 🏛️ Project Directory & Module Structure

```
got-map-explorer/
├── public/
│   ├── assets/
│   │   └── known_world_map.jpg        # 10 000 x 8 300 px high-res map
│   ├── data/                          # Precomputed GIS and binary navigation assets
│   │   ├── crs_transform.json         # Affine transform matrices (Image <-> GIS)
│   │   ├── landmasses.geojson         # Reprojected continental & island boundaries
│   │   ├── lakes.geojson              # Reprojected inland lake boundaries
│   │   ├── water_mask.bin             # 162 KB 1-bit packed land/water mask
│   │   ├── water_distance.bin         # 1.3 MB 8-bit coastal Euclidean distance field
│   │   └── water_metadata.json        # Grid dimensions & bathymetry cell thresholds
│   ├── compass.svg                    # Cartographic compass rose
│   └── favicon.svg
├── src/
│   ├── main.tsx                       # React application entry
│   ├── App.tsx                        # Top-level state & orchestration
│   ├── index.css                      # Citadel Maester design system & tokens
│   ├── types/
│   │   └── index.ts                   # Canonical TypeScript domain models
│   ├── engine/
│   │   ├── scale.ts                   # Coordinate transforms, scale math & smoothing
│   │   ├── coordinates.ts             # World geodetic (ArcGIS) coordinate conversion & graticules
│   │   ├── waterNav.ts                # Binary water mask, bathymetry & maritime A*
│   │   ├── parties.ts                 # Travel party models & terrain speed factors
│   │   └── pathfinder.ts              # Dijkstra, A*, TSP 2-opt & multimodal search
│   ├── data/
│   │   ├── nodes.ts                   # 325+ settlements and coordinate anchors
│   │   ├── roads.ts                   # Major overland roads and paths
│   │   ├── seaLanes.ts                # Maritime corridors and sea passages
│   │   ├── regionalConnectors.ts      # Secondary connector graph edges
│   │   ├── battles.ts                 # 30+ major historical battles & tactical dossiers
│   │   ├── presets.ts                 # 23 canonical lore journeys & historical chronicles
│   │   └── regions.ts                 # Realm definitions, capitals, heraldry colors
│   ├── hooks/
│   │   └── useIsMobile.ts             # Responsive viewport detection hook
│   └── components/
│       ├── MapCanvas.tsx              # Leaflet interactive map, vector layers & animated traveler token
│       ├── CitadelSidebar.tsx         # Multi-tab drawer (Planner, Itinerary Breakdown, Ledger, Directory)
│       ├── CitySearch.tsx             # Fuzzy search settlement directory with zoom
│       ├── Header.tsx                 # Top navigation bar & historical chronicles dropdown
│       ├── HistoricalPresetsDropdown.tsx # Canonical lore journey selector
│       ├── PartySpeedInfoModal.tsx    # Scholarly speed treatise & party comparison modal
│       ├── CartographyLayersModal.tsx # Layer visibility, borders & map styling modal
│       ├── CitadelGuideModal.tsx      # Scholar's onboarding and navigation guide
│       └── TelemetryHUD.tsx           # Floating coordinate, realm & bathymetry HUD bar
└── scripts/
    ├── precompute/                    # ArcGIS data extraction & calibration pipeline
    │   ├── extract_arcgis_layers.py   # ArcGIS REST FeatureServer GeoJSON downloader
    │   ├── calibrate_coordinates.py   # Regression solver & GeoJSON reprojector
    │   └── generate_water_costmap.py  # EDT generator & binary buffer packer
    ├── audit_collisions.ts            # Node collision and spatial proximity auditor
    ├── verify_all_nodes_routing.ts    # 100% reachability & 200 random pair test suite
    ├── audit_all_routes.ts            # Road and sea lane geometric angle auditor
    ├── test_water_mask_and_coords.ts  # Verification suite for coordinates & water buffers
    └── check_nodes_and_connectivity.ts# Graph component analyzer
```

---

## 🛠️ Development, Testing & Quality Verification

All automated tests, type checks, and linters must pass with 0 errors before committing:

```bash
# 1. Static code analysis (Oxlint)
npm run lint

# 2. Strict TypeScript typechecking
npm run typecheck

# 3. Graph reachability & route geometry audit (MUST pass with 100% success)
npm test

# 4. Coordinate geodetics & binary water mask audit
npm run test:water-coords

# 5. TypeScript compilation & production build
npm run build

# 6. Preview production build locally
npm run preview
```

### Verification Protocols
* **`verify_all_nodes_routing.ts`:** Tests multi-stop itineraries and runs 200 random settlement pair routing tests across all 325 nodes to ensure a 100% routing success rate.
* **`audit_collisions.ts`:** Audits geographic clearance between all settlement nodes to prevent overlapping labels and markers.
* **`audit_all_routes.ts`:** Inspects all 65 roads and 43 sea lanes for acute hairpin angles (`> 95°`) and path-to-straight distance anomalies.
* **`test_water_mask_and_coords.ts`:** Audits binary payload sizes within CDN budgets, verifies coordinate round-trip accuracy (< 1.5 px drift), confirms canonical landmark latitudes (Riverrun ~40°N, White Harbor ~50°N, Winterfell ~55°N, Equator 0°), and benchmarks maritime A* pathfinding.
