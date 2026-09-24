import json
import os
import re

# 1. Base 70 canonical nodes with rich lore
CANONICAL_70 = {
    "castle_black": {
        "name": "Castle Black",
        "region": "north",
        "type": "castle",
        "coords": [1930, 2248],
        "isHub": True,
        "allegiance": "Night's Watch",
        "loreSnippet": "Headquarters of the Night's Watch beneath the towering 700-foot ice wall.",
    },
    "shadow_tower": {
        "name": "The Shadow Tower",
        "region": "north",
        "type": "castle",
        "coords": [1714, 2285],
        "allegiance": "Night's Watch",
        "loreSnippet": "Western bastion of the Wall guarding the Bridge of Skulls and the Gorge.",
    },
    "eastwatch": {
        "name": "Eastwatch-by-the-Sea",
        "region": "north",
        "type": "port",
        "coords": [2070, 2248],
        "isPort": True,
        "isHub": True,
        "allegiance": "Night's Watch",
        "loreSnippet": "Eastern terminal of the Wall where the Night's Watch moors its modest fleet.",
    },
    "winterfell": {
        "name": "Winterfell",
        "region": "north",
        "type": "capital",
        "coords": [1631, 2892],
        "isHub": True,
        "allegiance": "House Stark",
        "loreSnippet": "Ancient seat of House Stark, heated by natural subterranean hot springs.",
    },
    "white_harbor": {
        "name": "White Harbor",
        "region": "north",
        "type": "major_city",
        "coords": [1848, 3300],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Manderly",
        "loreSnippet": "The North's only true city and primary trading seaport, protected by the Wolf's Den.",
    },
    "deepwood_motte": {
        "name": "Deepwood Motte",
        "region": "north",
        "type": "castle",
        "coords": [1370, 2655],
        "allegiance": "House Glover",
        "loreSnippet": "Motte-and-bailey wooden stronghold nestled inside the vast Wolfswood.",
    },
    "torrhens_square": {
        "name": "Torrhen's Square",
        "region": "north",
        "type": "castle",
        "coords": [1384, 3055],
        "allegiance": "House Tallhart",
        "loreSnippet": "Square stone keep beside a large mountain lake southwest of Winterfell.",
    },
    "the_dreadfort": {
        "name": "The Dreadfort",
        "region": "north",
        "type": "castle",
        "coords": [2043, 2835],
        "allegiance": "House Bolton",
        "loreSnippet": "Sinister high-walled fortress of the flayed men along the volcanic Weeping Water.",
    },
    "karhold": {
        "name": "Karhold",
        "region": "north",
        "type": "castle",
        "coords": [2355, 2673],
        "allegiance": "House Karstark",
        "loreSnippet": "Isolated stronghold founded by Karlon Stark in the dense forests near the Shivering Sea.",
    },
    "last_hearth": {
        "name": "Last Hearth",
        "region": "north",
        "type": "castle",
        "coords": [1965, 2505],
        "allegiance": "House Umber",
        "loreSnippet": "Northernmost non-Wall stronghold in Westeros, surrounded by wild pine woods.",
    },
    "bear_island": {
        "name": "Bear Island",
        "region": "north",
        "type": "castle",
        "coords": [1256, 2490],
        "isPort": True,
        "allegiance": "House Mormont",
        "loreSnippet": "Rugged island redoubt of warrior women, surrounded by the icy Bay of Ice.",
    },
    "moat_cailin": {
        "name": "Moat Cailin",
        "region": "north",
        "type": "ruin",
        "coords": [1667, 3392],
        "isHub": True,
        "allegiance": "House Stark",
        "loreSnippet": "Ancient ruin of twenty stone towers, of which only three remain to choke off the Causeway.",
    },
    "greywater_watch": {
        "name": "Greywater Watch",
        "region": "north",
        "type": "castle",
        "coords": [1550, 3643],
        "allegiance": "House Reed",
        "loreSnippet": "Floating crannog castle of the Reeds, drifting perpetually within the treacherous Neck.",
    },
    "the_twins": {
        "name": "The Twins",
        "region": "riverlands",
        "type": "castle",
        "coords": [1570, 3840],
        "isHub": True,
        "allegiance": "House Frey",
        "loreSnippet": "Formidable fortified bridge of identical stone keeps commanding the Green Fork.",
    },
    "crossroads_inn": {
        "name": "Inn at the Crossroads",
        "region": "riverlands",
        "type": "junction",
        "coords": [1845, 4153],
        "isHub": True,
        "loreSnippet": "Fabled traveler crossroads where the Kingsroad, River Road, and High Road meet.",
    },
    "riverrun": {
        "name": "Riverrun",
        "region": "riverlands",
        "type": "capital",
        "coords": [1515, 4153],
        "isHub": True,
        "allegiance": "House Tully",
        "loreSnippet": "Triangular sandstone fortress positioned at the junction of the Red Fork and the Tumblestone.",
    },
    "golden_tooth": {
        "name": "The Golden Tooth",
        "region": "westerlands",
        "type": "castle",
        "coords": [1290, 4310],
        "allegiance": "House Lefford",
        "loreSnippet": "Steep mountain bastion guarding the sole gateway pass between the Riverlands and Westerlands.",
    },
    "harrenhal": {
        "name": "Harrenhal",
        "region": "riverlands",
        "type": "castle",
        "coords": [1785, 4275],
        "isHub": True,
        "loreSnippet": "Mighty ruined fortress of black stone, melted and scarred by dragonflame of Balerion.",
    },
    "maidenpool": {
        "name": "Maidenpool",
        "region": "riverlands",
        "type": "port",
        "coords": [2073, 4323],
        "isPort": True,
        "allegiance": "House Mooton",
        "loreSnippet": "Ancient walled harbor on the Bay of Crabs, where Florian first beheld Jonquil bathing.",
    },
    "saltpans": {
        "name": "Saltpans",
        "region": "riverlands",
        "type": "port",
        "coords": [1971, 4223],
        "isPort": True,
        "loreSnippet": "Small trading port where salt is panned and travelers board vessels crossing the Narrow Sea.",
    },
    "eyrie": {
        "name": "The Eyrie",
        "region": "vale",
        "type": "capital",
        "coords": [2060, 3975],
        "isHub": True,
        "allegiance": "House Arryn",
        "loreSnippet": "Seven slender white towers clinging to the shoulder of the Giant's Lance with the Sky Cells.",
    },
    "bloody_gate": {
        "name": "The Bloody Gate",
        "region": "vale",
        "type": "castle",
        "coords": [1970, 4055],
        "allegiance": "House Arryn",
        "loreSnippet": "Impregnable chokepoint fortress where a dozen armies have dashed themselves to pieces.",
    },
    "gulltown": {
        "name": "Gulltown",
        "region": "vale",
        "type": "major_city",
        "coords": [2419, 4070],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Grafton",
        "loreSnippet": "Major port city of the Vale, famous for wealthy merchant houses and trade with Braavos.",
    },
    "casterly_rock": {
        "name": "Casterly Rock",
        "region": "westerlands",
        "type": "capital",
        "coords": [1023, 4467],
        "isHub": True,
        "allegiance": "House Lannister",
        "loreSnippet": "Colossal stone promontory honeycombed with gold mines, ancient seat of House Lannister.",
    },
    "lannisport": {
        "name": "Lannisport",
        "region": "westerlands",
        "type": "major_city",
        "coords": [1020, 4500],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Lannister",
        "loreSnippet": "Gleaming coastal city and bustling port, celebrated for goldsmiths and naval strength.",
    },
    "crakehall": {
        "name": "Crakehall",
        "region": "westerlands",
        "type": "castle",
        "coords": [925, 4690],
        "allegiance": "House Crakehall",
        "loreSnippet": "Forest keep commanding the Ocean Road, seat of mighty wild-boar lords.",
    },
    "deep_den": {
        "name": "Deep Den",
        "region": "westerlands",
        "type": "castle",
        "coords": [1287, 4475],
        "allegiance": "House Lydden",
        "loreSnippet": "Strategic castle standing astride the Gold Road between high rocky gorges.",
    },
    "pyke": {
        "name": "Pyke",
        "region": "iron_islands",
        "type": "capital",
        "coords": [1051, 4043],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Greyjoy",
        "loreSnippet": "Seaswept fortress of towers joined by swaying rope bridges suspended over roaring tides.",
    },
    "kings_landing": {
        "name": "King's Landing",
        "region": "crownlands",
        "type": "capital",
        "coords": [1955, 4624],
        "isPort": True,
        "isHub": True,
        "allegiance": "The Iron Throne",
        "loreSnippet": "Sprawling capital of the Seven Kingdoms, home of the Red Keep and the Great Sept of Baelor.",
    },
    "dragonstone": {
        "name": "Dragonstone",
        "region": "crownlands",
        "type": "castle",
        "coords": [2349, 4409],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Baratheon of Dragonstone",
        "loreSnippet": "Volcanic citadel carved by Valyrian sorcery into gargoyles and dragons.",
    },
    "driftmark": {
        "name": "Driftmark",
        "region": "crownlands",
        "type": "port",
        "coords": [2326, 4433],
        "isPort": True,
        "allegiance": "House Velaryon",
        "loreSnippet": "Low fertile island seat of the Sea Snakes, guardians of Blackwater Bay.",
    },
    "duskendale": {
        "name": "Duskendale",
        "region": "crownlands",
        "type": "port",
        "coords": [2115, 4468],
        "isPort": True,
        "allegiance": "House Rykker",
        "loreSnippet": "Historic merchant port dominated by the square drum tower of the Dun Fort.",
    },
    "storms_end": {
        "name": "Storm's End",
        "region": "stormlands",
        "type": "capital",
        "coords": [2253, 4945],
        "isHub": True,
        "allegiance": "House Baratheon",
        "loreSnippet": "Massive drum tower castle shielded by ancient spells woven into its sheer curtain wall.",
    },
    "tarth": {
        "name": "Evenfall Hall (Tarth)",
        "region": "stormlands",
        "type": "castle",
        "coords": [2412, 4921],
        "isPort": True,
        "allegiance": "House Tarth",
        "loreSnippet": "Seat of the Evenstar on the Sapphire Isle, rising above turquoise crystal waters.",
    },
    "summerhall": {
        "name": "Summerhall",
        "region": "stormlands",
        "type": "ruin",
        "coords": [1909, 5023],
        "allegiance": "House Targaryen",
        "loreSnippet": "Pleasure palace turned tragic ruin where King Aegon V perished in a great fire attempting to hatch dragons.",
    },
    "bitterbridge": {
        "name": "Bitterbridge",
        "region": "reach",
        "type": "city",
        "coords": [1572, 4828],
        "isHub": True,
        "allegiance": "House Caswell",
        "loreSnippet": "Ancient wooden bridge and stone castle where the Roseroad crosses the river Mander.",
    },
    "highgarden": {
        "name": "Highgarden",
        "region": "reach",
        "type": "capital",
        "coords": [1260, 5078],
        "isHub": True,
        "allegiance": "House Tyrell",
        "loreSnippet": "Fair palace of tiered white stone walls, rose gardens, fountains, and marble colonnades.",
    },
    "oldtown": {
        "name": "Oldtown",
        "region": "reach",
        "type": "major_city",
        "coords": [1031, 5365],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Hightower",
        "loreSnippet": "Oldest and greatest center of learning, crowned by the 800-foot Hightower and the Citadel.",
    },
    "horn_hill": {
        "name": "Horn Hill",
        "region": "reach",
        "type": "castle",
        "coords": [1263, 5202],
        "allegiance": "House Tarly",
        "loreSnippet": "Richly wooded ancestral keep of House Tarly, masters of the greatsword Heartsbane.",
    },
    "the_arbor": {
        "name": "The Arbor",
        "region": "reach",
        "type": "major_city",
        "coords": [825, 5590],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Redwyne",
        "loreSnippet": "Sun-drenched southern island famed for golden vintage wines and the colossal Redwyne fleet.",
    },
    "nightsong": {
        "name": "Nightsong",
        "region": "reach",
        "type": "castle",
        "coords": [1519, 5186],
        "allegiance": "House Caron",
        "loreSnippet": "Marcher castle holding the northern approach to the Prince's Pass.",
    },
    "tower_of_joy": {
        "name": "Tower of Joy",
        "region": "dorne",
        "type": "ruin",
        "coords": [1557, 5251],
        "loreSnippet": "Solitary round stone tower in the Red Mountains where Lyanna Stark died.",
    },
    "starfall": {
        "name": "Starfall",
        "region": "dorne",
        "type": "castle",
        "coords": [1290, 5475],
        "isPort": True,
        "allegiance": "House Dayne",
        "loreSnippet": "Ancient seat of the Sword of the Morning, erected where a fallen star struck the mouth of the Torentine.",
    },
    "yronwood": {
        "name": "Yronwood",
        "region": "dorne",
        "type": "castle",
        "coords": [1784, 5397],
        "allegiance": "House Yronwood",
        "loreSnippet": "Ancient seat of House Yronwood, the Bloodroyal, guarding the Boneway.",
    },
    "sunspear": {
        "name": "Sunspear",
        "region": "dorne",
        "type": "capital",
        "coords": [2404, 5599],
        "isPort": True,
        "isHub": True,
        "allegiance": "House Martell",
        "loreSnippet": "Sand-colored fortress featuring the slender Spear Tower and the Tower of the Sun.",
    },
    "planky_town": {
        "name": "Planky Town",
        "region": "dorne",
        "type": "port",
        "coords": [2276, 5632],
        "isPort": True,
        "allegiance": "House Martell",
        "loreSnippet": "Floating harbor town of interconnected barges at the mouth of the Greenblood.",
    },
    "braavos": {
        "name": "Braavos",
        "region": "free_cities",
        "type": "capital",
        "coords": [2900, 3717],
        "isPort": True,
        "isHub": True,
        "allegiance": "Iron Bank & Sealord",
        "loreSnippet": "The Secret City of a hundred lagoon islands, guarded by the Colossus and the Faceless Men.",
    },
    "lorath": {
        "name": "Lorath",
        "region": "free_cities",
        "type": "major_city",
        "coords": [3288, 3832],
        "isPort": True,
        "isHub": True,
        "allegiance": "Magisters of Lorath",
        "loreSnippet": "Quiet northern island Free City built above subterranean mazes of an elder vanished race.",
    },
    "pentos": {
        "name": "Pentos",
        "region": "free_cities",
        "type": "capital",
        "coords": [2893, 4593],
        "isPort": True,
        "isHub": True,
        "allegiance": "Magisters of Pentos",
        "loreSnippet": "Wealthy merchant Free City adorned with square brick towers, forbidden from keeping sellswords.",
    },
    "norvos": {
        "name": "Norvos",
        "region": "free_cities",
        "type": "major_city",
        "coords": [3468, 4272],
        "isHub": True,
        "allegiance": "Bearded Priests",
        "loreSnippet": "Terraced inland city perched above the Noyne, ruled by Bearded Priests and tolling bronze bells.",
    },
    "qohor": {
        "name": "Qohor",
        "region": "free_cities",
        "type": "major_city",
        "coords": [3945, 4580],
        "isHub": True,
        "allegiance": "Black Goat of Qohor",
        "loreSnippet": "Gateway to the east bordering the Great Forest, famed for Valyrian-reforging smiths and tapestries.",
    },
    "myr": {
        "name": "Myr",
        "region": "free_cities",
        "type": "capital",
        "coords": [3093, 5122],
        "isPort": True,
        "isHub": True,
        "allegiance": "Magisters of Myr",
        "loreSnippet": "Coastal city celebrated for master lens-grinders, delicate lace, and artisan crossbows.",
    },
    "tyrosh": {
        "name": "Tyrosh",
        "region": "free_cities",
        "type": "major_city",
        "coords": [2700, 5195],
        "isPort": True,
        "isHub": True,
        "allegiance": "Archon of Tyrosh",
        "loreSnippet": "Island fortress-city famous for vivid dyes, ornate armor, and flamboyant sellsword captains.",
    },
    "lys": {
        "name": "Lys",
        "region": "free_cities",
        "type": "capital",
        "coords": [2946, 5614],
        "isPort": True,
        "isHub": True,
        "allegiance": "Magisters of Lys",
        "loreSnippet": "Sunlit archipelago paradise renowned for pleasure houses, sweet poisons, and perfumed courtesans.",
    },
    "volantis": {
        "name": "Volantis",
        "region": "free_cities",
        "type": "capital",
        "coords": [3825, 5632],
        "isPort": True,
        "isHub": True,
        "allegiance": "Triarchs of Volantis",
        "loreSnippet": "The First Daughter of Valyria, bisected by the Rhoyne and linked by the Long Bridge.",
    },
    "chroyane": {
        "name": "Chroyane (The Sorrows)",
        "region": "free_cities",
        "type": "ruin",
        "coords": [3594, 5082],
        "isHub": True,
        "loreSnippet": "Ruined Festival City of the Rhoyne, enveloped by suffocating gray mists and cursed stone men.",
    },
    "mantarys": {
        "name": "Mantarys",
        "region": "slavers_bay",
        "type": "city",
        "coords": [4499, 5531],
        "loreSnippet": "Ominous mountain city notorious for twisted, misshapen inhabitants and dark sorcery.",
    },
    "bhorash": {
        "name": "Bhorash",
        "region": "slavers_bay",
        "type": "ruin",
        "coords": [4977, 5400],
        "loreSnippet": "Ruined stronghold perched high on the Black Cliffs overlooking Slaver's Bay.",
    },
    "meereen": {
        "name": "Meereen",
        "region": "slavers_bay",
        "type": "capital",
        "coords": [5421, 5371],
        "isPort": True,
        "isHub": True,
        "allegiance": "Great Masters",
        "loreSnippet": "Greatest of the Slaver Cities, dominated by multicolored pyramids and the bronze Harpy.",
    },
    "yunkai": {
        "name": "Yunkai",
        "region": "slavers_bay",
        "type": "city",
        "coords": [5288, 5494],
        "isPort": True,
        "isHub": True,
        "allegiance": "Wise Masters",
        "loreSnippet": "The Yellow City, famed for breeding bedslaves and corrupt merchant pit-masters.",
    },
    "astapor": {
        "name": "Astapor",
        "region": "slavers_bay",
        "type": "city",
        "coords": [5216, 5834],
        "isPort": True,
        "isHub": True,
        "allegiance": "Good Masters",
        "loreSnippet": "Red brick coastal city, celebrated solely for the brutal forging of Unsullied warrior-eunuchs.",
    },
    "new_ghis": {
        "name": "New Ghis",
        "region": "slavers_bay",
        "type": "major_city",
        "coords": [5356, 6522],
        "isPort": True,
        "isHub": True,
        "allegiance": "Iron Legions",
        "loreSnippet": "Island successor to ancient Ghis, renowned for iron legionaries carrying tall shields and spears.",
    },
    "vaes_dothrak": {
        "name": "Vaes Dothrak",
        "region": "dothraki_sea",
        "type": "capital",
        "coords": [6394, 4352],
        "isHub": True,
        "allegiance": "Dosh Khaleen",
        "loreSnippet": "City of the horselords resting beneath the Mother of Mountains; no blade may be bared here.",
    },
    "qarth": {
        "name": "Qarth",
        "region": "qarth",
        "type": "capital",
        "coords": [6884, 6196],
        "isPort": True,
        "isHub": True,
        "allegiance": "Pureborn & Thirteen",
        "loreSnippet": "The Queen of Cities commanding the Jade Gates, encircled by triple walls of stone and marble.",
    },
    "faros": {
        "name": "Faros (Great Moraq)",
        "region": "jade_sea",
        "type": "port",
        "coords": [6778, 6573],
        "isPort": True,
        "isHub": True,
        "allegiance": "Lords of Moraq",
        "loreSnippet": "Lush island trading city at the northern head of Great Moraq, looking across the Jade Gates.",
    },
    "leng_yi": {
        "name": "Leng Yi",
        "region": "jade_sea",
        "type": "city",
        "coords": [8473, 6501],
        "isPort": True,
        "isHub": True,
        "allegiance": "God-Empress of Leng",
        "loreSnippet": "Northern capital of Leng on the Jade Sea, surrounded by dense spice-woods and teak forests.",
    },
    "yin": {
        "name": "Yin",
        "region": "yi_ti",
        "type": "capital",
        "coords": [7841, 6592],
        "isPort": True,
        "isHub": True,
        "allegiance": "God-Emperor of Yi Ti",
        "loreSnippet": "Ancient imperial city and seat of the azure emperors of the Golden Empire of Yi Ti.",
    },
    "jinqi": {
        "name": "Jinqi",
        "region": "yi_ti",
        "type": "major_city",
        "coords": [8626, 6365],
        "isPort": True,
        "isHub": True,
        "allegiance": "Golden Empire of Yi Ti",
        "loreSnippet": "Sprawling coastal metropolis in eastern Yi Ti, boasting pagodas of jade, onyx, and tourmaline.",
    },
    "asshai": {
        "name": "Asshai-by-the-Shadow",
        "region": "shadow_lands",
        "type": "major_city",
        "coords": [8907, 7442],
        "isPort": True,
        "isHub": True,
        "allegiance": "Shadowbinders",
        "loreSnippet": "Portentous city of black greasy stone at the mouth of the Ash; no children are ever born here.",
    },
    "port_lotus": {
        "name": "Port Lotus (Summer Isles)",
        "region": "summer_isles",
        "type": "port",
        "coords": [2847, 7661],
        "isPort": True,
        "isHub": True,
        "allegiance": "Princes of the Summer Isles",
        "loreSnippet": "Vibrant feather-draped island harbor on Walano, home to graceful swan ships and red-wood bows.",
    },
}

# 2. Load all calibrated settlements
DATA_DIR = (
    os.path.join(os.path.dirname(__file__), "data")
    if os.path.exists(os.path.join(os.path.dirname(__file__), "data"))
    else "scripts/data"
)

with open(
    os.path.join(DATA_DIR, "enhanced_calibrated_settlements.json"),
    "r",
    encoding="utf-8",
) as f:
    cal_1 = json.load(f)

with open(
    os.path.join(DATA_DIR, "new_calibrated_settlements.json"), "r", encoding="utf-8"
) as f:
    cal_2 = json.load(f)

with open(os.path.join(DATA_DIR, "latest_additions.json"), "r", encoding="utf-8") as f:
    cal_3 = json.load(f)

with open(os.path.join(DATA_DIR, "final_batch.json"), "r", encoding="utf-8") as f:
    cal_4 = json.load(f)

all_nodes = {}

# Insert canonical 70 first
for nid, c in CANONICAL_70.items():
    all_nodes[nid] = {
        "id": nid,
        "name": c["name"],
        "region": c["region"],
        "type": c["type"],
        "coords": c["coords"],
        "isPort": c.get("isPort", False),
        "isHub": c.get("isHub", False),
        "allegiance": c.get("allegiance"),
        "loreSnippet": c.get("loreSnippet"),
    }

for cal_list in [cal_1, cal_2, cal_3, cal_4]:
    for c in cal_list:
        cid = c["id"]
        if cid not in all_nodes:
            all_nodes[cid] = {
                "id": cid,
                "name": c["name"],
                "region": c["region"],
                "type": c["type"],
                "coords": c["coords"],
                "isPort": c.get("isPort", False),
                "isHub": False,
                "allegiance": c.get("allegiance"),
                "loreSnippet": c.get("loreSnippet"),
            }

print(f"Total unified nodes: {len(all_nodes)}")

# Group nodes by region for clean readability
REGIONS_ORDER = [
    ("north", "THE NORTH & BEYOND THE WALL"),
    ("riverlands", "THE RIVERLANDS"),
    ("vale", "THE VALE OF ARRYN & THE SISTERS"),
    ("iron_islands", "THE IRON ISLANDS"),
    ("westerlands", "THE WESTERLANDS"),
    ("crownlands", "THE CROWNLANDS & DRAGONSTONE"),
    ("stormlands", "THE STORMLANDS"),
    ("reach", "THE REACH & SHIELD ISLANDS"),
    ("dorne", "DORNE"),
    ("free_cities", "ESSOS: THE FREE CITIES & SHIVERING SEA (IBBEN)"),
    ("slavers_bay", "ESSOS: SLAVER'S BAY & VALYRIA"),
    ("dothraki_sea", "ESSOS: DOTHRAKI SEA & SARNATH"),
    ("qarth", "ESSOS: QARTH & RED WASTE"),
    ("yi_ti", "THE FAR EAST: THE GOLDEN EMPIRE OF YI TI"),
    ("jade_sea", "THE FAR EAST: JADE SEA & GREAT MORAQ & LENG"),
    ("shadow_lands", "THE SHADOW LANDS & ASSHAI"),
    ("summer_isles", "THE SUMMER ISLES & SOUTHERN SEAS"),
]


def normalize_region(r):
    r = r.lower()
    if r in ["north", "beyond_the_wall"]:
        return "north"
    if r in ["riverlands"]:
        return "riverlands"
    if r in ["vale", "the_vale"]:
        return "vale"
    if r in ["iron_islands", "iron_isles"]:
        return "iron_islands"
    if r in ["westerlands"]:
        return "westerlands"
    if r in ["crownlands"]:
        return "crownlands"
    if r in ["stormlands"]:
        return "stormlands"
    if r in ["reach"]:
        return "reach"
    if r in ["dorne"]:
        return "dorne"
    if r in ["free_cities", "northern_essos", "ibben"]:
        return "free_cities"
    if r in ["slavers_bay"]:
        return "slavers_bay"
    if r in ["dothraki_sea", "central_slavers_qarth"]:
        return "dothraki_sea"
    if r in ["qarth"]:
        return "qarth"
    if r in ["yi_ti"]:
        return "yi_ti"
    if r in ["jade_sea", "far_east_jade_sea"]:
        return "jade_sea"
    if r in ["shadow_lands"]:
        return "shadow_lands"
    if r in ["summer_isles", "summer_isles_south"]:
        return "summer_isles"
    return "free_cities"


by_region = {reg_id: [] for reg_id, _ in REGIONS_ORDER}
for nid, node in all_nodes.items():
    reg = normalize_region(node.get("region", "free_cities"))
    if reg not in by_region:
        reg = "free_cities"
    by_region[reg].append(node)

# Sort each region by name
for reg in by_region:
    by_region[reg].sort(key=lambda n: n["name"])

# Generate clean TypeScript code
lines = [
    "import type { LocationNode } from '../types';",
    "",
    "export const NODES: Record<string, LocationNode> = {",
]

for reg_id, reg_title in REGIONS_ORDER:
    nodes_in_reg = by_region[reg_id]
    if not nodes_in_reg:
        continue
    lines.append(
        f"  // ================= {reg_title} ({len(nodes_in_reg)}) ================="
    )
    for n in nodes_in_reg:
        nid = n["id"]
        lines.append(f"  {nid}: {{")
        lines.append(f"    id: {json.dumps(nid)},")
        lines.append(f"    name: {json.dumps(n['name'])},")
        lines.append(f"    region: {json.dumps(n['region'])},")
        lines.append(f"    type: {json.dumps(n['type'])},")
        lines.append(f"    coords: [{n['coords'][0]}, {n['coords'][1]}],")
        if n.get("isHub"):
            lines.append("    isHub: true,")
        if n.get("isPort"):
            lines.append("    isPort: true,")
        if n.get("allegiance"):
            lines.append(f"    allegiance: {json.dumps(n['allegiance'])},")
        if n.get("loreSnippet"):
            lines.append(f"    loreSnippet: {json.dumps(n['loreSnippet'])},")
        lines.append("  },")
    lines.append("")

if lines[-1] == "":
    lines.pop()
lines.append("};")
lines.append("")

output_code = "\n".join(lines)
with open("src/data/nodes.ts", "w", encoding="utf-8") as f:
    f.write(output_code)

print("Generated src/data/nodes.ts with zero escaping errors!")
