import type { MajorBattle } from '../types';

export const MAJOR_BATTLES: MajorBattle[] = [
  {
    id: 'battle_of_the_trident',
    name: 'Battle of the Trident',
    conflict: "Robert's Rebellion",
    year: '283 AC',
    coords: [1830, 4196],
    locationName: 'The Ruby Ford, The Trident',
    region: 'riverlands',
    description: "The decisive battle of Robert's Rebellion fought upon the fords of the Trident. Lord Robert Baratheon and Crown Prince Rhaegar Targaryen met in climactic single combat in the rushing water. Robert smashed Rhaegar's rubied breastplate with his warhammer, routing the royal host and sealing the doom of the Targaryen dynasty.",
    combatants: {
      sideA: {
        name: 'Rebel Coalition',
        commanders: ['Lord Robert Baratheon', 'Lord Eddard Stark', 'Lord Jon Arryn', 'Lord Hoster Tully'],
        forces: '~35,000 men (Stormlands, North, Vale, Riverlands)',
        factions: ['House Baratheon', 'House Stark', 'House Arryn', 'House Tully']
      },
      sideB: {
        name: 'Targaryen Loyalists',
        commanders: ['Prince Rhaegar Targaryen †', 'Ser Barristan Selmy', 'Prince Lewyn Martell †', 'Lord Jon Darry †'],
        forces: '~40,000 men (Crownlands, Reach, Dorne)',
        factions: ['House Targaryen', 'House Martell', 'House Darry']
      }
    },
    victor: 'Rebel Coalition (House Baratheon & Allies)',
    victorySide: 'sideA',
    outcomeDetails: "Decisive rebel victory; Crown Prince Rhaegar slain; paved way for the fall of King's Landing.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Trident'
  },
  {
    id: 'battle_of_the_blackwater',
    name: 'Battle of the Blackwater',
    conflict: 'War of the Five Kings',
    year: '299 AC',
    coords: [1985, 4620],
    locationName: "Blackwater Bay & King's Landing",
    region: 'crownlands',
    description: "King Stannis Baratheon launched a massive amphibious assault on King's Landing. Acting Hand Tyrion Lannister sprang a catastrophic wildfire trap in Blackwater Bay, incinerating Stannis's fleet. A surprise relief army led by Lord Tywin Lannister and the Reach host under Ser Loras Tyrell struck Stannis's flank and crushed his army.",
    combatants: {
      sideA: {
        name: 'House Baratheon of Dragonstone',
        commanders: ['King Stannis Baratheon', 'Ser Davos Seaworth', 'Ser Imry Florent †'],
        forces: '20,000 soldiers & ~200 warships',
        factions: ['House Baratheon of Dragonstone', 'House Florent', 'Lysene Mercenaries']
      },
      sideB: {
        name: 'Iron Throne Alliance (Lannister & Tyrell)',
        commanders: ['Lord Tywin Lannister', 'Tyrion Lannister', 'Ser Loras Tyrell', 'King Joffrey Baratheon'],
        forces: '7,000 garrison + 60,000 Tyrell/Lannister relief army',
        factions: ['House Lannister', 'House Tyrell', 'City Watch of King\'s Landing']
      }
    },
    victor: 'Iron Throne Alliance (House Lannister & House Tyrell)',
    victorySide: 'sideB',
    outcomeDetails: "Decisive Lannister-Tyrell victory; Stannis's invasion shattered, forcing him to flee north.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Blackwater'
  },
  {
    id: 'field_of_fire',
    name: 'The Field of Fire',
    conflict: "Aegon's Conquest",
    year: '2 BC',
    coords: [1420, 4790],
    locationName: 'Plains of the Northern Reach',
    region: 'reach',
    description: 'The only battle in Westerosi history where all three Targaryen dragons—Balerion, Vhagar, and Meraxes—were unleashed together upon the battlefield. The combined host of the Two Kings outnumbered Aegon five to one, but dragonflame ignited the dry plains into an inferno that burned over 4,000 allied soldiers alive and broke the ancient kingdoms.',
    combatants: {
      sideA: {
        name: 'Host of the Two Kings',
        commanders: ['King Mern IX Gardener †', 'King Loren I Lannister'],
        forces: '55,000 knights, horsemen, and footmen',
        factions: ['Kingdom of the Reach (House Gardener)', 'Kingdom of the Rock (House Lannister)']
      },
      sideB: {
        name: 'House Targaryen',
        commanders: ['King Aegon I Targaryen', 'Queen Visenya Targaryen', 'Queen Rhaenys Targaryen'],
        forces: '11,000 infantry + 3 Dragons (Balerion, Vhagar, Meraxes)',
        factions: ['House Targaryen']
      }
    },
    victor: 'House Targaryen',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive Targaryen victory; House Gardener extinguished; King Loren bent the knee.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Field_of_Fire'
  },
  {
    id: 'battle_of_the_bastards',
    name: 'Battle of the Bastards',
    conflict: 'War of the Five Kings (Northern War)',
    year: '303 AC',
    coords: [1835, 2515],
    locationName: 'Plains Outside Winterfell',
    region: 'north',
    description: 'The climactic battle for the restoration of House Stark in the North. Jon Snow led a desperate force of wildlings and northern loyalists against Lord Ramsay Bolton. Just as Bolton\'s phalanx encircled the Stark host, the Knights of the Vale summoned by Sansa Stark smashed into the Bolton rear, liberating Winterfell.',
    combatants: {
      sideA: {
        name: 'Stark-Arryn Coalition',
        commanders: ['Jon Snow', 'Sansa Stark', 'Tormund Giantsbane', 'Lord Petyr Baelish', 'Wun Wun †'],
        forces: '~2,500 Free Folk & loyalist Northerners + ~2,000 Knights of the Vale',
        factions: ['House Stark', 'Free Folk', 'Knights of the Vale', 'House Mormont']
      },
      sideB: {
        name: 'House Bolton & Northern Allies',
        commanders: ['Lord Ramsay Bolton', 'Lord Harald Karstark', 'Lord Smalljon Umber †'],
        forces: '~6,000 heavy cavalry, archers, and pikemen',
        factions: ['House Bolton', 'House Umber', 'House Karstark']
      }
    },
    victor: 'Stark-Arryn Coalition (House Stark & Knights of the Vale)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Stark victory; House Bolton extinguished; Jon Snow proclaimed King in the North.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Bastards'
  },
  {
    id: 'battle_of_winterfell',
    name: 'The Battle of Winterfell (The Long Night)',
    conflict: 'The Great War',
    year: '304 AC',
    coords: [1812, 2480],
    locationName: 'Winterfell Fortress',
    region: 'north',
    description: 'The apocalyptic stand of the Living against the dead. As an endless blizzard engulfed Winterfell, the Night King unleashed an overwhelming tide of wights and an undead dragon. Arya Stark penetrated the Godswood and struck down the Night King with the Valyrian steel catspaw dagger, shattering the White Walkers.',
    combatants: {
      sideA: {
        name: 'The Coalition of the Living',
        commanders: ['Jon Snow', 'Queen Daenerys Targaryen', 'Arya Stark', 'Ser Jorah Mormont †', 'Theon Greyjoy †'],
        forces: '~40,000 soldiers, 2 Dragons (Drogon, Rhaegal)',
        factions: ['House Stark', 'House Targaryen', 'Knights of the Vale', 'Dothraki', 'Unsullied', 'Free Folk']
      },
      sideB: {
        name: 'The Army of the Dead',
        commanders: ['The Night King †', 'White Walkers', 'Undead Viserion †'],
        forces: '100,000+ Wights, Giants, Ice Dragon',
        factions: ['The White Walkers', 'Army of the Dead']
      }
    },
    victor: 'The Coalition of the Living',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive victory for the Living; the Night King destroyed; end of the Great War.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_Winterfell'
  },
  {
    id: 'battle_of_the_whispering_wood',
    name: 'Battle of the Whispering Wood',
    conflict: 'War of the Five Kings',
    year: '298 AC',
    coords: [1475, 4170],
    locationName: 'The Whispering Wood, Riverlands',
    region: 'riverlands',
    description: "Robb Stark executed a masterstroke of tactical deception by crossing the Twins and ambushing Ser Jaime Lannister's western force in a heavily forested valley. The Lannister vanguard was surrounded and annihilated, and Jaime Lannister was taken prisoner in single combat.",
    combatants: {
      sideA: {
        name: 'Northern Army',
        commanders: ['Robb Stark', 'Ser Brynden Tully', 'Lord Greatjon Umber'],
        forces: '6,000 northern cavalry & Freys',
        factions: ['House Stark', 'House Tully', 'House Frey']
      },
      sideB: {
        name: 'Lannister Vanguard',
        commanders: ['Ser Jaime Lannister (captured)', 'Lord Leo Lefford'],
        forces: '15,000 western horse and foot',
        factions: ['House Lannister']
      }
    },
    victor: 'Northern Army (House Stark)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Northern victory; Ser Jaime Lannister captured; opened path to relieve Riverrun.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Whispering_Wood'
  },
  {
    id: 'battle_above_the_gods_eye',
    name: 'Battle Above the Gods Eye',
    conflict: 'Dance of the Dragons',
    year: '130 AC',
    coords: [1780, 4440],
    locationName: 'The Gods Eye Lake & Harrenhal',
    region: 'riverlands',
    description: "The most legendary dragon duel in history. Prince Daemon Targaryen on Caraxes waited at Harrenhal for Prince Aemond Targaryen upon Vhagar. In the tempestuous sky above the Gods Eye, Daemon leaped from his saddle mid-air and drove Dark Sister through Aemond's blind eye as both dragons crashed into the lake.",
    combatants: {
      sideA: {
        name: 'The Blacks',
        commanders: ['Prince Daemon Targaryen † upon Caraxes †'],
        forces: '1 Dragonrider & Caraxes (The Blood Wyrm)',
        factions: ['House Targaryen (Blacks)']
      },
      sideB: {
        name: 'The Greens',
        commanders: ['Prince Aemond Targaryen † upon Vhagar †'],
        forces: '1 Dragonrider & Vhagar (The Queen of All Dragons)',
        factions: ['House Targaryen (Greens)']
      }
    },
    victor: 'The Blacks (Mutual Annihilation / Pyrrhic Victory)',
    victorySide: 'pyrrhic',
    outcomeDetails: "Mutual destruction; Vhagar and Aemond eliminated as the Greens' supreme military asset.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_Above_the_Gods_Eye'
  },
  {
    id: 'battle_of_the_gullet',
    name: 'Battle of the Gullet',
    conflict: 'Dance of the Dragons',
    year: '129 AC',
    coords: [2340, 4550],
    locationName: 'The Gullet (Between Dragonstone & Driftmark)',
    region: 'crownlands',
    description: 'One of the bloodiest naval engagements in history. The Triarchy dispatched ninety warships to break the Velaryon blockade. Five dragonriders descended from the skies to torch the fleet, but Prince Jacaerys Velaryon and his dragon Vermax crashed into the sea under heavy crossbow fire.',
    combatants: {
      sideA: {
        name: 'The Blacks & Velaryon Fleet',
        commanders: ['Prince Jacaerys Velaryon †', 'Lord Corlys Velaryon', 'Addam of Hull', 'Hugh Hammer'],
        forces: 'Velaryon Fleet & 5 Dragons (Vermax, Seasmoke, Vermithor, Silverwing, Sheepstealer)',
        factions: ['House Velaryon', 'House Targaryen (Blacks)']
      },
      sideB: {
        name: 'Triarchy Fleet (Kingdom of the Three Daughters)',
        commanders: ['Admiral Sharako Lohar'],
        forces: '90 Triarchy galleys and corsair vessels',
        factions: ['The Triarchy (Lys, Myr, Tyrosh)']
      }
    },
    victor: 'Strategic Black Victory (Pyrrhic)',
    victorySide: 'pyrrhic',
    outcomeDetails: 'Triarchy fleet shattered with 62 ships sunk; Prince Jacaerys killed; Spicetown sacked.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Gullet'
  },
  {
    id: 'battle_of_castle_black',
    name: 'Battle of Castle Black',
    conflict: 'Wildling Invasion of the North',
    year: '300 AC',
    coords: [1970, 1530],
    locationName: 'Castle Black, The Wall',
    region: 'the_wall',
    description: "Mance Rayder brought a massive host of 100,000 wildlings, mammoths, and giants to breach the Wall. Jon Snow and a small garrison held the gate. As the defenders reached exhaustion, King Stannis Baratheon arrived with 1,500 mounted knights in a devastating double envelopment through the forest.",
    combatants: {
      sideA: {
        name: "Night's Watch & House Baratheon",
        commanders: ['Jon Snow', 'Maester Aemon', 'King Stannis Baratheon', 'Ser Davos Seaworth'],
        forces: "~100 Night's Watch brothers + ~1,500 Baratheon heavy cavalry",
        factions: ["Night's Watch", 'House Baratheon of Dragonstone']
      },
      sideB: {
        name: 'Free Folk Host',
        commanders: ['Mance Rayder (captured)', 'Tormund Giantsbane', 'Mag Mar Tun Doh Weg †'],
        forces: '100,000 wildlings, giants, mammoths, and wargs',
        factions: ['Free Folk / Wildlings']
      }
    },
    victor: "Night's Watch & House Baratheon",
    victorySide: 'sideA',
    outcomeDetails: 'Decisive defense; Wall secured; Mance Rayder captured; Stannis established northern base.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_Castle_Black'
  },
  {
    id: 'battle_of_the_redgrass_field',
    name: 'Battle of the Redgrass Field',
    conflict: 'First Blackfyre Rebellion',
    year: '196 AC',
    coords: [1840, 4820],
    locationName: 'The Redgrass Field, Crownlands',
    region: 'crownlands',
    description: "The bloodiest brother-against-brother war in Targaryen history. Daemon I Blackfyre routed the royal vanguard, but Bloodraven seized the Weeping Ridge with his Raven's Teeth archers and rained arrows upon Daemon and his sons, while Prince Baelor Breakspear led a hammer strike into the rebel rear.",
    combatants: {
      sideA: {
        name: 'Targaryen Loyalists',
        commanders: ['Prince Baelor Breakspear', 'Prince Maekar Targaryen', 'Brynden Rivers (Bloodraven)'],
        forces: '~35,000 loyalist forces',
        factions: ['House Targaryen', 'House Martell', 'House Arryn']
      },
      sideB: {
        name: 'Blackfyre Rebels',
        commanders: ['Daemon I Blackfyre †', 'Ser Aegor Rivers (Bittersteel)', 'Ser Gwayne Corbray'],
        forces: '~35,000 rebel lords and knights',
        factions: ['House Blackfyre', 'House Bracken', 'House Peake']
      }
    },
    victor: 'Targaryen Loyalists (House Targaryen)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive royal victory; Daemon Blackfyre slain; Bittersteel fled to Essos.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Redgrass_Field'
  },
  {
    id: 'burning_of_harrenhal',
    name: 'Burning of Harrenhal',
    conflict: "Aegon's Conquest",
    year: '2 BC',
    coords: [1756, 4390],
    locationName: 'Harrenhal, Riverlands',
    region: 'riverlands',
    description: "King Harren the Black believed his titan fortress with five stone towers was impregnable. Aegon Targaryen took flight upon Balerion the Black Dread at nightfall, soaring above the clouds before breathing dragonflame that turned stone to molten slag, incinerating Harren and his entire line.",
    combatants: {
      sideA: {
        name: 'Kingdom of the Isles and the Rivers',
        commanders: ['King Harren the Black †'],
        forces: "Harren's garrison & ironborn host in the fortress",
        factions: ['House Hoare']
      },
      sideB: {
        name: 'House Targaryen & Riverlander Rebels',
        commanders: ['King Aegon I Targaryen', 'Lord Edmyn Tully'],
        forces: 'Aegon I atop Balerion + 8,000 Riverlander rebels',
        factions: ['House Targaryen', 'House Tully']
      }
    },
    victor: 'House Targaryen',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive Targaryen victory; House Hoare extinguished; Edmyn Tully named Lord Paramount of the Trident.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Burning_of_Harrenhal'
  },
  {
    id: 'the_last_storm',
    name: 'The Last Storm',
    conflict: "Aegon's Conquest",
    year: '2 BC',
    coords: [2120, 5030],
    locationName: 'Plains South of Bronzegate, Stormlands',
    region: 'stormlands',
    description: 'King Argilac the Arrogant rode forth in a howling gale to meet Orys Baratheon. The storm favored the Stormlanders at first, but Queen Rhaenys upon Meraxes negated their advance. Orys Baratheon slew Argilac in single combat, claiming his sigil, words, and castle.',
    combatants: {
      sideA: {
        name: 'Kingdom of the Storm',
        commanders: ['King Argilac Durrandon (The Arrogant) †'],
        forces: '10,000 Stormland knights and infantry',
        factions: ['House Durrandon']
      },
      sideB: {
        name: 'House Targaryen',
        commanders: ['Orys Baratheon', 'Queen Rhaenys Targaryen'],
        forces: '4,000 Targaryen soldiers & Dragon Meraxes',
        factions: ['House Targaryen', 'House Baratheon']
      }
    },
    victor: 'House Targaryen (House Baratheon founded)',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive victory; Argilac slain; Storm\'s End yielded; Orys Baratheon became Lord Paramount of the Stormlands.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/The_Last_Storm'
  },
  {
    id: 'battle_of_the_bells',
    name: 'Battle of the Bells',
    conflict: "Robert's Rebellion",
    year: '283 AC',
    coords: [1610, 4490],
    locationName: 'Stoney Sept, Riverlands',
    region: 'riverlands',
    description: 'Hand of the King Jon Connington trapped an injured Robert Baratheon in Stoney Sept. Before Connington could locate him, Ned Stark and Hoster Tully arrived with a relief army. As church bells rang the alarm, Robert surged from hiding with his warhammer and routed the royal army.',
    combatants: {
      sideA: {
        name: 'Rebel Coalition',
        commanders: ['Lord Robert Baratheon', 'Lord Eddard Stark', 'Lord Hoster Tully'],
        forces: 'Combined rebel relief host & loyal townsfolk',
        factions: ['House Baratheon', 'House Stark', 'House Tully', 'House Arryn']
      },
      sideB: {
        name: 'Targaryen Royal Army',
        commanders: ['Lord Jon Connington (Hand of the King)', 'Ser Myles Mooton †'],
        forces: 'Royal army vanguard',
        factions: ['House Targaryen']
      }
    },
    victor: 'Rebel Coalition (House Baratheon & Allies)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive rebel victory; Jon Connington stripped of lands and exiled by King Aerys II.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Bells'
  },
  {
    id: 'sack_of_kings_landing',
    name: "Sack of King's Landing",
    conflict: "Robert's Rebellion",
    year: '283 AC',
    coords: [1942, 4589],
    locationName: "King's Landing",
    region: 'crownlands',
    description: "Lord Tywin Lannister arrived at King's Landing professing loyalty. Convinced by Grand Maester Pycelle, King Aerys opened the gates, whereupon Tywin ordered the city sacked. When Aerys ordered the city consumed in wildfire, Ser Jaime Lannister killed the Mad King before the Iron Throne.",
    combatants: {
      sideA: {
        name: 'House Lannister',
        commanders: ['Lord Tywin Lannister', 'Ser Jaime Lannister', 'Ser Gregor Clegane'],
        forces: '12,000 western knights and foot',
        factions: ['House Lannister']
      },
      sideB: {
        name: 'Targaryen Royal Regime',
        commanders: ['King Aerys II Targaryen †', 'Lord Rossart †'],
        forces: 'City Watch and Red Keep royal guards',
        factions: ['House Targaryen', 'City Watch of King\'s Landing']
      }
    },
    victor: 'House Lannister (for Robert Baratheon)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Lannister takeover; death of King Aerys II; end of the Targaryen dynasty.',
    wikiUrl: "https://gameofthrones.fandom.com/wiki/Sack_of_King's_Landing"
  },
  {
    id: 'siege_of_pyke',
    name: 'Siege of Pyke',
    conflict: "Greyjoy's Rebellion",
    year: '289 AC',
    coords: [985, 3950],
    locationName: 'Pyke Castle, Iron Islands',
    region: 'iron_islands',
    description: 'King Robert Baratheon and Lord Eddard Stark landed thousands of soldiers upon the Iron Islands. Siege engines battered the southern curtain wall of Pyke into rubble. Thoros of Myr charged through the breach with a flaming sword followed by Jorah Mormont, forcing Balon Greyjoy to bend the knee.',
    combatants: {
      sideA: {
        name: 'Ironborn Rebels',
        commanders: ['King Balon Greyjoy (surrendered)', 'Maron Greyjoy †'],
        forces: 'Ironborn castle defenders',
        factions: ['House Greyjoy']
      },
      sideB: {
        name: 'Baratheon-Stark Coalition',
        commanders: ['King Robert Baratheon', 'Lord Eddard Stark', 'Thoros of Myr', 'Ser Jorah Mormont'],
        forces: 'Royal army and fleet (~15,000)',
        factions: ['House Baratheon', 'House Stark', 'Iron Throne']
      }
    },
    victor: 'Baratheon-Stark Coalition (Iron Throne)',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive Royal victory; Balon Greyjoy yielded; Theon Greyjoy taken as ward of Winterfell.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Siege_of_Pyke'
  },
  {
    id: 'battle_of_the_goldroad',
    name: 'Battle of the Goldroad (The Spoils of War)',
    conflict: "War of the Five Kings / Daenerys' Invasion",
    year: '304 AC',
    coords: [1720, 4660],
    locationName: 'The Goldroad, Crownlands',
    region: 'crownlands',
    description: 'Returning laden with Highgarden gold and grain, the Lannister-Tarly army was ambushed by the Dothraki horde. Queen Daenerys Targaryen soared on Drogon, shattering their defensive shieldwall with streams of dragonfire and incinerating the Lannister supply train.',
    combatants: {
      sideA: {
        name: 'Lannister-Tarly Army',
        commanders: ['Ser Jaime Lannister', 'Lord Randyll Tarly †', 'Dickon Tarly †', 'Ser Bronn'],
        forces: '~10,000 soldiers and caravan guards',
        factions: ['House Lannister', 'House Tarly']
      },
      sideB: {
        name: 'House Targaryen',
        commanders: ['Queen Daenerys Targaryen', 'Drogon'],
        forces: 'Dothraki Khalasar (~10,000 riders) & Drogon',
        factions: ['House Targaryen', 'Dothraki']
      }
    },
    victor: 'House Targaryen',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive Targaryen victory; caravan incinerated; Randyll and Dickon Tarly executed by dragonfire.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Goldroad'
  },
  {
    id: 'battle_of_the_camps',
    name: 'Battle of the Camps',
    conflict: 'War of the Five Kings',
    year: '298 AC',
    coords: [1515, 4153],
    locationName: 'Riverrun & Red Fork Basin',
    region: 'riverlands',
    description: "Following the Whispering Wood, Robb Stark launched a nighttime surprise attack on the three divided Lannister camps besieging Riverrun. Guided by Brynden Blackfish, the Northmen struck the first camp while Lord Tytos Blackwood sallied from the castle, breaking the siege.",
    combatants: {
      sideA: {
        name: 'Northern & Riverlander Host',
        commanders: ['Robb Stark', 'Ser Brynden Tully', 'Lord Tytos Blackwood'],
        forces: '6,000 horse + Riverrun garrison',
        factions: ['House Stark', 'House Tully', 'House Blackwood']
      },
      sideB: {
        name: 'Lannister Besieging Army',
        commanders: ['Lord Andros Brax †', 'Ser Forley Prester'],
        forces: '12,000 men distributed across three camps',
        factions: ['House Lannister']
      }
    },
    victor: 'Northern & Riverlander Host (House Stark)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Stark victory; Riverrun relieved; western presence in the Riverlands broken.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Camps'
  },
  {
    id: 'battle_of_the_green_fork',
    name: 'Battle of the Green Fork',
    conflict: 'War of the Five Kings',
    year: '298 AC',
    coords: [1860, 3960],
    locationName: 'The Green Fork, Riverlands',
    region: 'riverlands',
    description: "Lord Roose Bolton led the northern foot in a night march to surprise Lord Tywin Lannister's main army. Though Bolton's men were repelled by Tywin's armored cavalry, Bolton retreated in good order, successfully pinning Tywin in place while Robb relieved Riverrun.",
    combatants: {
      sideA: {
        name: 'Northern Foot',
        commanders: ['Lord Roose Bolton', 'Robett Glover', 'Harrion Karstark (captured)'],
        forces: '~17,000 northern infantry',
        factions: ['House Bolton', 'House Stark', 'House Karstark']
      },
      sideB: {
        name: 'Lannister Main Host',
        commanders: ['Lord Tywin Lannister', 'Ser Gregor Clegane', 'Tyrion Lannister'],
        forces: '~20,000 western knights and men-at-arms',
        factions: ['House Lannister']
      }
    },
    victor: 'House Lannister (Tactical Lannister / Strategic Northern Delay)',
    victorySide: 'sideB',
    outcomeDetails: 'Tactical Lannister victory; strategic Northern success shielding Robb at Whispering Wood.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Green_Fork'
  },
  {
    id: 'battle_of_oxcross',
    name: 'Battle of Oxcross',
    conflict: 'War of the Five Kings',
    year: '299 AC',
    coords: [1140, 4420],
    locationName: 'Oxcross, Westerlands',
    region: 'westerlands',
    description: "After outmaneuvering the Golden Tooth via a goat path found by his direwolf Grey Wind, Robb Stark penetrated deep into the Westerlands. In the dead of night, the Northmen descended upon Ser Stafford Lannister's raw levies training at Oxcross, routing them completely.",
    combatants: {
      sideA: {
        name: 'Northern Army',
        commanders: ['King Robb Stark', 'Ser Brynden Tully', 'Grey Wind'],
        forces: '6,000 northern horse',
        factions: ['House Stark', 'House Tully']
      },
      sideB: {
        name: 'Newly-Raised Western Army',
        commanders: ['Ser Stafford Lannister †', 'Lord Antario Jast'],
        forces: '10,000 recruits and knights',
        factions: ['House Lannister']
      }
    },
    victor: 'Northern Army (House Stark)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Stark victory; Stafford Lannister slain; the Westerlands opened to northern raiding.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_Oxcross'
  },
  {
    id: 'battle_of_the_fords',
    name: 'Battle of the Fords',
    conflict: 'War of the Five Kings',
    year: '299 AC',
    coords: [1530, 4260],
    locationName: 'The Red Fork Fords & Stone Mill',
    region: 'riverlands',
    description: "Ser Edmure Tully entrenched Riverlander forces across a dozen crossings along the Red Fork, frustrating Lord Tywin Lannister's attempts to cross into the Westerlands. While a tactical triumph, it delayed Tywin just long enough to receive word of Stannis marching on King's Landing.",
    combatants: {
      sideA: {
        name: 'Riverlands Defense',
        commanders: ['Ser Edmure Tully', 'Lord Jason Mallister'],
        forces: '11,000 rivermen',
        factions: ['House Tully', 'House Mallister']
      },
      sideB: {
        name: 'Lannister Main Army',
        commanders: ['Lord Tywin Lannister', 'Ser Gregor Clegane', 'Lord Leo Lefford †'],
        forces: '20,000 soldiers',
        factions: ['House Lannister']
      }
    },
    victor: 'Riverlands Defense (House Tully)',
    victorySide: 'sideA',
    outcomeDetails: "Tactical Tully victory; prevented Tywin's crossing, inadvertently allowing Tywin to relieve Blackwater.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Fords'
  },
  {
    id: 'first_battle_of_tumbleton',
    name: 'First Battle of Tumbleton',
    conflict: 'Dance of the Dragons',
    year: '130 AC',
    coords: [1650, 4710],
    locationName: 'Tumbleton, The Reach',
    region: 'reach',
    description: "Queen Rhaenyra dispatched Ser Addam Velaryon on Seasmoke and the two dragonseeds Hugh Hammer and Ulf White with dragons Vermithor and Silverwing to defend Tumbleton. Mid-battle, the Two Betrayers turned their dragons upon the Black army, burning their own comrades and sacking the town.",
    combatants: {
      sideA: {
        name: 'The Blacks',
        commanders: ['Lord Roderick Dustin †', 'Ser Addam Velaryon', 'Hugh Hammer (defected)', 'Ulf White (defected)'],
        forces: '9,000 Riverlanders and Northmen',
        factions: ['House Dustin', 'House Footly']
      },
      sideB: {
        name: 'The Greens',
        commanders: ['Lord Ormund Hightower †', 'Prince Daeron Targaryen upon Tessarion'],
        forces: '15,000 Reachmen & 1 Dragon',
        factions: ['House Hightower', 'House Targaryen (Greens)']
      }
    },
    victor: 'The Greens (via betrayal of the Two Betrayers)',
    victorySide: 'sideB',
    outcomeDetails: 'Decisive Green victory; Tumbleton burned; Hugh Hammer and Ulf the White betrayed Rhaenyra.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/First_Battle_of_Tumbleton'
  },
  {
    id: 'second_battle_of_tumbleton',
    name: 'Second Battle of Tumbleton',
    conflict: 'Dance of the Dragons',
    year: '130 AC',
    coords: [1652, 4712],
    locationName: 'Tumbleton Ruins, The Reach',
    region: 'reach',
    description: 'Determined to prove that bastards need not be traitors, Ser Addam Velaryon assembled 4,000 Riverlanders and launched a surprise night attack on the drunken Green encampment at Tumbleton. In the chaotic dawn, Vermithor, Seasmoke, and Tessarion clashed in a three-way dragon melee where all three perished.',
    combatants: {
      sideA: {
        name: 'The Blacks',
        commanders: ['Ser Addam Velaryon † upon Seasmoke †'],
        forces: '4,000 Riverlander knights and men',
        factions: ['House Velaryon', 'House Tully']
      },
      sideB: {
        name: 'The Greens',
        commanders: ['Prince Daeron Targaryen †', 'Hugh Hammer †', 'Ulf White †'],
        forces: 'Green army with dragons Vermithor and Silverwing',
        factions: ['House Hightower', 'The Two Betrayers']
      }
    },
    victor: 'The Blacks (Pyrrhic / Complete Mutual Devastation)',
    victorySide: 'pyrrhic',
    outcomeDetails: "Strategic Black victory; Green march on King's Landing halted; death of three dragons.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Second_Battle_of_Tumbleton'
  },
  {
    id: 'battle_of_the_three_thousand',
    name: 'Battle of the Three Thousand of Qohor',
    conflict: 'Century of Blood',
    year: '~200 BC',
    coords: [4320, 3990],
    locationName: 'Gates of Qohor, Essos',
    region: 'essos',
    description: 'During the Century of Blood, Khal Temmo led 50,000 Dothraki to sack Qohor. With sellswords fleeing, Qohor hired 3,000 Unsullied spearmen from Astapor. In eighteen consecutive charges, the Dothraki broke against the disciplined spear hedge until over 12,000 horselords fell, forcing the Dothraki to cut their braids in tribute.',
    combatants: {
      sideA: {
        name: 'Defenders of Qohor',
        commanders: ['The Three Thousand Unsullied'],
        forces: '3,000 Unsullied spearmen',
        factions: ['City of Qohor', 'Unsullied']
      },
      sideB: {
        name: 'Dothraki Khalasar',
        commanders: ['Khal Temmo †'],
        forces: '50,000 Dothraki mounted warriors',
        factions: ['Dothraki Horde']
      }
    },
    victor: 'The Three Thousand Unsullied',
    victorySide: 'sideA',
    outcomeDetails: 'Legendary Unsullied victory; Qohor saved; established the enduring military renown of the Unsullied.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Three_Thousand_of_Qohor'
  },
  {
    id: 'siege_of_meereen',
    name: 'Siege of Meereen (Battle of Fire)',
    conflict: "Daenerys' Essos Campaign",
    year: '303 AC',
    coords: [5420, 5370],
    locationName: 'Bay and Walls of Meereen',
    region: 'essos',
    description: "The allied Masters of Yunkai, Astapor, and Volantis deployed a massive armada to bombard Meereen with trebuchets. Returning upon Drogon, Queen Daenerys unchained Rhaegal and Viserion, incinerating the slaver armada in the bay while the Dothraki cut down the Sons of the Harpy.",
    combatants: {
      sideA: {
        name: 'House Targaryen & Freedmen',
        commanders: ['Queen Daenerys Targaryen', 'Tyrion Lannister', 'Grey Worm', 'Daario Naharis'],
        forces: 'Unsullied, Dothraki horde, 3 Dragons',
        factions: ['House Targaryen', 'Unsullied', 'Dothraki']
      },
      sideB: {
        name: 'Slaver Coalition',
        commanders: ['Razdal mo Eraz', 'Belicho Paenymion †'],
        forces: 'Slaver armada (~100 ships) & mercenary armies',
        factions: ['Masters of Yunkai', 'Volantis', 'Astapor']
      }
    },
    victor: 'House Targaryen',
    victorySide: 'sideA',
    outcomeDetails: "Decisive Targaryen victory; Slaver Fleet destroyed; slavery permanently abolished in Slaver's Bay.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Siege_of_Meereen'
  },
  {
    id: 'massacre_at_hardhome',
    name: 'Massacre at Hardhome',
    conflict: 'War for the Dawn',
    year: '302 AC',
    coords: [2420, 1260],
    locationName: 'Hardhome, Beyond the Wall',
    region: 'beyond_the_wall',
    description: 'Jon Snow led a rescue expedition of Night\'s Watch brothers to evacuate Free Folk at Hardhome. As thousands boarded the boats, the White Walkers unleashed an avalanche of wights. Jon slew a White Walker with Longclaw, discovering Valyrian steel\'s power, before escaping as the Night King reanimated the dead.',
    combatants: {
      sideA: {
        name: 'Free Folk & Night\'s Watch',
        commanders: ['Jon Snow', 'Tormund Giantsbane', 'Karsi †', 'Eddison Tollett'],
        forces: '~5,000 evacuees and brothers',
        factions: ['Free Folk', "Night's Watch"]
      },
      sideB: {
        name: 'The Army of the Dead',
        commanders: ['The Night King', 'White Walkers'],
        forces: 'Overwhelming host of Wights',
        factions: ['White Walkers', 'Army of the Dead']
      }
    },
    victor: 'The Army of the Dead',
    victorySide: 'sideB',
    outcomeDetails: 'Catastrophic slaughter of the Free Folk; ~5,000 dead reanimated; remaining survivors evacuated south.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Massacre_at_Hardhome'
  },
  {
    id: 'siege_of_storms_end',
    name: "Siege of Storm's End",
    conflict: "Robert's Rebellion",
    year: '282-283 AC',
    coords: [2253, 4945],
    locationName: "Storm's End, Stormlands",
    region: 'stormlands',
    description: "For nearly a year, Lord Stannis Baratheon held Storm's End against the full might of the Reach under Lord Mace Tyrell and Paxter Redwyne's naval blockade. Smuggler Davos slipped past the war galleys with onions and fish, allowing the garrison to endure until Eddard Stark lifted the siege.",
    combatants: {
      sideA: {
        name: 'Rebel Garrison',
        commanders: ['Stannis Baratheon', 'Davos Seaworth (smuggler relief)'],
        forces: '~500 Baratheon defenders',
        factions: ['House Baratheon']
      },
      sideB: {
        name: 'Reach Loyalist Host',
        commanders: ['Lord Mace Tyrell', 'Lord Paxter Redwyne', 'Lord Randyll Tarly'],
        forces: '~30,000 Reachmen and Redwyne Fleet',
        factions: ['House Tyrell', 'House Redwyne']
      }
    },
    victor: 'Rebel Garrison (Stalemate / Relieved by Eddard Stark)',
    victorySide: 'sideA',
    outcomeDetails: 'Successful defense; tied down the largest loyalist army for the entirety of the rebellion.',
    wikiUrl: "https://gameofthrones.fandom.com/wiki/Siege_of_Storm's_End"
  },
  {
    id: 'battle_of_ashford',
    name: 'Battle of Ashford',
    conflict: "Robert's Rebellion",
    year: '282 AC',
    coords: [1480, 5210],
    locationName: 'Ashford, The Reach',
    region: 'reach',
    description: "Lord Randyll Tarly led the vanguard of the Reach and attacked Robert Baratheon's rebel army at Ashford before Lord Mace Tyrell's main army arrived. Tarly routed the rebel lines, forcing Robert to disengage and retreat northward toward the Riverlands in his only defeat of the war.",
    combatants: {
      sideA: {
        name: 'Rebel Army',
        commanders: ['Lord Robert Baratheon', 'Lord Cafferen †'],
        forces: 'Stormlands rebel forces',
        factions: ['House Baratheon']
      },
      sideB: {
        name: 'Reach Loyalist Army',
        commanders: ['Lord Randyll Tarly', 'Lord Mace Tyrell'],
        forces: 'Reach vanguard and main body',
        factions: ['House Tarly', 'House Tyrell']
      }
    },
    victor: 'Reach Loyalist Army (Randyll Tarly)',
    victorySide: 'sideB',
    outcomeDetails: 'Tactical Loyalist victory; Robert withdrew north; sole defeat suffered by Robert during the war.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_Ashford'
  },
  {
    id: 'sea_battle_of_fair_isle',
    name: 'Sea Battle of Fair Isle',
    conflict: "Greyjoy's Rebellion",
    year: '289 AC',
    coords: [850, 4300],
    locationName: 'Fair Isle Straits, Sunset Sea',
    region: 'westerlands',
    description: 'Master of Ships Stannis Baratheon commanded the Royal Fleet and Redwyne Fleet against the Iron Fleet under Victarion Greyjoy. Stannis trapped the longships in the narrow straits between Fair Isle and the mainland, sinking the ironborn vessels from all sides and crushing their naval power.',
    combatants: {
      sideA: {
        name: 'Royal Fleet & Redwyne Fleet',
        commanders: ['Lord Stannis Baratheon', 'Lord Paxter Redwyne'],
        forces: 'Royal war dromons and Redwyne galleys',
        factions: ['House Baratheon', 'House Redwyne', 'Iron Throne']
      },
      sideB: {
        name: 'The Iron Fleet',
        commanders: ['Victarion Greyjoy'],
        forces: 'Ironborn longships and galleys',
        factions: ['House Greyjoy', 'Iron Fleet']
      }
    },
    victor: 'Royal Fleet (House Baratheon)',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Royal naval victory; broke Ironborn naval dominance and allowed the invasion of Pyke.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_Fair_Isle'
  },
  {
    id: 'fall_of_astapor',
    name: 'Fall of Astapor (The Sack of Astapor)',
    conflict: "Daenerys' Essos Campaign",
    year: '299 AC',
    coords: [5216, 5834],
    locationName: 'Plaza of Punishment, Astapor',
    region: 'essos',
    description: "Pretending to trade her dragon Drogon to the Good Masters for 8,000 Unsullied, Daenerys Targaryen accepted the harpy's scourge as master of the army. She immediately turned to Drogon and uttered 'Dracarys', incinerating Kraznys mo Nakloz and commanding the Unsullied to free all slaves.",
    combatants: {
      sideA: {
        name: 'House Targaryen',
        commanders: ['Queen Daenerys Targaryen', 'Drogon', 'Ser Jorah Mormont', 'Ser Barristan Selmy'],
        forces: '8,000 newly acquired Unsullied & Drogon',
        factions: ['House Targaryen', 'Unsullied']
      },
      sideB: {
        name: 'The Good Masters',
        commanders: ['Kraznys mo Nakloz †', 'Grazdan mo Ullhor'],
        forces: 'City guards and slaver mercenaries',
        factions: ['Good Masters of Astapor']
      }
    },
    victor: 'House Targaryen',
    victorySide: 'sideA',
    outcomeDetails: 'Decisive Targaryen victory; Astapor conquered; 8,000 Unsullied liberated as free soldiers.',
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Fall_of_Astapor'
  },
  {
    id: 'battle_of_the_stone_mill',
    name: 'Battle of the Stone Mill',
    conflict: 'War of the Five Kings',
    year: '299 AC',
    coords: [1535, 4270],
    locationName: 'The Stone Mill, Riverlands',
    region: 'riverlands',
    description: 'The bloodiest engagement of the Battle of the Fords. Ser Gregor Clegane led a fierce western vanguard across the Red Fork at the Stone Mill. Ser Edmure Tully held the riverbank steadfastly, repelling Clegane with archery before a cavalry counter-charge threw Gregor back across the river with severe wounds.',
    combatants: {
      sideA: {
        name: 'Riverrun Defense',
        commanders: ['Ser Edmure Tully', 'Lord Jason Mallister'],
        forces: 'Riverlander infantry & longbowmen',
        factions: ['House Tully', 'House Mallister']
      },
      sideB: {
        name: 'Lannister Vanguard',
        commanders: ['Ser Gregor Clegane', 'Lord Leo Lefford †'],
        forces: 'Western knights and shock cavalry',
        factions: ['House Lannister']
      }
    },
    victor: 'Riverrun Defense (House Tully)',
    victorySide: 'sideA',
    outcomeDetails: "Decisive Riverlander tactical victory; Clegane's vanguard routed; river line secured.",
    wikiUrl: 'https://gameofthrones.fandom.com/wiki/Battle_of_the_Stone_Mill'
  }
];
