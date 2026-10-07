# Contributing to The Known World Navigator 🧭

Welcome, scholar and cartographer! We are thrilled you want to help improve **The Known World Navigator**. 

This guide outlines our development workflow, core architectural invariants, quality standards, and the steps for submitting improvements.

---

## 📜 Code of Conduct

All contributors are expected to uphold the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). Please be respectful, constructive, and kind in all issues, discussions, and pull requests.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
* **Node.js:** Version 20.0.0 or higher (Node 22 LTS recommended)
* **npm:** Version 10 or higher
* **Git:** Version 2.30 or higher

### 2. Fork and Clone
```bash
# Clone your fork of the repository
git clone https://github.com/<your-username>/got-map-explorer.git
cd got-map-explorer

# Add upstream remote
git remote add upstream https://github.com/garcejan/got-map-explorer.git
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The app runs with Hot Module Replacement (HMR).

---

## 🧭 Core Architectural Invariants (CRITICAL)

Before writing or modifying code, familiarize yourself with our core invariants. PRs that violate these rules cannot be merged.

### 1. The Coordinate Systems Invariant
The engine operates across two distinct coordinate spaces:
* **Image Space:** `[x, y]` in `10 000 x 8 300` px space (`[0, 0]` is Top-Left).
* **Leaflet Space:** `[lat, lng]` in `CRS.Simple` where `lat = 8300 - y` and `lng = x` (`[0, 0]` is Bottom-Left).
* **Mandatory Conversions:** Always use `toLeafletLatLng([x, y])` and `fromLeafletLatLng([lat, lng])` from `src/engine/scale.ts`.
* **Strict Boundary:** Never pass Leaflet `[lat, lng]` into data files (`nodes.ts`, `roads.ts`, `seaLanes.ts`) or pathfinder calculations, and never pass raw image `[x, y]` to Leaflet layers without converting.

### 2. 100% Graph Reachability Invariant
* All 325+ settlements in `src/data/nodes.ts` must maintain **100% reachability** across all modes.
* When adding a new node to `src/data/nodes.ts`, you **must** immediately add connecting edges in `src/data/regionalConnectors.ts` or `src/data/roads.ts`.
* Run `npm test` to verify. Zero isolated nodes are permitted.

### 3. Physical Scale & Distances
* `MILES_PER_PIXEL = 600 / 686` (~0.8746 mi/px) calibrated against the 600-mile map scale bar and the 300-mile length of the Wall.
* Use calculation functions from `src/engine/scale.ts` (`pixelDistance`, `calculatePathLengthPixels`).

---

## 🧪 Verification & Quality Gates

Every pull request must pass three local verification gates before submission:

```bash
# 1. Cartographic reachability, collision audits & route smoothness
npm test

# 2. Rust-based fast linter (Oxlint)
npm run lint

# 3. TypeScript compilation & production Vite bundle
npm run build
```

---

## 🗺️ How to Contribute Data

### Adding or Updating a Settlement (`src/data/nodes.ts`)
1. Determine canonical coordinates `[x, y]` in image space (`10 000 x 8 300`).
2. Add the settlement object to `NODES`:
   ```ts
   {
     id: 'moat_cailin',
     name: 'Moat Cailin',
     region: 'the_north',
     type: 'castle',
     coords: [1420, 3755],
     isPort: false,
     isHub: true,
     allegiance: 'House Stark / Reed',
     loreSnippet: 'An ancient fortress commanding the Causeway of the Neck...',
     wikiUrl: 'https://awoiaf.westeros.org/index.php/Moat_Cailin'
   }
   ```
3. Connect it to adjacent roads or settlements in `src/data/roads.ts` or `src/data/regionalConnectors.ts`.
4. Run `npm test` to confirm 100% reachability.

### Adding a Historical Battle (`src/data/battles.ts`)
1. Provide accurate `[x, y]` coordinates.
2. Include combatants, commanders, outcome, war context, and canonical wiki URL.

---

## 🚀 Submitting a Pull Request

1. **Create a topic branch:**
   ```bash
   git checkout -b feat/add-valyrian-road-connection
   ```
2. **Follow Conventional Commits:**
   * `feat(...)`: New feature or data entry
   * `fix(...)`: Bug fix or route correction
   * `perf(...)`: Performance improvement
   * `docs(...)`: Documentation updates
   * `chore(...)`: Tooling, CI, dependencies
3. **Run all tests:**
   ```bash
   npm test && npm run lint && npm run build
   ```
4. **Push to your fork and submit PR:**
   * Push your branch to GitHub and open a Pull Request targeting `main`.
   * Complete the checklist in the PR template.
   * Automated CI will run tests, linting, and build validation.

---

## 💬 Community & Questions

* **Bug reports & Feature ideas:** Open an issue using our [GitHub Issue Templates](https://github.com/garcejan/got-map-explorer/issues/new/choose).
* **Security reports:** See [SECURITY.md](./SECURITY.md) for private vulnerability reporting.
* **Architecture questions:** Consult [TECHNICAL.md](./TECHNICAL.md) and [AGENTS.md](./AGENTS.md).
