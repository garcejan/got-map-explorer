# The Known World Navigator 🧭
### *Citadel Route & Distance Engine for George R. R. Martin's A Song of Ice and Fire*

An authentic, interactive expedition planner and cartographic explorer built in the scholarly tradition of the Archmaesters of the Citadel of Oldtown. 

**The Known World Navigator** lets you explore George R. R. Martin's known world—from the snow-swept lands Beyond the Wall to the golden coast of Dorne, the Free Cities of Essos, the Red Waste, and the distant shores of the Jade Sea. Chart realistic overland and maritime journeys, calculate travel times across different travel parties, and retrace legendary military campaigns and canonical journeys.

---

## 🌟 What You Can Do

### 🗺️ Explore the Entire Known World
* **High-Resolution Canvas:** Pan and zoom across a massive, beautifully detailed 10,000 × 8,300 pixel cartographic map.
* **325+ Canonical Settlements:** Castles, port cities, ruins, crossroads, and citadels across Westeros, Essos, and the Summer Isles.
* **Citadel Directory & Quick Search:** Search any settlement by name or region and instantly fly to its location on the map with lore snippets, ruling house allegiances, and wiki links.

### 🧭 Plan Expeditions & Calculate Transit Times
* **Intelligent Route Finding:** Select any starting location, destination, and intermediate waypoints. The engine calculates the most realistic overland roads, mountain passes, and maritime shipping lanes.
* **Realistic Travel Parties:** Compare transit times for different expedition compositions:
  * 👑 **Royal Progress & Noble Retinue** (heavy wheelhouses and baggage trains)
  * ⚔️ **Marching Host / Army** (armored infantry and supply wagons)
  * 🐎 **Fast Courier** (lone rider with post-horse relays)
  * 🐫 **Merchant Caravan** (pack animals and spice carts)
  * ⛵ **War Galley & Sailing Fleet** (ocean crossings and coastal voyages)
  * 🦅 **Messenger Raven** (direct rookery flight)
  * 🐉 **Dragon Flight** (soaring over mountains and oceans)
* **Terrain & Season Awareness:** Transit speeds realistically adjust for paved Valyrian highways, royal roads, deep northern snowdrifts, desert wastes, mountain defiles, and the treacherous bogs of The Neck.
* **Flexible Measurement Units:** View distances in miles, leagues, or kilometers, and transit times in canonical days and moons.

### ⚔️ Relive Canonical Battles & Lore Journeys
* **30+ Major Historical Battles:** Explore iconic battlegrounds—such as the Battle of the Trident, the Battle of the Blackwater, the Field of Fire, and the Redgrass Field—complete with combatant factions, commanders, casualties, and historical overviews.
* **23 Historical Chronicles:** Retrace famous expeditions with a single click, including Aegon's Conquest, Princess Nymeria's 10,000 Ships, King Robert's Progress to Winterfell, and Daemon Targaryen's flight on Caraxes.

### 📜 Authentic Citadel Atmosphere
* **Dual Theme Cartography:** Switch between **Dark Citadel** (obsidian canvas with warm gold and amber highlights) and **Parchment** (aged sheepskin scroll with rich sepia inks).
* **Interactive Telemetry:** Live coordinates, realm identification, terrain classification, and ocean depth gauges.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (version 20 or higher)
* [npm](https://www.npmjs.com/) (version 10 or higher)

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gary/got-map-explorer.git
   cd got-map-explorer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

---

## ⚙️ Technical Architecture & Developer Documentation

Looking for the math, algorithms, and engineering details behind the engine?

👉 **Read the comprehensive [Technical Architecture & Engineering Guide (TECHNICAL.md)](file:///Users/gary/Documents/Personal/got-map-explorer/TECHNICAL.md)** for:
* **Tri-Coordinate Geodesy:** Mathematical projections between pixel space, Leaflet space, and real-world latitude/longitude calibrated against the ArcGIS Online Game of Thrones spatial dataset.
* **Pathfinding Algorithms:** Multimodal Dijkstra and A* routing graph, TSP 2-opt multi-stop waypoint optimization, and port transition logistics penalties.
* **Water Mask & Bathymetry:** Packed 1-bit binary raster masks and Euclidean distance transform fields for sub-30ms obstacle-avoiding maritime navigation.
* **Engineering Standards & Verification:** Oxlint rules, graph reachability tests (100% connectivity across all 325+ nodes), and development runbooks.

---

## 📜 Attributions & Lore Credits

* **World & Lore:** Based on George R. R. Martin's *A Song of Ice and Fire* and *Fire & Blood*, as well as *The World of Ice & Fire* by George R. R. Martin, Elio M. García Jr., and Linda Antonsson.
* **Cartography:** Inspired by the official cartographic illustrations of *The Lands of Ice and Fire* (drawn by Jonathan Roberts).
* **Spatial Reference Data:** Calibrated using open GIS data layers from the [ArcGIS Online Game of Thrones Spatial Dataset](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview).
* **License:** Released under the MIT License. Built for fans, scholars, and cartographers of the Known World.
