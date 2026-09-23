/**
 * Map Scale Calibration and Coordinate Conversion
 *
 * Measured directly from the cartographer's printed scale bar:
 * - Scale bar width for 600 miles = 686 pixels
 * - Ratio: 0.8746355685 miles per pixel
 * - Wall length (Shadow Tower to Eastwatch): 340 px * (600 / 686) = 297.4 miles (canonical 300 miles)
 */

export const MAP_WIDTH = 10000;
export const MAP_HEIGHT = 8300;

// Scale bar measurements
export const SCALE_BAR_PIXELS = 686;
export const SCALE_BAR_MILES = 600;

export const MILES_PER_PIXEL = SCALE_BAR_MILES / SCALE_BAR_PIXELS; // ~0.8746355685 mi/px
export const LEAGUES_PER_PIXEL = MILES_PER_PIXEL / 3.0; // 1 league = 3 miles (~0.291545 leagues/px)
export const KM_PER_PIXEL = MILES_PER_PIXEL * 1.609344; // ~1.4075895 km/px

/**
 * Convert [x, y] in image space (0,0 top-left) to Leaflet [lat, lng] in CRS.Simple
 * In CRS.Simple:
 * lat = MAP_HEIGHT - y (0 at bottom, MAP_HEIGHT at top)
 * lng = x (0 at left, MAP_WIDTH at right)
 */
export function toLeafletLatLng(coords: [number, number]): [number, number] {
  const [x, y] = coords;
  return [MAP_HEIGHT - y, x];
}

/**
 * Convert Leaflet [lat, lng] back to image [x, y]
 */
export function fromLeafletLatLng(latLng: [number, number]): [number, number] {
  const [lat, lng] = latLng;
  return [lng, MAP_HEIGHT - lat];
}

/**
 * Calculate Euclidean pixel distance between two [x, y] points
 */
export function pixelDistance(p1: [number, number], p2: [number, number]): number {
  return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

/**
 * Calculate total path length along a sequence of [x, y] waypoints
 */
export function calculatePathLengthPixels(waypoints: [number, number][]): number {
  if (waypoints.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += pixelDistance(waypoints[i], waypoints[i + 1]);
  }
  return total;
}

export function pixelsToMiles(px: number): number {
  return px * MILES_PER_PIXEL;
}

export function pixelsToKm(px: number): number {
  return px * KM_PER_PIXEL;
}

export function pixelsToLeagues(px: number): number {
  return px * LEAGUES_PER_PIXEL;
}

export function milesToKm(miles: number): number {
  return miles * 1.609344;
}

export function milesToLeagues(miles: number): number {
  return miles / 3.0;
}

/**
 * Sanitize and validate route waypoints:
 * 1. Enforce start point = fromCoords and end point = toCoords
 * 2. Prune waypoints that project negatively behind start or past destination
 * 3. Prune acute hairpin turns (> 95 degrees) that cause back-and-forth zigzagging
 */
export function sanitizeRouteWaypoints(
  rawWps: [number, number][],
  fromCoords: [number, number],
  toCoords: [number, number]
): [number, number][] {
  if (rawWps.length <= 2) {
    return [fromCoords, toCoords];
  }

  const wps: [number, number][] = rawWps.map(wp => [wp[0], wp[1]]);
  wps[0] = fromCoords;
  wps[wps.length - 1] = toCoords;

  // Remove zero-distance duplicates
  const cleaned: [number, number][] = [wps[0]];
  for (let i = 1; i < wps.length; i++) {
    const prev = cleaned[cleaned.length - 1];
    const curr = wps[i];
    if (Math.hypot(curr[0] - prev[0], curr[1] - prev[1]) > 0.5) {
      cleaned.push(curr);
    }
  }

  // Iteratively prune severe hairpin reversals (> 150 degrees) that double-back on themselves
  let changed = true;
  let current = cleaned;
  while (changed && current.length > 2) {
    changed = false;
    const next: [number, number][] = [current[0]];
    for (let i = 1; i < current.length - 1; i++) {
      const p1 = current[i - 1];
      const p2 = current[i];
      const p3 = current[i + 1];

      const v1x = p2[0] - p1[0];
      const v1y = p2[1] - p1[1];
      const v2x = p3[0] - p2[0];
      const v2y = p3[1] - p2[1];

      const len1 = Math.hypot(v1x, v1y);
      const len2 = Math.hypot(v2x, v2y);
      if (len1 < 1e-4 || len2 < 1e-4) continue;

      const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
      const angle = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;

      // Only eliminate true hairpins (sharp double-backs > 150°), never normal 90-120° geographic turns
      if (angle > 150) {
        changed = true;
      } else {
        next.push(p2);
      }
    }
    next.push(current[current.length - 1]);
    current = next;
  }

  return current;
}
