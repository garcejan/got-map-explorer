import { MAP_HEIGHT, MAP_WIDTH, toLeafletLatLng } from './scale';

export interface WorldCoordinate {
  latDeg: number;
  lngDeg: number;
  formattedLat: string;
  formattedLng: string;
  formattedFull: string;
}

// Calibrated transformation parameters
// Longitude (calibrated from central meridian / map width):
// x = 68.6714114 * lngDeg + 5972.0950764
const COEFF_LNG_X = 68.6714114;
const OFFSET_LNG_X = 5972.0950764;

// Latitude (calibrated directly from the canonical red Equator line at y=7663 and left margin tick marks):
// Equator (0°): y = 7663.0 (Red horizontal line)
// 10°N: y = 6793.3 (printed mark at y=6804.5)
// 20°N: y = 5923.6 (printed mark at y=5931.5)
// Northern Tropic (23.5°N): y = 5619.2 (printed mark at y=5607.5)
// 30°N: y = 5053.9 (printed mark at y=5060.5)
// 40°N: y = 4184.2 (Riverrun is at y=4153 -> 40.36° N)
// 50°N: y = 3314.5 (White Harbor is at y=3300 -> 50.17° N)
// Winterfell (~55°N): y = 2879.6 (Winterfell is at y=2892 -> 54.86° N)
// 60°N: y = 2444.8 (printed mark at y=2444.5)
// Arctic Circle (66.5°N): y = 1879.5 (printed mark at y=1876.5)
// 70°N: y = 1575.1 (printed mark at y=1571.5)
export const EQUATOR_Y = 7663.0;
export const PIXELS_PER_LAT_DEGREE = 86.97022;

/**
 * Converts image pixel space [x, y] to World Geodetic Latitude and Longitude (degrees).
 */
export function imageToWorld(coords: [number, number]): WorldCoordinate {
  const [x, y] = coords;
  const lngDeg = (x - OFFSET_LNG_X) / COEFF_LNG_X;
  const latDeg = (EQUATOR_Y - y) / PIXELS_PER_LAT_DEGREE;

  const latAbs = Math.abs(latDeg);
  const latDegInt = Math.floor(latAbs);
  const latMin = Math.round((latAbs - latDegInt) * 60);
  const latDir = latDeg >= 0 ? 'N' : 'S';

  const lngAbs = Math.abs(lngDeg);
  const lngDegInt = Math.floor(lngAbs);
  const lngMin = Math.round((lngAbs - lngDegInt) * 60);
  const lngDir = lngDeg >= 0 ? 'E' : 'W';

  const formattedLat = `${latDegInt}° ${latMin.toString().padStart(2, '0')}' ${latDir}`;
  const formattedLng = `${lngDegInt}° ${lngMin.toString().padStart(2, '0')}' ${lngDir}`;

  return {
    latDeg: Number(latDeg.toFixed(4)),
    lngDeg: Number(lngDeg.toFixed(4)),
    formattedLat,
    formattedLng,
    formattedFull: `${formattedLat}, ${formattedLng}`
  };
}

/**
 * Converts World Geodetic Latitude and Longitude (degrees) to Image Pixel Coordinates [x, y].
 */
export function worldToImage(latDeg: number, lngDeg: number): [number, number] {
  const x = COEFF_LNG_X * lngDeg + OFFSET_LNG_X;
  const y = EQUATOR_Y - PIXELS_PER_LAT_DEGREE * latDeg;

  return [
    Math.max(0, Math.min(MAP_WIDTH, Math.round(x * 10) / 10)),
    Math.max(0, Math.min(MAP_HEIGHT, Math.round(y * 10) / 10))
  ];
}

/**
 * Converts Leaflet coordinates [lat, lng] (CRS.Simple) to World Geodetic Coordinates.
 */
export function leafletToWorld(latLng: [number, number]): WorldCoordinate {
  const [latLeaflet, lngLeaflet] = latLng;
  const x = lngLeaflet;
  const y = MAP_HEIGHT - latLeaflet;
  return imageToWorld([x, y]);
}

/**
 * Converts World Geodetic Coordinates to Leaflet coordinates [lat, lng].
 */
export function worldToLeaflet(latDeg: number, lngDeg: number): [number, number] {
  const [x, y] = worldToImage(latDeg, lngDeg);
  return toLeafletLatLng([x, y]);
}

/**
 * Canonical world graticules and parallels (in Leaflet coordinates and label info).
 */
export const WORLD_GRATICULES = {
  equator: {
    latDeg: 0,
    leafletLat: MAP_HEIGHT - EQUATOR_Y, // 8300 - 7663 = 637.0 (Red horizontal line)
    name: 'The Equator (0° / Red Line)',
    color: '#ef4444'
  },
  tropicOfCancer: {
    latDeg: 23.5,
    leafletLat: MAP_HEIGHT - (EQUATOR_Y - 23.5 * PIXELS_PER_LAT_DEGREE), // ~2680.8
    name: 'Tropic of Cancer (Northern Tropic / 23.5° N)',
    color: '#f59e0b'
  },
  arcticCircle: {
    latDeg: 66.5,
    leafletLat: MAP_HEIGHT - (EQUATOR_Y - 66.23 * PIXELS_PER_LAT_DEGREE), // ~6420.5
    name: 'The Arctic Circle (66.5° N)',
    color: '#38bdf8'
  },
  primeMeridian: {
    lngDeg: 0,
    leafletLng: OFFSET_LNG_X, // 5972.10
    name: 'Prime Meridian (0°)',
    color: '#94a3b8'
  },
  parallels: [
    { latDeg: 10, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 10.02 * PIXELS_PER_LAT_DEGREE), name: '10° N' },
    { latDeg: 20, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 20.035 * PIXELS_PER_LAT_DEGREE), name: '20° N' },
    { latDeg: 30, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 30.054 * PIXELS_PER_LAT_DEGREE), name: '30° N' },
    { latDeg: 40, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 40.08 * PIXELS_PER_LAT_DEGREE), name: '40° N' },
    { latDeg: 50, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 50.11 * PIXELS_PER_LAT_DEGREE), name: '50° N' },
    { latDeg: 60, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 60.15 * PIXELS_PER_LAT_DEGREE), name: '60° N' },
    { latDeg: 70, leafletLat: MAP_HEIGHT - (EQUATOR_Y - 70.205 * PIXELS_PER_LAT_DEGREE), name: '70° N' }
  ]
};
