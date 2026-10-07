# Citadel Engineering Scripts & Tooling 📜

This directory contains test suites, verification gates, spatial precompute pipelines, and graph analysis tools for **The Known World Navigator**.

---

## 🧪 Verification & Test Suites (CI Gates)

These scripts ensure 100% graph reachability, coordinate accuracy, and geometric validity across all 325+ settlements.

| Script | Command | Purpose |
| :--- | :--- | :--- |
| [`audit_collisions.ts`](./audit_collisions.ts) | `npm run test:collisions` | Verifies geographic distance between settlements to prevent overlapping canvas markers and labels. |
| [`verify_all_nodes_routing.ts`](./verify_all_nodes_routing.ts) | `npm run test:routing` | Verifies 100% reachability across all 325+ settlements, multi-stop itineraries, and 200 random origin-destination pairs. |
| [`audit_all_routes.ts`](./audit_all_routes.ts) | `npm run test:routes` | Audits all 60+ highways and 43 sea lanes for acute hairpin angles (`> 95°`) and detour ratios. |
| [`test_water_mask_and_coords.ts`](./test_water_mask_and_coords.ts) | `npm run test:water-coords` | Validates binary water mask budgets, coordinate projection round-trips (< 1.5 px drift), landmark latitudes, and benchmarks maritime A*. |

> **Run All CI Tests:**
> ```bash
> npm test
> # or full suite including water/coords:
> npm run test:all
> ```

---

## 🌐 Spatial Precompute Pipeline (`scripts/precompute/`)

Tools used to ingest, calibrate, and generate the binary assets and GeoJSON layers from the [ArcGIS Online Game of Thrones Spatial Dataset](https://www.arcgis.com/home/item.html?id=43d03779288048bfb5d3c46e4bc4ccb0#overview):

| Script | Purpose | Output Asset |
| :--- | :--- | :--- |
| [`extract_arcgis_layers.py`](./precompute/extract_arcgis_layers.py) | Downloads raw GIS vector layers from ArcGIS REST services. | `scripts/precompute/raw/*.geojson` |
| [`calibrate_coordinates.py`](./precompute/calibrate_coordinates.py) | Bivariate least-squares regression mapping GIS coords to image `[x, y]`. | `public/data/crs_transform.json` |
| [`generate_water_costmap.py`](./precompute/generate_water_costmap.py) | Rasterizes vector landmasses and computes Euclidean distance transform (EDT). | `public/data/water_mask.bin`<br>`public/data/water_distance.bin` |
| [`project_gis_roads.py`](./precompute/project_gis_roads.py) | Projects GIS road vector layers into 10 000 x 8 300 coordinate space. | `public/data/gis_roads.geojson` |
| [`recalculate_sea_lanes.py`](./precompute/recalculate_sea_lanes.py) | Generates water-hugging, landmass-avoiding maritime corridors. | `src/data/seaLanes.ts` |
| [`solve_everything.py`](./precompute/solve_everything.py) | Master pipeline orchestrator executing full spatial calibration. | All precomputed assets |

---

## 🔍 Graph Diagnostics & Analysis

Scripts used during development and network expansion:

* **`check_nodes_and_connectivity.ts`**: Analyzes the graph topology and identifies isolated subgraphs or missing connectors.
* **`test_all_pairs.ts`**: Exhaustive all-pairs shortest path matrix test.
* **`test_tsp.ts` & `test_optimized_journey.ts`**: Validates the 2-opt Traveling Salesperson Problem permutation solver.
* **`diagnose_sea_routes.ts`**: Tests maritime routing through narrow straits (Stepstones, Jade Gates, Redwyne Straits).
* **`verify_all_settlement_wikis.ts`**: Validates that all A Song of Ice and Fire lore URLs resolve correctly.

---

## 📁 Reference Datasets (`scripts/data/`)

* **`verified_settlement_wikis.json`**: Verified AWOIAF encyclopedia links for settlements.
* **`enhanced_calibrated_settlements.json`**: Least-squares calibrated coordinates for settlements.
* **`fandom_matches.json`**: Cross-referenced wiki articles and lore descriptions.
