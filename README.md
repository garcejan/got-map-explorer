# The Known World Navigator 🧭
### *Citadel Route & Distance Engine for George R. R. Martin's A Song of Ice and Fire*

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.81-orange?logo=rust&logoColor=white)](https://oxc.rs/)
[![Graph Connectivity](https://img.shields.io/badge/Graph%20Reachability-100%25%20(325%2B%20Nodes)-success)](#-routing-engine--graph-connectivity)
[![ArcGIS GIS](https://img.shields.io/badge/ArcGIS-GIS%20Calibrated-0079C1?logo=esri&logoColor=white)](#-arcgis-online-gis-integration--precompute-pipeline)

An authentic, high-precision cartographic navigation and expedition calculation engine built in the scholarly tradition of the Archmaesters of the Citadel of Oldtown. **The Known World Navigator** models realistic overland and maritime transit across Westeros, Essos, Slaver's Bay, the Dothraki Sea, the Red Waste, the Jade Sea, and the lands Beyond the Wall.

Calibrated against canonical literature benchmarks and real-world GIS spatial coordinates from [ArcGIS Online](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview), the engine bridges high-resolution cartography, spherical geodetics, graph-theory routing, and naval bathymetry.

---

## 📖 Table of Contents
- [Key Features](#-key-features)
- [Cartography & Tri-Coordinate Geodesy](#-cartography--tri-coordinate-geodesy)
- [ArcGIS Online GIS Integration & Precompute Pipeline](#-arcgis-online-gis-integration--precompute-pipeline)
- [Water Mask & Maritime Bathymetry Engine](#-water-mask--maritime-bathymetry-engine)
- [Routing Engine & Graph Connectivity](#-routing-engine--graph-connectivity)
- [Travel Parties & Terrain Mechanics](#-travel-parties--terrain-mechanics)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Development & Verification Runbook](#-development--verification-runbook)
- [Lore Presets & Historical Chronicles](#-lore-presets--historical-chronicles)
- [License & Attributions](#-license--attributions)

---

## 🌟 Key Features

* **Interactive High-Resolution Citadel Canvas:** Pan and zoom across a custom 10,000 × 8,300 pixel raster map rendered with Leaflet `L.CRS.Simple`, featuring glowing path vectors, node markers, and responsive coordinate telemetry.
* **325+ Canonical Settlements:** Castles, ports, crossroads, citadels, ruins, and landmark waypoints spanning Westeros, Essos, the Summer Isles, and the Far East.
* **Tri-Coordinate Geodetic Engine:** Seamlessly translates between raster image pixels (`[x, y]`), Leaflet canvas space (`[lat, lng]`), and real-world geodetic coordinates (`latDeg, lngDeg` in degrees & minutes, e.g. `54° 52' N, 35° 05' W`).
* **ArcGIS Spatial Data Calibration:** Calibrated via bivariate least-squares regression against official Game of Thrones GIS layers hosted on ArcGIS Online ([Item #43d03779288048bfb5d3c46e4bc4ccb0](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview)).
* **100% Graph Reachability:** Undirected spatial multigraph interconnecting all 325+ canonical settlements via major highways, secondary spur routes, river ferries, mountain defiles, and maritime shipping corridors with zero isolated nodes.
* **Realistic Multimodal Pathfinding:** Weighted Dijkstra and A* pathfinding with configurable optimization strategies (**Balanced**, **Shortest Distance**, **Fastest Time**) and routing constraints (**Land Only**, **Sea Only**, **Raven Flight**, **Dragon Flight**).
* **Port Transition Mechanics:** Enforces a realistic 3.0-day logistics penalty when transitioning between land travel and maritime sailing (vessel chartering, cargo stowage, tidal clearance).
* **1-Bit Binary Water Mask & Bathymetry:** High-performance 162 KB packed binary land/water classification mask and 1.3 MB Euclidean Distance Transform field for sub-30ms maritime routing with coastal shelf, open ocean, and deep abyssal sea zones.
* **Multi-Stop Itineraries & TSP Optimization:** Add arbitrary waypoints along the journey with automated Traveling Salesperson Problem (TSP) 2-opt permutations to detect backtracking and calculate potential distance/time savings.
* **Hairpin Turn Sanitization:** Geometric path smoothing iteratively eliminates acute reverse angles (`> 95°`) and negative vector projections, ensuring realistic road and shipping trajectories.
* **Historical Chronicles Selector:** Dropdown popover in the top header providing instant access to 23 canonical expeditions spanning Aegon's Conquest, the Dance of the Dragons, the Blackfyre Rebellions, Robert's Rebellion, and the War of the Five Kings.
* **Scholarly Citadel Aesthetics:** Authentic dark-fantasy cartographer UI styled with antique brass, gold foil highlights, parchment textures, realm heraldry accents, and collapsible telemetry drawers.

---

## 📐 Cartography & Tri-Coordinate Geodesy

The engine operates across three synchronized coordinate reference frames:

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

* **Image $\leftrightarrow$ Leaflet:**
  * `toLeafletLatLng([x, y])` $\rightarrow$ `[8300 - y, x]`
  * `fromLeafletLatLng([lat, lng])` $\rightarrow$ `[lng, 8300 - lat]`
* **Image $\leftrightarrow$ World Geodetic (Degrees / Minutes):**
  * `imageToWorld([x, y])` $\rightarrow$ `{ latDeg, lngDeg, formattedLat, formattedLng, formattedFull }`
  * `worldToImage(latDeg, lngDeg)` $\rightarrow$ `[x, y]`
* **Leaflet $\leftrightarrow$ World Geodetic:**
  * `leafletToWorld([lat, lng])` $\rightarrow$ `{ latDeg, lngDeg, formattedLat, formattedLng, formattedFull }`
  * `worldToLeaflet(latDeg, lngDeg)` $\rightarrow$ `[lat, lng]`

### 2. Canonical Graticules & Parallels

The spherical projection is aligned with printed map borders, ticks, and the canonical red Equator line:

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

### 4. Physical Scale & Distance Benchmarks
* **Scale Bar Calibration:** 686 pixels = 600 miles.
* **Miles per Pixel:** $\approx 0.874636 \text{ mi/px}$ (`600 / 686`).
* **Leagues per Pixel:** $\approx 0.291545 \text{ leagues/px}$ (1 league = 3 miles).
* **Kilometers per Pixel:** $\approx 1.407590 \text{ km/px}$ ($1 \text{ mi} = 1.609344 \text{ km}$).
* **The Wall Benchmark:** The Wall from Shadow Tower (`[1130, 1968]`) to Eastwatch-by-the-Sea (`[1470, 1968]`) measures 340 pixels $\approx 297.4$ miles (authentically matching George R. R. Martin's canonical 300-mile length).

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

## 🌊 Water Mask & Maritime Bathymetry Engine

Naval voyages in the engine don't merely connect preset waypoints—they leverage a high-performance **Water Navigation & Bathymetry Engine** (`src/engine/waterNav.ts`):

* **Compact Binary Footprint:**
  * `water_mask.bin`: **162 KB** (1-bit packed bitfield, `bit = 1` for water, `0` for land).
  * `water_distance.bin`: **1.3 MB** (8-bit distance field, $0 \dots 255$ cells to the nearest shoreline).
* **$O(1)$ Land/Water Collision Queries:**
  ```typescript
  const maskIndex = (gy * gridWidth + gx) >> 3;
  const bitOffset = 7 - ((gy * gridWidth + gx) & 7);
  const isWater = (maskData[maskIndex] & (1 << bitOffset)) !== 0;
  ```
* **Bathymetric Depth Zones:**
  * 🏖️ **Coastal Shelf (`coastal_shelf`):** $\le 8$ cells ($< 55$ miles from shore). High traffic, safe navigation, easy anchorage.
  * 🌊 **Open Ocean (`ocean`):** $8$ to $36$ cells ($55 - 250$ miles). Deep navigable waters and steady trade routes.
  * 🌌 **Deep Abyssal Ocean (`deep_ocean`):** $> 36$ cells ($\ge 250$ miles). Uncharted deeps across the Sunset and Summer Seas.
* **Sub-30ms Maritime A* Pathfinding:** Dynamically computes collision-free trajectories around peninsulas, headlands, and archipelagos while heavily penalizing coastal grounding.

---

## 🗺️ Routing Engine & Graph Connectivity

The pathfinding graph combines four datasets to guarantee **100% reachability**:

| Dataset | File | Description |
| :--- | :--- | :--- |
| **Nodes** | `src/data/nodes.ts` | 325+ settlements with coordinates, regions, allegiances, port flags, and lore. |
| **Major Roads** | `src/data/roads.ts` | 65+ arteries: Kingsroad, Roseroad, Ocean Road, Goldroad, River Road, Sea Road, High Road, Boneway, Prince's Pass, Demon Road, and Valyrian Stone Highways. |
| **Sea Lanes** | `src/data/seaLanes.ts` | 43+ maritime corridors across the Narrow Sea, Sunset Sea, Summer Sea, Shivering Sea, and Jade Sea. |
| **Regional Connectors** | `src/data/regionalConnectors.ts` | Over 100 KB of secondary roads, ferry routes, castle access tracks, and harbor links ensuring zero isolated nodes. |

### Routing Modes & Constraints
1. **Balanced:** Multimodal search finding the optimal compromise between overland travel and maritime shortcuts.
2. **Land Only:** Enforces pure terrestrial movement; returns no route if a body of water must be traversed.
3. **Sea Only:** Restricts transit strictly to coastal waters, archipelagos, and open ocean shipping lanes.
4. **Direct Flight (Raven / Dragon):** Ignores topographical barriers, computing Euclidean trajectories at specialized flight velocities.

---

## 🐎 Travel Parties & Terrain Mechanics

### Expedition Composition (`src/engine/parties.ts`)

| Party ID | Name | Land Speed | Sea Speed | Can Fly | Description |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `messenger` | Fast Courier / Raven Rider | 58 mi/day | 90 mi/day | No | Lone horseman with fresh post-horse relays at roadside inns |
| `retinue` | Noble Retinue / Royal Progress | 18 mi/day | 95 mi/day | No | Heavy wheelhouses, royal baggage carts, noble court |
| `army` | Marching Host / Army | 12 mi/day | 75 mi/day | No | Armored infantry, siege equipment, heavy baggage trains |
| `caravan` | Merchant Caravan | 15 mi/day | 100 mi/day | No | Pack animals, spice wagons, mercenary guards |
| `fleet` | War Galley / Sailing Fleet | 14 mi/day | 115 mi/day | No | Oared warships and trading cogs; sluggish overland port transfers |
| `crow` | Messenger Raven | 240 mi/day | 240 mi/day | **Yes** | Direct flight between castle rookeries |
| `dragon` | Dragon Flight | 520 mi/day | 520 mi/day | **Yes** | High-altitude soaring beast bypassing all ground friction |

### Terrain Multipliers (`TERRAIN_MODIFIERS`)

| Terrain Type | Speed Multiplier | Visual Accent | Lore & Topography |
| :--- | :---: | :---: | :--- |
| `paved_highway` | **1.25x** | `#8b5cf6` | Valyrian dragon-fused stone highways |
| `royal_road` | **1.10x** | `#dfb15b` | Maintained royal causeways (Kingsroad, Roseroad) |
| `dirt_track` | **1.00x** | `#94a3b8` | Unpaved wagon trails and countryside paths |
| `northern_snow` | **0.65x** | `#38bdf8` | Deep snowdrifts and sub-zero ruts Beyond the Wall |
| `mountain_pass` | **0.60x** | `#ef4444` | High Road, Prince's Pass, rockslides, bandit ambush zones |
| `desert_waste` | **0.50x** | `#f97316` | Red Waste, shifting sands, scarcity of water |
| `swamp_causeway`| **0.45x** | `#10b981` | The Neck, sunken causeways, crannog lizard-lion bogs |
| `coastal_sea` | **1.00x** | `#0ea5e9` | Standard coastal navigable waters |
| `fair_winds` | **1.30x** | `#06b6d4` | Prevailing trade winds across the Jade and Summer Seas |
| `dangerous_sea` | **0.70x** | `#ec4899` | Stepstones pirate channels, Shipbreaker Bay gales |

---

## 🏛️ Project Architecture

```
got-map-explorer/
├── public/
│   ├── assets/
│   │   └── known_world_map.jpg        # 10,000 x 8,300 px high-res map
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
│   │   └── index.ts                   # Domain types & interfaces
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
│   │   ├── presets.ts                 # 23 canonical lore journeys & historical chronicles
│   │   └── regions.ts                 # Realm definitions, capitals, heraldry colors
│   └── components/
│       ├── MapCanvas.tsx              # Leaflet interactive map, custom canvas render
│       ├── CitadelSidebar.tsx         # Multi-tab drawer (Planner, Ledger, Directory)
│       ├── RoutePlanner.tsx           # Waypoints, party selector, optimization modes
│       ├── JourneyBreakdown.tsx       # Stage-by-stage itinerary & terrain stats
│       ├── CitySearch.tsx             # Fuzzy search settlement directory with zoom
│       ├── RouteComparison.tsx        # Alternative route comparison table
│       ├── PartySpeedInfoModal.tsx    # Scholarly speed reference modal
│       ├── RightDrawer.tsx            # Telemetry & collapsible details pane
│       ├── Header.tsx                 # Top navigation bar & historical chronicles dropdown
│       ├── TelemetryHUD.tsx           # Floating coordinate & bathymetry HUD bar
│       └── Legend.tsx                 # Map symbology and road legend
└── scripts/
    ├── precompute/                    # ArcGIS data extraction & calibration pipeline
    │   ├── extract_arcgis_layers.py   # ArcGIS REST FeatureServer GeoJSON downloader
    │   ├── calibrate_coordinates.py   # Regression solver & GeoJSON reprojector
    │   └── generate_water_costmap.py  # EDT generator & binary buffer packer
    ├── verify_all_nodes_routing.ts    # 100% reachability & 200 random pair test suite
    ├── audit_all_routes.ts            # Road and sea lane geometric angle auditor
    ├── test_water_mask_and_coords.ts  # Verification suite for coordinates & water buffers
    └── check_nodes_and_connectivity.ts# Graph component analyzer
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** $\ge$ 20.0.0
* **npm** $\ge$ 10.0.0
* *(Optional for precompute)* **Python** $\ge$ 3.10 with `numpy`, `scipy`, `opencv-python`

### Installation

```bash
# Clone the repository
git clone https://github.com/gary/got-map-explorer.git
cd got-map-explorer

# Install dependencies
npm install
```

### Running Locally

```bash
# Launch Vite development server with Hot Module Replacement (HMR)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛠️ Development & Verification Runbook

All automated tests, type checks, and linters must pass with 0 errors before committing:

```bash
# 1. Static code analysis (Oxlint)
npm run lint

# 2. Graph reachability & route geometry audit (MUST pass with 100% success)
npm test

# 3. Coordinate geodetics & binary water mask audit
npx tsx scripts/test_water_mask_and_coords.ts

# 4. TypeScript compilation & production build
npm run build

# 5. Preview production build locally
npm run preview
```

### Verification Protocols
* **`verify_all_nodes_routing.ts`:** Tests multi-stop itineraries and runs 200 random settlement pair routing tests across all 325 nodes to ensure a 100% routing success rate.
* **`audit_all_routes.ts`:** Inspects all 65 roads and 43 sea lanes for acute hairpin angles (`> 95°`) and path-to-straight distance anomalies.
* **`test_water_mask_and_coords.ts`:** Audits binary payload sizes within CDN budgets, verifies coordinate round-trip accuracy (< 1.5 px drift), confirms canonical landmark latitudes (Riverrun ~40°N, White Harbor ~50°N, Winterfell ~55°N, Equator 0°), and benchmarks maritime A* pathfinding.

---

## 📜 Lore Presets & Historical Chronicles

The engine features 23 pre-configured canonical expeditions accessible via the Header Chronicles dropdown:

* ⚔️ **Aegon's Conquest:** The Dragon's crossing to Westeros and Balerion over Harrenhal.
* 🐉 **The Dance of the Dragons:** Daemon on Caraxes to Harrenhal, Jacaerys' Pact of Ice and Fire to Winterfell, and Lucerys' fateful flight to Storm's End.
* ⚔️ **The Blackfyre Rebellions:** Daemon Blackfyre's march on Tumbleton and Dunk & Egg's journey to the Ashford Tourney.
* 👑 **Robert's Rebellion & Reign:** King Robert's Royal Progress to Winterfell, the Tourney at Harrenhal, and Prince Oberyn Martell's ride from Sunspear.
* ❄️ **The Northern Watches:** The 300-mile Wall Patrol from Shadow Tower to Eastwatch, and Night's Watch pleas to Dragonstone.
* ⛵ **Great Voyages & Exiles:** Princess Nymeria's 10,000 Ships, Corlys Velaryon's Nine Voyages to Asshai and Nefer, Euron Greyjoy's *Silence* expedition, and Arya Stark's passage to Braavos.
* 🦅 **The Rookery Relays:** Citadel White Ravens announcing Autumn's end and urgent war ravens from the Red Keep.

---

## 📜 License & Attributions

* **Cartography & Lore:** Based on George R. R. Martin's *A Song of Ice and Fire* and the official cartographic illustrations of The Known World.
* **ArcGIS Spatial Data:** Derived from the open [Game of Thrones Map Data Layers (ArcGIS Item #43d03779288048bfb5d3c46e4bc4ccb0)](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview) and [ArcGIS MapViewer](https://www.arcgis.com/apps/mapviewer/index.html?webmap=43d03779288048bfb5d3c46e4bc4ccb0) published by Esri community cartographers.
* **Code & Engine:** Released under the MIT License. Built with ❤️ for fans, cartographers, and scholars of the Known World.
