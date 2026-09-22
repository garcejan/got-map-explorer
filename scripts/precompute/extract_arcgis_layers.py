"""
Extract all spatial layers from the ArcGIS FeatureServer for Game of Thrones:
https://services8.arcgis.com/bq7onQo4vkjSA8x6/arcgis/rest/services/GameofThronesMapDataLayers_WFL1/FeatureServer
"""

import json
import os
import urllib.request

BASE_URL = "https://services8.arcgis.com/bq7onQo4vkjSA8x6/arcgis/rest/services/GameofThronesMapDataLayers_WFL1/FeatureServer"
OUT_DIR = "scripts/precompute/raw"
os.makedirs(OUT_DIR, exist_ok=True)

LAYERS = {
    0: "locations",
    1: "wall",
    2: "roads",
    3: "rivers",
    4: "boundary",
    5: "lakes",
    6: "landscape",
    7: "continents",
    8: "islands"
}

def fetch_layer(layer_id, name):
    print(f"Fetching Layer {layer_id}: {name}...")
    url = f"{BASE_URL}/{layer_id}/query?where=1%3D1&outFields=*&f=geojson"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    
    count = len(data.get("features", []))
    print(f" -> Successfully fetched {count} features for {name}")
    out_path = os.path.join(OUT_DIR, f"{name}.geojson")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f)
    print(f" -> Saved to {out_path} ({os.path.getsize(out_path) // 1024} KB)")
    return data

def main():
    for lid, lname in LAYERS.items():
        try:
            fetch_layer(lid, lname)
        except Exception as e:
            print(f"Failed to fetch layer {lid} ({lname}): {e}")

if __name__ == "__main__":
    main()
