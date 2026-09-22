import { MAP_HEIGHT, MAP_WIDTH, toLeafletLatLng } from './scale';

export interface WorldCoordinate {
  latDeg: number;
  lngDeg: number;
  formattedLat: string;
  formattedLng: string;
  formattedFull: string;
}

// Calibrated transformation parameters
// Forward: [lng, lat] -> [x, y]
const COEFF_X = [68.6714114, 0.0282143, 5972.0950764] as const;
const COEFF_Y = [-0.0585936, -69.9298051, 4771.9588189] as const;

// Inverse: [x, y] -> [lng, lat]
const INV_LNG = [0.01456209, 0.00000588, -86.9953245] as const;
const INV_LAT = [-0.00001221, -0.01430005, 68.2974955] as const;

/**
 * Converts image pixel space [x, y] to World Geodetic Latitude and Longitude (degrees).
 */
export function imageToWorld(coords: [number, number]): WorldCoordinate {
  const [x, y] = coords;
  const lngDeg = INV_LNG[0] * x + INV_LNG[1] * y + INV_LNG[2];
  const latDeg = INV_LAT[0] * x + INV_LAT[1] * y + INV_LAT[2];

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
  const x = COEFF_X[0] * lngDeg + COEFF_X[1] * latDeg + COEFF_X[2];
  const y = COEFF_Y[0] * lngDeg + COEFF_Y[1] * latDeg + COEFF_Y[2];

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
    leafletLat: MAP_HEIGHT - 4771.96,
    name: 'The Equator (The Equinoctial Line)',
    color: '#dfb15b'
  },
  tropicOfCancer: {
    latDeg: 23.5,
    leafletLat: MAP_HEIGHT - 3128.61,
    name: 'Tropic of Cancer (Northern Summer Solstice)',
    color: '#f59e0b'
  },
  arcticCircle: {
    latDeg: 66.5,
    leafletLat: MAP_HEIGHT - 121.63,
    name: 'The Arctic Circle (Lands of Always Winter)',
    color: '#38bdf8'
  },
  primeMeridian: {
    lngDeg: 0,
    leafletLng: 5972.10,
    name: 'Prime Meridian (Meridian of the Citadel)',
    color: '#94a3b8'
  }
};
