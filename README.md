# The Known World Navigator 🧭
### *Citadel Route & Distance Engine for George R. R. Martin's A Song of Ice and Fire*

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Oxlint](https://img.shields.io/badge/Oxlint-1.81-orange?logo=rust&logoColor=white)](https://oxc.rs/)
[![Graph Connectivity](https://img.shields.io/badge/Graph%20Reachability-100%25%20(325%2B%20Nodes)-success)](#routing-engine--graph-connectivity)

An authentic, high-precision cartographic navigation and expedition calculation engine built in the scholarly tradition of the Archmaesters of the Citadel of Oldtown. **The Known World Navigator** models realistic overland and maritime transit across Westeros, Essos, Slaver's Bay, the Dothraki Sea, the Red Waste, the Jade Sea, and the lands Beyond the Wall.

---

## 📖 Table of Contents
- [Key Features](#-key-features)
- [Cartography & Physics Calibration](#-cartography--physics-calibration)
- [Routing Engine & Graph Connectivity](#-routing-engine--graph-connectivity)
- [Travel Parties & Terrain Mechanics](#-travel-parties--terrain-mechanics)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Development & Verification Runbook](#-development--verification-runbook)
- [Lore Presets](#-lore-presets)
- [License & Attributions](#-license--attributions)

---

## 🌟 Key Features

* **Interactive High-Resolution Citadel Canvas:** Pan and zoom across a custom 10,000 × 8,300 pixel raster map rendered with Leaflet `L.CRS.Simple`, featuring glowing path vectors, node markers, and responsive coordinate telemetry.
* **325+ Canonical Settlements:** Castles, ports, crossroads, citadels, ruins, and landmark waypoints spanning Westeros, Essos, the Summer Isles, and the Far East.
* **100% Graph Reachability:** Undirected spatial multigraph interconnecting all 325+ canonical settlements via major highways, secondary spur routes, river ferries, mountain defiles, and maritime shipping corridors with zero isolated nodes.
* **Realistic Multimodal Pathfinding:** Weighted Dijkstra and A* pathfinding with configurable optimization strategies (**Balanced**, **Shortest Distance**, **Fastest Time**) and routing constraints (**Land Only**, **Sea Only**, **Raven Flight**, **Dragon Flight**).
* **Port Transition Mechanics:** Enforces a realistic 3.0-day logistics penalty when transitioning between land travel and maritime sailing (vessel chartering, cargo stowage, tidal clearance).
* **Multi-Stop Itineraries & TSP Optimization:** Add arbitrary waypoints along the journey with automated Traveling Salesperson Problem (TSP) 2-opt permutations to detect backtracking and calculate potential distance/time savings.
* **Hairpin Turn Sanitization:** Geometric path smoothing iteratively eliminates acute reverse angles (`> 95°`) and negative vector projections, ensuring realistic road and shipping trajectories.
* **Scholarly Citadel Aesthetics:** Authentic dark-fantasy cartographer UI styled with antique brass, gold foil highlights, parchment textures, realm heraldry accents, and collapsible telemetry drawers.

---

## 📐 Cartography & Physics Calibration

### Dual Coordinate Spaces
The engine operates strictly across two coordinate reference frames:

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

Coordinate translation is handled through `src/engine/scale.ts`:
* `toLeafletLatLng([x, y])` $\rightarrow$ `[8300 - y, x]`
* `fromLeafletLatLng([lat, lng])` $\rightarrow$ `[lng, 8300 - lat]`

### Physical Scale & Canonical Benchmarks
* **Scale Bar Calibration:** 686 pixels = 600 miles.
* **Miles per Pixel:** $\approx 0.874636 \text{ mi/px}$ (`600 / 686`).
* **Leagues per Pixel:** $\approx 0.291545 \text{ leagues/px}$ (1 league = 3 miles).
* **Kilometers per Pixel:** $\approx 1.407590 \text{ km/px}$ ($1 \text{ mi} = 1.609344 \text{ km}$).
* **Canonical Anchor (The Wall):** The Wall from Shadow Tower (`[1130, 1968]`) to Eastwatch-by-the-Sea (`[1470, 1968]`) spans 340 pixels $\approx 297.4$ miles (accurately reflecting George R. R. Martin's canonical 300-mile length).

---

## 🗺️ Routing Engine & Graph Connectivity

The pathfinding graph combines four datasets to guarantee **100% reachability**:

| Dataset | File | Description |
| :--- | :--- | :--- |
| **Nodes** | `src/data/nodes.ts` | 325+ settlements with coordinates, regions, allegiances, port flags, and lore. |
| **Major Roads** | `src/data/roads.ts` | 60+ arteries: Kingsroad, Roseroad, Ocean Road, Goldroad, River Road, Sea Road, High Road, Boneway, Prince's Pass, Demon Road, and Valyrian Stone Highways. |
| **Sea Lanes** | `src/data/seaLanes.ts` | 40+ maritime corridors across the Narrow Sea, Sunset Sea, Summer Sea, Shivering Sea, and Jade Sea. |
| **Regional Connectors** | `src/data/regionalConnectors.ts` | Secondary roads, ferry routes, castle access tracks, and harbor links ensuring no isolated nodes. |

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
│   │   └── known_world_map.jpg     # 10,000 x 8,300 px high-res map
│   ├── compass.svg                 # Cartographic compass rose
│   └── favicon.svg
├── src/
│   ├── main.tsx                    # React application entry
│   ├── App.tsx                     # Top-level state & orchestration
│   ├── index.css                   # Citadel Maester design system & tokens
│   ├── types/
│   │   └── index.ts                # Domain types & interfaces
│   ├── engine/
│   │   ├── scale.ts                # Coordinate transforms, scale math & smoothing
│   │   ├── parties.ts              # Travel party models & terrain speed factors
│   │   └── pathfinder.ts           # Dijkstra, A*, TSP 2-opt & multimodal search
│   ├── data/
│   │   ├── nodes.ts                # 325+ settlements and coordinate anchors
│   │   ├── roads.ts                # Major overland roads and paths
│   │   ├── seaLanes.ts             # Maritime corridors and sea passages
│   │   ├── regionalConnectors.ts   # Secondary connector graph edges
│   │   ├── presets.ts              # Canonical lore journeys
│   │   └── regions.ts              # Realm definitions, capitals, heraldry colors
│   └── components/
│       ├── MapCanvas.tsx           # Leaflet interactive map, custom canvas render
│       ├── CitadelSidebar.tsx      # Multi-tab drawer (Planner, Ledger, Directory)
│       ├── RoutePlanner.tsx        # Waypoints, party selector, optimization modes
│       ├── JourneyBreakdown.tsx    # Stage-by-stage itinerary & terrain stats
│       ├── CitySearch.tsx          # Fuzzy search settlement directory with zoom
│       ├── RouteComparison.tsx     # Alternative route comparison table
│       ├── PartySpeedInfoModal.tsx # Scholarly speed reference modal
│       ├── RightDrawer.tsx         # Telemetry & collapsible details pane
│       ├── Header.tsx              # Top navigation bar & quick links
│       └── Legend.tsx              # Map symbology and road legend
└── scripts/
    ├── verify_all_nodes_routing.ts # 100% reachability & 200 random pair test suite
    ├── audit_all_routes.ts         # Road and sea lane geometric angle auditor
    └── check_nodes_and_connectivity.ts # Graph component analyzer
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** $\ge$ 20.0.0
* **npm** $\ge$ 10.0.0

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

All automated tests, type checks, and linters must pass with 0 errors:

```bash
# 1. Static code analysis (Oxlint)
npm run lint

# 2. Graph reachability & route geometry audit (MUST pass with 100% success)
npm test

# 3. TypeScript compilation & production build
npm run build

# 4. Preview production build locally
npm run preview
```

### Verification Protocols
* **`verify_all_nodes_routing.ts`:** Tests previously isolated nodes, multi-stop itineraries, and runs 200 random settlement pair routing tests across all 325 nodes to ensure a 100% routing success rate.
* **`audit_all_routes.ts`:** Inspects all 62 roads and 41 sea lanes for acute hairpin angles (`> 95°`) and path-to-straight distance anomalies.

---

## 📜 Lore Presets

Explore famous canonical journeys pre-configured in the engine:
* 👑 **King Robert's Royal Progress:** King's Landing to Winterfell via the Kingsroad.
* 🦅 **The Rookery Raven:** Direct messenger flight from Winterfell to the Red Keep.
* ❄️ **The Wall Patrol:** Shadow Tower to Eastwatch-by-the-Sea along the 300-mile ice fortification.
* ⛵ **Saltpans to Braavos:** Arya Stark's passage across the Narrow Sea aboard the *Titan's Daughter*.
* 🐉 **Daenerys' Slaver's Bay Campaign:** Astapor to Meereen through Yunkai.
* 🐍 **The Red Viper's Ride:** Prince Oberyn Martell's journey from Sunspear to King's Landing.

---

## 📜 License & Attributions

* **Cartography:** High-resolution Known World map artwork based on the cartographic illustrations for George R. R. Martin's *A Song of Ice and Fire*.
* **Code & Engine:** Released under the MIT License. Built with ❤️ for fans and scholars of the Known World.
