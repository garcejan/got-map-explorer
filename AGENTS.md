# Antigravity Agent Guidelines

This repository uses [Antigravity.md](file:///Users/gary/Documents/Personal/GOT/Antigravity.md) as the authoritative master specification for all AI agents, subagents, and automated workflows.

## Quick Reference for Agents

1. **Master Specification:** Read and adhere to [Antigravity.md](file:///Users/gary/Documents/Personal/GOT/Antigravity.md) for full coordinate transformation math, graph data topology, travel party mechanics, terrain multipliers, and architecture.
2. **Coordinate System Invariant:**
   * Image coordinates: `[x, y]` in `10000 x 8300` px space.
   * Leaflet coordinates: `[lat, lng]` where `lat = 8300 - y` and `lng = x`.
   * Always use `toLeafletLatLng([x, y])` and `fromLeafletLatLng([lat, lng])` from `src/engine/scale.ts`.
3. **Graph Connectivity Invariant:**
   * All 325+ settlements in `src/data/nodes.ts` must maintain 100% reachability across all modes.
   * Verify using `npm test`.
4. **Build & Quality Gates:**
   * `npm run build` (`tsc -b && vite build`) must pass with 0 errors before completing any task.
   * `npm run lint` (`oxlint src`) must pass without new errors.
   * `npm test` (`verify_all_nodes_routing.ts` & `audit_all_routes.ts`) must pass with 100% success rate.
