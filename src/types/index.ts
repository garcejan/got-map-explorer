export type NodeType = 'capital' | 'major_city' | 'city' | 'castle' | 'port' | 'junction' | 'ruin';

export type TerrainType =
  | 'paved_highway'
  | 'royal_road'
  | 'dirt_track'
  | 'mountain_pass'
  | 'swamp_causeway'
  | 'northern_snow'
  | 'desert_waste'
  | 'coastal_sea'
  | 'fair_winds'
  | 'dangerous_sea';

export type SegmentType = 'land' | 'sea' | 'flight';

export interface LocationNode {
  id: string;
  name: string;
  region: string;
  type: NodeType;
  coords: [number, number]; // [x, y] in 10000 x 8300 image coordinate space
  allegiance?: string;
  isPort?: boolean;
  isHub?: boolean;
  loreSnippet?: string;
  wikiUrl?: string;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  segmentType: SegmentType;
  terrainType: TerrainType;
  waypoints: [number, number][]; // Array of [x, y] coordinates following the exact road/sea curves
  distanceMiles: number;
  distanceKm: number;
  distanceLeagues: number;
  isCustom?: boolean;
}

export interface TravelParty {
  id: string;
  name: string;
  icon: string;
  landSpeedMilesPerDay: number;
  seaSpeedMilesPerDay: number;
  description: string;
  tagline: string;
  canFly?: boolean;
}

export type RoutingPreference = 'balanced' | 'land_only' | 'sea_only' | 'dragon' | 'crow_flight';
export type OptimizationGoal = 'balanced' | 'shortest' | 'fastest';

export interface RouteLeg {
  edge: RouteEdge;
  fromNode: LocationNode;
  toNode: LocationNode;
  distanceMiles: number;
  distanceKm: number;
  distanceLeagues: number;
  transitDays: number;
  terrainType: TerrainType;
  segmentType: SegmentType;
  waypoints: [number, number][]; // [lat, lng] for Leaflet
}

export interface JourneyStage {
  stageIndex: number;
  fromNode: LocationNode;
  toNode: LocationNode;
  distanceMiles: number;
  distanceKm: number;
  distanceLeagues: number;
  totalDays: number;
  legs: RouteLeg[];
}

export interface RouteResult {
  routeFound: boolean;
  totalMiles: number;
  totalKm: number;
  totalLeagues: number;
  totalDays: number;
  landMiles: number;
  seaMiles: number;
  legs: RouteLeg[];
  journeyStages?: JourneyStage[];
  allCoordinates: [number, number][]; // [lat, lng] continuous polyline for Leaflet
  terrainBreakdown: {
    terrain: TerrainType;
    label: string;
    miles: number;
    percentage: number;
    color: string;
  }[];
  origin: LocationNode;
  destination: LocationNode;
  waypointsVisited: LocationNode[];
  party: TravelParty;
  mode: RoutingPreference;
  optimizationGoal?: OptimizationGoal;
  hazards: string[];
  isSuboptimalOrder?: boolean;
  optimizedWaypointIds?: string[];
  potentialSavingsMiles?: number;
  potentialSavingsDays?: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  realm: 'Westeros' | 'Essos' | 'Beyond';
  color: string;
  capitalId: string;
}

export type MapPickingTarget =
  | { type: 'origin' }
  | { type: 'destination' }
  | { type: 'waypoint'; index: number }
  | null;

export interface BattleCombatantSide {
  name: string;
  commanders: string[];
  forces?: string;
  factions?: string[];
}

export type BattleVictorySide = 'sideA' | 'sideB' | 'stalemate' | 'pyrrhic';

export interface MajorBattle {
  id: string;
  name: string;
  conflict: string;
  year: string;
  coords: [number, number]; // [x, y] in 10000 x 8300 image coordinate space
  locationName: string;
  region: string;
  description: string;
  combatants: {
    sideA: BattleCombatantSide;
    sideB: BattleCombatantSide;
  };
  victor: string;
  victorySide: BattleVictorySide;
  outcomeDetails?: string;
  wikiUrl: string;
}

export interface CartographyLayersConfig {
  roads: boolean;
  kingdomPaths: boolean;
  seaLanes: boolean;
  battles: boolean;
  labels: boolean;
  graticules: boolean;
  waterMask: boolean;
}

export const DEFAULT_CARTOGRAPHY_LAYERS: CartographyLayersConfig = {
  roads: false,
  kingdomPaths: false,
  seaLanes: false,
  battles: true,
  labels: true,
  graticules: true,
  waterMask: false
};

