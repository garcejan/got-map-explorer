/**
 * Citadel Water Navigation & Bathymetry Engine
 * 
 * Provides O(1) land/water detection, bathymetric depth classification,
 * and sub-5ms client-side A* maritime pathfinding avoiding landmasses.
 */

export type BathymetryZone = 'land' | 'coastal_shelf' | 'ocean' | 'deep_ocean';

export interface WaterNavigationConfig {
  gridWidth: number;
  gridHeight: number;
  mapWidth: number;
  mapHeight: number;
  scaleX: number;
  scaleY: number;
}

const DEFAULT_CONFIG: WaterNavigationConfig = {
  gridWidth: 1250,
  gridHeight: 1038,
  mapWidth: 10000,
  mapHeight: 8300,
  scaleX: 1250 / 10000,
  scaleY: 1038 / 8300
};

// Singleton storage for binary buffers
let maskData: Uint8Array | null = null;
let distData: Uint8Array | null = null;
let initPromise: Promise<boolean> | null = null;

/**
 * Initializes the water navigation engine by loading binary assets.
 */
export async function initWaterNav(basePath: string = '/data'): Promise<boolean> {
  if (maskData && distData) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const [maskRes, distRes] = await Promise.all([
        fetch(`${basePath}/water_mask.bin`),
        fetch(`${basePath}/water_distance.bin`)
      ]);

      if (!maskRes.ok || !distRes.ok) {
        console.warn('Failed to load water navigation binary buffers.');
        return false;
      }

      const [maskBuf, distBuf] = await Promise.all([
        maskRes.arrayBuffer(),
        distRes.arrayBuffer()
      ]);

      maskData = new Uint8Array(maskBuf);
      distData = new Uint8Array(distBuf);
      return true;
    } catch (err) {
      console.warn('Error loading water mask binaries:', err);
      return false;
    }
  })();

  return initPromise;
}

/**
 * Inject preloaded binary buffers directly (for Node.js test environments or SSR).
 */
export function setWaterNavBuffers(mask: Uint8Array, dist: Uint8Array) {
  maskData = mask;
  distData = dist;
}

/**
 * Checks if the engine is ready.
 */
export function isWaterNavReady(): boolean {
  return maskData !== null && distData !== null;
}

function toGridCoords(x: number, y: number, cfg = DEFAULT_CONFIG): [number, number] {
  const gx = Math.max(0, Math.min(cfg.gridWidth - 1, Math.round(x * cfg.scaleX)));
  const gy = Math.max(0, Math.min(cfg.gridHeight - 1, Math.round(y * cfg.scaleY)));
  return [gx, gy];
}

function fromGridCoords(gx: number, gy: number, cfg = DEFAULT_CONFIG): [number, number] {
  const x = Math.round(gx / cfg.scaleX);
  const y = Math.round(gy / cfg.scaleY);
  return [x, y];
}

/**
 * O(1) Check if image coordinates [x, y] are navigable water.
 */
export function isWater(x: number, y: number): boolean {
  if (!maskData) return true; // Fallback to traversable if not loaded yet
  const [gx, gy] = toGridCoords(x, y);
  const idx = gy * DEFAULT_CONFIG.gridWidth + gx;
  const byteIdx = idx >> 3;
  const bitPos = 7 - (idx & 7);
  return ((maskData[byteIdx] >> bitPos) & 1) === 1;
}

/**
 * Distance to nearest shore in grid cells (~7 miles per cell).
 * Returns 0 if on land.
 */
export function getShoreDistance(x: number, y: number): number {
  if (!distData) return 50;
  const [gx, gy] = toGridCoords(x, y);
  return distData[gy * DEFAULT_CONFIG.gridWidth + gx];
}

/**
 * Classifies coordinates into bathymetric depth zones.
 */
export function getBathymetryZone(x: number, y: number): BathymetryZone {
  if (!isWater(x, y)) return 'land';
  const d = getShoreDistance(x, y);
  if (d < 8) return 'coastal_shelf'; // < 55 miles
  if (d < 36) return 'ocean';         // 55 - 250 miles
  return 'deep_ocean';                // >= 250 miles
}

/**
 * Priority queue for fast A* pathfinding.
 */
class MinHeap {
  nodes: number[] = [];
  priorities: number[] = [];

  push(node: number, priority: number) {
    this.nodes.push(node);
    this.priorities.push(priority);
    let i = this.nodes.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.priorities[i] < this.priorities[p]) {
        const tn = this.nodes[i];
        const tp = this.priorities[i];
        this.nodes[i] = this.nodes[p];
        this.priorities[i] = this.priorities[p];
        this.nodes[p] = tn;
        this.priorities[p] = tp;
        i = p;
      } else {
        break;
      }
    }
  }

  pop(): number | undefined {
    if (this.nodes.length === 0) return undefined;
    const top = this.nodes[0];
    const bottomNode = this.nodes.pop()!;
    const bottomPriority = this.priorities.pop()!;
    if (this.nodes.length > 0) {
      this.nodes[0] = bottomNode;
      this.priorities[0] = bottomPriority;
      let i = 0;
      const len = this.nodes.length;
      while ((i << 1) + 1 < len) {
        let sm = i;
        const left = (i << 1) + 1;
        const right = left + 1;
        if (this.priorities[left] < this.priorities[sm]) sm = left;
        if (right < len && this.priorities[right] < this.priorities[sm]) sm = right;
        if (sm !== i) {
          const tn = this.nodes[i];
          const tp = this.priorities[i];
          this.nodes[i] = this.nodes[sm];
          this.priorities[i] = this.priorities[sm];
          this.nodes[sm] = tn;
          this.priorities[sm] = tp;
          i = sm;
        } else {
          break;
        }
      }
    }
    return top;
  }

  get size(): number {
    return this.nodes.length;
  }
}

/**
 * Finds nearest safe water cell if coordinate is placed slightly inland (e.g. coastal port).
 */
export function findNearestWaterCell(gx: number, gy: number, maxRadius: number = 30): [number, number] {
  if (!distData) return [gx, gy];
  const w = DEFAULT_CONFIG.gridWidth;
  const h = DEFAULT_CONFIG.gridHeight;

  if (distData[gy * w + gx] > 0) return [gx, gy];

  let bestCell: [number, number] = [gx, gy];
  let maxDist = -1;

  for (let r = 1; r <= maxRadius; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const nx = gx + dx;
        const ny = gy + dy;
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const d = distData[ny * w + nx];
          if (d > maxDist) {
            maxDist = d;
            bestCell = [nx, ny];
          }
        }
      }
    }
    if (maxDist > 0) break;
  }
  return bestCell;
}

/**
 * Line of sight check between two grid cells over navigable water.
 */
function hasLineOfSight(gx1: number, gy1: number, gx2: number, gy2: number, minClearance: number = 1): boolean {
  if (!distData) return true;
  const w = DEFAULT_CONFIG.gridWidth;

  let x0 = gx1;
  let y0 = gy1;
  const dx = Math.abs(gx2 - x0);
  const dy = Math.abs(gy2 - y0);
  const sx = x0 < gx2 ? 1 : -1;
  const sy = y0 < gy2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (distData[y0 * w + x0] < minClearance) {
      return false; // Hits obstacle or shallow shore
    }
    if (x0 === gx2 && y0 === gy2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return true;
}

/**
 * Client-Side Maritime A* Pathfinding over the distance field.
 * Avoids landmasses and gently steers around shallow shores.
 */
export function findSeaRoute(
  fromCoords: [number, number],
  toCoords: [number, number]
): [number, number][] | null {
  if (!distData || !maskData) {
    // If binaries not yet loaded, return straight corridor
    return [fromCoords, toCoords];
  }

  const w = DEFAULT_CONFIG.gridWidth;
  const h = DEFAULT_CONFIG.gridHeight;

  const [rawStartGx, rawStartGy] = toGridCoords(fromCoords[0], fromCoords[1]);
  const [rawGoalGx, rawGoalGy] = toGridCoords(toCoords[0], toCoords[1]);

  const [startGx, startGy] = findNearestWaterCell(rawStartGx, rawStartGy);
  const [goalGx, goalGy] = findNearestWaterCell(rawGoalGx, rawGoalGy);

  const startIdx = startGy * w + startGx;
  const goalIdx = goalGy * w + goalGx;

  if (startIdx === goalIdx) {
    return [fromCoords, toCoords];
  }

  // Check direct line of sight first
  if (hasLineOfSight(startGx, startGy, goalGx, goalGy, 3)) {
    return [fromCoords, toCoords];
  }

  const openSet = new MinHeap();
  const cameFrom = new Int32Array(w * h).fill(-1);
  const gScore = new Float32Array(w * h).fill(Infinity);

  const hWeight = 1.35;
  gScore[startIdx] = 0;
  openSet.push(startIdx, hWeight * Math.hypot(goalGx - startGx, goalGy - startGy));

  const DIRS = [
    [-1, 0, 1.0], [1, 0, 1.0], [0, -1, 1.0], [0, 1, 1.0],
    [-1, -1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [1, 1, 1.414]
  ];

  let iterations = 0;
  const maxIterations = 75000;

  while (openSet.size > 0 && iterations++ < maxIterations) {
    const current = openSet.pop()!;
    if (current === goalIdx) break;

    const curGx = current % w;
    const curGy = (current / w) | 0;
    const curG = gScore[current];

    for (const [dx, dy, stepDist] of DIRS) {
      const nx = curGx + dx;
      const ny = curGy + dy;
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;

      const nIdx = ny * w + nx;
      const shoreDist = distData[nIdx];
      if (shoreDist === 0) continue; // Impassable land

      // Cost function: penalize shallow coastal shelves < 5 cells to steer ships into open waters
      const coastalPenalty = shoreDist < 5 ? (5 - shoreDist) * 0.6 : 0.0;
      const tentativeG = curG + stepDist * (1.0 + coastalPenalty);

      if (tentativeG < gScore[nIdx]) {
        cameFrom[nIdx] = current;
        gScore[nIdx] = tentativeG;
        const hVal = hWeight * Math.hypot(goalGx - nx, goalGy - ny);
        openSet.push(nIdx, tentativeG + hVal);
      }
    }
  }

  if (cameFrom[goalIdx] === -1) {
    // No route found through water
    return null;
  }

  // Reconstruct path
  const gridPath: [number, number][] = [];
  let curr: number = goalIdx;
  while (curr !== -1) {
    gridPath.push([curr % w, (curr / w) | 0]);
    curr = cameFrom[curr];
  }
  gridPath.reverse();

  // 1. Line-of-sight shortcutting / pruning
  const prunedGridPath: [number, number][] = [gridPath[0]];
  let anchorIdx = 0;
  while (anchorIdx < gridPath.length - 1) {
    let farthestVisible = anchorIdx + 1;
    for (let testIdx = gridPath.length - 1; testIdx > anchorIdx + 1; testIdx--) {
      const [ax, ay] = gridPath[anchorIdx];
      const [tx, ty] = gridPath[testIdx];
      if (hasLineOfSight(ax, ay, tx, ty, 2)) {
        farthestVisible = testIdx;
        break;
      }
    }
    prunedGridPath.push(gridPath[farthestVisible]);
    anchorIdx = farthestVisible;
  }

  // 2. Map back to image pixels
  const rawPixelWaypoints = prunedGridPath.map(([gx, gy]) => fromGridCoords(gx, gy));

  // Snap endpoints
  rawPixelWaypoints[0] = fromCoords;
  rawPixelWaypoints[rawPixelWaypoints.length - 1] = toCoords;

  // 3. Catmull-Rom smoothing for curved maritime wakes
  return smoothMaritimePath(rawPixelWaypoints);
}

/**
 * Produces natural, curved sailing wakes using Catmull-Rom spline interpolation.
 */
function smoothMaritimePath(points: [number, number][], samplesPerSegment: number = 4): [number, number][] {
  if (points.length <= 2) return points;

  const smoothed: [number, number][] = [];
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    for (let s = (i === 0 ? 0 : 1); s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;

      const x = 0.5 * (
        (2 * p1[0]) +
        (-p0[0] + p2[0]) * t +
        (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
        (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
      );
      const y = 0.5 * (
        (2 * p1[1]) +
        (-p0[1] + p2[1]) * t +
        (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
        (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
      );

      // Verify smoothed point does not drift into land
      if (isWater(x, y)) {
        smoothed.push([Math.round(x), Math.round(y)]);
      } else {
        smoothed.push(p1); // fallback to raw waypoint
      }
    }
  }

  // Ensure exact endpoint match
  smoothed[0] = points[0];
  smoothed[smoothed.length - 1] = points[points.length - 1];

  return smoothed;
}
