import type { RoutingPreference, OptimizationGoal } from '../types';

export interface PresetJourney {
  id: string;
  name: string;
  originId: string;
  destinationId: string;
  waypoints?: string[];
  partyId: string;
  mode: RoutingPreference;
  goal?: OptimizationGoal;
  lore: string;
}

export const PRESET_JOURNEYS: PresetJourney[] = [
  {
    id: 'robert_progress',
    name: "Robert's Royal Progress",
    originId: 'kings_landing',
    destinationId: 'winterfell',
    partyId: 'retinue',
    mode: 'land_only',
    goal: 'shortest',
    lore: "King Robert Baratheon's cumbersome royal progress with Cersei's wheelhouse to name Ned Stark Hand of the King."
  },
  {
    id: 'raven_message',
    name: 'Messenger Raven / Rookery Flight',
    originId: 'winterfell',
    destinationId: 'kings_landing',
    partyId: 'crow',
    mode: 'crow_flight',
    goal: 'fastest',
    lore: 'Maester Luwin sending a black rookery raven south to the Citadel with an urgent sealed message quill.'
  },
  {
    id: 'wall_patrol',
    name: 'The Wall Patrol',
    originId: 'shadow_tower',
    destinationId: 'eastwatch',
    partyId: 'army',
    mode: 'land_only',
    goal: 'balanced',
    lore: "Patrolling the 300-mile length of the Wall from the Shadow Tower to Eastwatch-by-the-Sea."
  },
  {
    id: 'arya_braavos',
    name: 'Crossing to Braavos',
    originId: 'saltpans',
    destinationId: 'braavos',
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: 'Boarding the Titan\'s Daughter from Saltpans across the Narrow Sea with the iron coin ("Valar Morghulis").'
  },
  {
    id: 'dany_slavers_bay',
    name: "Daenerys' Conquest of Slaver's Bay",
    originId: 'astapor',
    destinationId: 'meereen',
    waypoints: ['yunkai'],
    partyId: 'army',
    mode: 'land_only',
    goal: 'balanced',
    lore: 'Marching the newly freed 8,000 Unsullied from Astapor through Yunkai to lay siege to Meereen.'
  },
  {
    id: 'oberyn_vengeance',
    name: "Red Viper's Ride to King's Landing",
    originId: 'sunspear',
    destinationId: 'kings_landing',
    partyId: 'messenger',
    mode: 'land_only',
    goal: 'balanced',
    lore: 'Prince Oberyn Martell and his fierce Dornish retinue riding through the Boneway to seek justice for Elia.'
  }
];
