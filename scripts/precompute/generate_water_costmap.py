"""
Rasterize reprojected landmasses onto a 1250x1038 navigation grid,
compute Euclidean Distance Transform (EDT) for coastal clearance,
and serialize compact binary water mask and distance field assets.
"""

import json
import os
import cv2
import numpy as np
from scipy.ndimage import distance_transform_edt

GRID_WIDTH = 1250
GRID_HEIGHT = 1038
MAP_WIDTH = 10000.0
MAP_HEIGHT = 8300.0
SCALE_X = GRID_WIDTH / MAP_WIDTH   # 0.125
SCALE_Y = GRID_HEIGHT / MAP_HEIGHT # ~0.12506

DATA_DIR = "public/data"

def rasterize_geojson():
    print(f"Rasterizing landmasses onto {GRID_WIDTH}x{GRID_HEIGHT} grid...")
    # Initialize with 255 (all water)
    grid = np.full((GRID_HEIGHT, GRID_WIDTH), 255, dtype=np.uint8)

    # 1. Rasterize Landmasses (Continents and Islands) as 0 (Land)
    land_path = os.path.join(DATA_DIR, "landmasses.geojson")
    with open(land_path, "r") as f:
        land_data = json.load(f)

    for f_idx, feature in enumerate(land_data.get("features", [])):
        geom = feature.get("geometry")
        if not geom:
            continue
        gtype = geom["type"]
        coords = geom["coordinates"]

        polygons_to_draw = []
        if gtype == "Polygon":
            polygons_to_draw = [coords]
        elif gtype == "MultiPolygon":
            polygons_to_draw = coords

        for poly in polygons_to_draw:
            if not poly or len(poly) == 0:
                continue
            # Outer ring
            outer_ring = poly[0]
            pts = []
            for pt in outer_ring:
                gx = int(round(pt[0] * SCALE_X))
                gy = int(round(pt[1] * SCALE_Y))
                gx = max(0, min(GRID_WIDTH - 1, gx))
                gy = max(0, min(GRID_HEIGHT - 1, gy))
                pts.append([gx, gy])
            pts = np.array(pts, dtype=np.int32)
            cv2.fillPoly(grid, [pts], 0) # Fill land as 0

    print(" -> Landmasses filled.")

    # 2. Rasterize Lakes as 255 (Water)
    lakes_path = os.path.join(DATA_DIR, "lakes.geojson")
    if os.path.exists(lakes_path):
        with open(lakes_path, "r") as f:
            lakes_data = json.load(f)
        for feature in lakes_data.get("features", []):
            geom = feature.get("geometry")
            if not geom:
                continue
            gtype = geom["type"]
            coords = geom["coordinates"]
            polygons_to_draw = [coords] if gtype == "Polygon" else coords
            for poly in polygons_to_draw:
                if not poly or len(poly) == 0:
                    continue
                outer_ring = poly[0]
                pts = [[max(0, min(GRID_WIDTH - 1, int(round(p[0] * SCALE_X)))),
                        max(0, min(GRID_HEIGHT - 1, int(round(p[1] * SCALE_Y))))] for p in outer_ring]
                pts = np.array(pts, dtype=np.int32)
                cv2.fillPoly(grid, [pts], 255) # Inland lakes as water
        print(" -> Lakes filled.")

    # Water mask: True where grid == 255 (Water), False where grid == 0 (Land)
    water_mask = (grid == 255)
    land_pct = (np.sum(~water_mask) / water_mask.size) * 100
    water_pct = (np.sum(water_mask) / water_mask.size) * 100
    print(f" -> Land coverage: {land_pct:.1f}%, Water coverage: {water_pct:.1f}%")

    # 3. Compute Euclidean Distance Transform (EDT)
    print("Computing Euclidean Distance Transform on water cells...")
    dist = distance_transform_edt(water_mask)

    # Quantize distance to uint8 (0..255)
    # 1 cell ~ 8 pixels ~ 7.0 miles.
    # dist = 36 cells ~ 250 miles (deep ocean)
    dist_uint8 = np.clip(np.round(dist), 0, 255).astype(np.uint8)

    # 4. Pack 1-bit binary mask (bit=1 for water, 0 for land)
    packed_mask = np.packbits(water_mask.flatten())
    mask_file = os.path.join(DATA_DIR, "water_mask.bin")
    with open(mask_file, "wb") as f:
        f.write(packed_mask.tobytes())
    print(f" -> Saved 1-bit water mask to {mask_file} ({len(packed_mask) // 1024} KB)")

    # 5. Save 8-bit distance field
    dist_file = os.path.join(DATA_DIR, "water_distance.bin")
    with open(dist_file, "wb") as f:
        f.write(dist_uint8.tobytes())
    print(f" -> Saved 8-bit distance field to {dist_file} ({dist_uint8.size // 1024} KB)")

    # 6. Save metadata
    meta = {
        "gridWidth": GRID_WIDTH,
        "gridHeight": GRID_HEIGHT,
        "mapWidth": int(MAP_WIDTH),
        "mapHeight": int(MAP_HEIGHT),
        "scaleX": SCALE_X,
        "scaleY": SCALE_Y,
        "cellMiles": round(8.0 * (600.0 / 686.0), 2), # ~7.0 mi / cell
        "bathymetryThresholds": {
            "coastalShelfCells": 8,   # < 55 miles
            "openOceanCells": 36,     # 55 - 250 miles
            "deepOceanCells": 36      # >= 250 miles
        }
    }
    meta_file = os.path.join(DATA_DIR, "water_metadata.json")
    with open(meta_file, "w") as f:
        json.dump(meta, f, indent=2)
    print(f" -> Saved metadata to {meta_file}")

if __name__ == "__main__":
    rasterize_geojson()
