## 📜 Expedition Brief & Summary

<!-- Describe the purpose of this Pull Request and what problems it solves. -->

### 🔍 Type of Change
- [ ] 🐛 Bug fix (non-breaking change fixing an issue or routing defect)
- [ ] 🗺️ Cartography / Lore update (settlement, highway, sea lane, or battle adjustment)
- [ ] ⚡ Performance optimization (canvas rendering, A* pathfinding, bundle size)
- [ ] ✨ New feature (new party type, routing option, or UI component)
- [ ] 🎨 Design / Styling (Citadel theme, layout, or typography)
- [ ] 📝 Documentation / Tests (improving specs, guides, or verification scripts)

---

## 🛠️ Subsystems Affected
- [ ] `src/data/` (Nodes, Roads, Sea Lanes, Regional Connectors, Battles, Presets)
- [ ] `src/engine/` (Pathfinder, Scale/Coordinates, Parties, Water Navigation)
- [ ] `src/components/` (MapCanvas, Sidebar, CitySearch, Header, Telemetry HUD)
- [ ] `src/styles/` (Design tokens, Leaflet styles, components CSS)
- [ ] Build & Configuration (`vite.config.ts`, `package.json`, CI)

---

## 🧭 Citadel Invariants & Quality Checklist

Before requesting review, please confirm the following quality gates have been completed:

- [ ] **Graph Reachability:** Ran `npm test` locally. All 325+ settlements maintain 100% reachability across all modes (0 isolated nodes).
- [ ] **Coordinate Invariants:** Strictly followed coordinate spaces:
  - Image space `[x, y]` in `10 000 x 8 300` px space (`[0,0]` Top-Left).
  - Leaflet space `[lat, lng]` in `CRS.Simple` (`[0,0]` Bottom-Left).
  - Always used `toLeafletLatLng` / `fromLeafletLatLng` conversions from `src/engine/scale.ts`.
- [ ] **Build Gate:** Ran `npm run build` (`tsc -b && vite build`) with **0 errors**. Unused imports are removed.
- [ ] **Lint Gate:** Ran `npm run lint` (`oxlint src`) with **0 errors**.
- [ ] **Local Visual Verification:** Verified the changes interactively in the browser at `http://localhost:5173`.
- [ ] **No Secrets:** Confirmed no environment variables, API keys, or private files are staged.
