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
  // ================= 1. THE CONQUEST & UNIFICATION =================
  {
    id: 'aegon_crossing',
    name: "Aegon's Crossing to Westeros",
    originId: 'dragonstone',
    destinationId: 'kings_landing',
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: "Aegon I Targaryen and his sister-wives sailing their war fleet from Dragonstone across Blackwater Bay to land at the mouth of the Blackwater Rush, establishing the Aegonfort and beginning the Conquest of the Seven Kingdoms."
  },
  {
    id: 'balerion_harrenhal',
    name: "The Black Dread: Balerion over Harrenhal",
    originId: 'kings_landing',
    destinationId: 'harrenhal',
    partyId: 'dragon',
    mode: 'dragon',
    goal: 'fastest',
    lore: "Aegon the Conqueror flying Balerion the Black Dread above the clouds to unleash devastating black dragonflame, melting Harrenhal's colossal stone towers and ending the tyranny of House Hoare."
  },
  {
    id: 'torrhen_stark_march',
    name: "Torrhen Stark: March of the King Who Knelt",
    originId: 'winterfell',
    destinationId: 'harrenhal',
    waypoints: ['moat_cailin'],
    partyId: 'army',
    mode: 'land_only',
    goal: 'shortest',
    lore: "King Torrhen Stark leading thirty thousand armored Northmen south through Moat Cailin to the Trident, where seeing Aegon's combined host and three dragons, he chose peace and bent the knee to spare his people."
  },

  // ================= 2. EARLY TARGARYEN DYNASTY & JAEHAERYS I =================
  {
    id: 'alysanne_silverwing_wall',
    name: "Queen Alysanne's Flight to the Wall",
    originId: 'winterfell',
    destinationId: 'castle_black',
    partyId: 'dragon',
    mode: 'dragon',
    goal: 'fastest',
    lore: "Good Queen Alysanne Targaryen soaring north on Silverwing to inspect Castle Black and the Wall (58 AC), where the great she-dragon famously refused three times to fly beyond the Wall into the haunted wilderness."
  },

  // ================= 3. THE DANCE OF THE DRAGONS (129-131 AC) =================
  {
    id: 'daemon_caraxes_harrenhal',
    name: "Daemon Targaryen: Caraxes to Harrenhal",
    originId: 'dragonstone',
    destinationId: 'harrenhal',
    partyId: 'dragon',
    mode: 'dragon',
    goal: 'fastest',
    lore: "Prince Daemon Targaryen flying the savage Blood Wyrm Caraxes inland from Dragonstone to capture Harrenhal without striking a single blow, securing the Black faction's inland stronghold in the Riverlands."
  },
  {
    id: 'jacaerys_vermax_winterfell',
    name: "The Pact of Ice and Fire: Jacaerys to Winterfell",
    originId: 'dragonstone',
    destinationId: 'winterfell',
    waypoints: ['eyrie', 'white_harbor'],
    partyId: 'dragon',
    mode: 'dragon',
    goal: 'fastest',
    lore: "Prince Jacaerys Velaryon flying the young dragon Vermax to the Eyrie, White Harbor, and Winterfell to seal the Pact of Ice and Fire with Lord Cregan Stark and rally the North."
  },
  {
    id: 'lucerys_arrax_storm',
    name: "Lucerys' Flight to Storm's End",
    originId: 'dragonstone',
    destinationId: 'storms_end',
    partyId: 'dragon',
    mode: 'dragon',
    goal: 'fastest',
    lore: "Prince Lucerys Velaryon flying Arrax through a raging sea squall across Shipbreaker Bay to deliver Queen Rhaenyra's royal envoy scroll to Lord Borros Baratheon at Storm's End."
  },
  {
    id: 'red_keep_war_raven',
    name: "The Green Council's War Raven to Oldtown",
    originId: 'kings_landing',
    destinationId: 'oldtown',
    partyId: 'crow',
    mode: 'crow_flight',
    goal: 'fastest',
    lore: "The Small Council at the Red Keep dispatching urgent black ravens south to Lord Ormund Hightower at the Hightower of Oldtown upon King Viserys I's death to raise the greens' banners."
  },

  // ================= 4. BLACKFYRE REBELLIONS & DUNK AND EGG =================
  {
    id: 'daemon_blackfyre_rebellion',
    name: "Daemon Blackfyre's Rebellion March",
    originId: 'kings_landing',
    destinationId: 'tumbleton',
    partyId: 'army',
    mode: 'land_only',
    goal: 'shortest',
    lore: "Daemon Blackfyre marching his rebel army westward across the Crownlands with the ancestral Valyrian sword Blackfyre before the legendary clash at the Redgrass Field."
  },
  {
    id: 'dunk_and_egg_ashford',
    name: "Dunk & Egg: Road to the Ashford Tourney",
    originId: 'summerhall',
    destinationId: 'ashford',
    partyId: 'caravan',
    mode: 'land_only',
    goal: 'balanced',
    lore: "Ser Duncan the Tall and his secret royal squire Egg (Prince Aegon Targaryen) riding chestnut palfreys through the Dornish Marches to the historic Tourney at Ashford Meadow (209 AC)."
  },

  // ================= 5. THE YEAR OF THE FALSE SPRING & ROBERT'S REBELLION =================
  {
    id: 'tourney_harrenhal_false_spring',
    name: "Tourney at Harrenhal (Year of the False Spring)",
    originId: 'winterfell',
    destinationId: 'harrenhal',
    waypoints: ['moat_cailin'],
    partyId: 'retinue',
    mode: 'land_only',
    goal: 'balanced',
    lore: "The Stark children riding south along the Kingsroad to Lord Whent's lavish tourney on the Gods Eye (281 AC), where Prince Rhaegar Targaryen crowned Lyanna Stark the Queen of Love and Beauty."
  },
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

  // ================= 6. MAESTER ROOKERY & CITADEL DISPATCHES =================
  {
    id: 'raven_message',
    name: "Messenger Raven / Rookery Flight",
    originId: 'winterfell',
    destinationId: 'kings_landing',
    partyId: 'crow',
    mode: 'crow_flight',
    goal: 'fastest',
    lore: "Maester Luwin sending a black rookery raven south to the Citadel with an urgent sealed message quill."
  },
  {
    id: 'citadel_white_raven',
    name: "The Citadel's White Raven: Winter Has Come",
    originId: 'oldtown',
    destinationId: 'winterfell',
    partyId: 'crow',
    mode: 'crow_flight',
    goal: 'fastest',
    lore: "The Archmaesters of the Citadel releasing the large, intelligent white ravens from the Isle of Ravens to announce to the lords of Westeros that the long summer has ended and Winter has Come."
  },
  {
    id: 'castle_black_plea_dragonstone',
    name: "Night's Watch Plea to Dragonstone",
    originId: 'castle_black',
    destinationId: 'dragonstone',
    partyId: 'crow',
    mode: 'crow_flight',
    goal: 'fastest',
    lore: "Maester Aemon dispatching desperate raven scrolls south across the sea to King Stannis at Dragonstone, begging the realm's kings for urgent aid to defend the Wall against Mance Rayder."
  },

  // ================= 7. OVERLAND HOSTS & PATROLS =================
  {
    id: 'wall_patrol',
    name: "The Wall Patrol",
    originId: 'shadow_tower',
    destinationId: 'eastwatch',
    partyId: 'army',
    mode: 'land_only',
    goal: 'balanced',
    lore: "Patrolling the 300-mile length of the Wall from the Shadow Tower to Eastwatch-by-the-Sea."
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
    lore: "Marching the newly freed 8 000 Unsullied from Astapor through Yunkai to lay siege to Meereen."
  },
  {
    id: 'oberyn_vengeance',
    name: "Red Viper's Ride to King's Landing",
    originId: 'sunspear',
    destinationId: 'kings_landing',
    partyId: 'messenger',
    mode: 'land_only',
    goal: 'balanced',
    lore: "Prince Oberyn Martell and his fierce Dornish retinue riding through the Boneway to seek justice for Elia."
  },

  // ================= 8. GREAT SEA VOYAGES & EXPEDITIONS =================
  {
    id: 'arya_braavos',
    name: "Crossing to Braavos",
    originId: 'saltpans',
    destinationId: 'braavos',
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: 'Boarding the Titan\'s Daughter from Saltpans across the Narrow Sea with the iron coin ("Valar Morghulis").'
  },
  {
    id: 'nymeria_ten_thousand_ships',
    name: "Princess Nymeria's 10 000 Ships",
    originId: 'volantis',
    destinationId: 'sunspear',
    waypoints: ['tall_trees_town'],
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: "Princess Nymeria evacuating the surviving Rhoynar in ten thousand ships across the Summer Sea before landing at the Greenblood to unite with Lord Mors Martell."
  },
  {
    id: 'corlys_asshai',
    name: "The Sea Snake's Voyage to Asshai",
    originId: 'driftmark',
    destinationId: 'asshai',
    waypoints: ['volantis', 'qarth', 'leng_yi'],
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: "Lord Corlys Velaryon sailing the *Sea Snake* into the unknown reaches of the Jade Sea to Leng and Asshai-by-the-Shadow, returning with holds laden with gold and silk."
  },
  {
    id: 'corlys_shivering_sea',
    name: "The Sea Snake's Northern Voyage",
    originId: 'driftmark',
    destinationId: 'nefer',
    waypoints: ['braavos', 'port_of_ibben'],
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: "Corlys Velaryon on the *Ice Wolf* exploring the Shivering Sea past the Port of Ibben and Thousand Islands to the mystery-shrouded subterranean city of Nefer."
  },
  {
    id: 'euron_silence',
    name: "Euron Greyjoy's Silence Expedition",
    originId: 'pyke',
    destinationId: 'oldtown',
    waypoints: ['qarth'],
    partyId: 'fleet',
    mode: 'sea_only',
    goal: 'balanced',
    lore: "The Crow's Eye raiding along the Summer Sea and Smoking Sea before striking the Whispering Sound and the Arbor with the Iron Fleet."
  }
];
