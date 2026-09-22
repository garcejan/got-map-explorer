"""
Calibrate coordinate transform between ArcGIS GIS data and Image Space [10000x8300],
and re-project Continents, Islands, and Lakes into Image Pixel Coordinates & Leaflet Coordinates.
"""

import json
import os
import re
import numpy as np

RAW_DIR = "scripts/precompute/raw"
OUT_DIR = "public/data"
os.makedirs(OUT_DIR, exist_ok=True)

def load_node_coords():
    with open("src/data/nodes.ts", "r") as f:
        text = f.read()
    matches = re.findall(r'(\w+):\s*\{[^\}]*?name:\s*\"([^\"]+)\"[^\}]*?coords:\s*\[([0-9\.\s,]+)\]', text)
    return {name.lower().strip(): [float(c.strip()) for c in coords.split(',')] for _, name, coords in matches}

def compute_transform():
    nodes = load_node_coords()
    with open(os.path.join(RAW_DIR, "locations.geojson"), "r") as f:
        data = json.load(f)

    pts_gis = []
    pts_img = []
    for f_item in data.get("features", []):
        props = f_item.get("properties") or {}
        name = props.get("name")
        if name and name.lower().strip() in nodes:
            pts_gis.append(f_item["geometry"]["coordinates"])
            pts_img.append(nodes[name.lower().strip()])

    pts_gis = np.array(pts_gis)
    pts_img = np.array(pts_img)

    A = np.column_stack([pts_gis[:, 0], pts_gis[:, 1], np.ones(len(pts_gis))])
    coeff_x, _, _, _ = np.linalg.lstsq(A, pts_img[:, 0], rcond=None)
    coeff_y, _, _, _ = np.linalg.lstsq(A, pts_img[:, 1], rcond=None)

    # Inlier filtering
    pred_x = A @ coeff_x
    pred_y = A @ coeff_y
    res = np.hypot(pred_x - pts_img[:, 0], pred_y - pts_img[:, 1])
    inliers = res < 60
    A_in = A[inliers]

    coeff_x, _, _, _ = np.linalg.lstsq(A_in, pts_img[inliers, 0], rcond=None)
    coeff_y, _, _, _ = np.linalg.lstsq(A_in, pts_img[inliers, 1], rcond=None)

    # Inverse transform: img -> gis
    # [x, y, 1] -> [lng, lat]
    B = np.column_stack([pts_img[inliers, 0], pts_img[inliers, 1], np.ones(len(A_in))])
    inv_lng, _, _, _ = np.linalg.lstsq(B, pts_gis[inliers, 0], rcond=None)
    inv_lat, _, _, _ = np.linalg.lstsq(B, pts_gis[inliers, 1], rcond=None)

    transform = {
        "forward": {
            "coeff_x": coeff_x.tolist(),  # [a, b, c] -> x = a*lng + b*lat + c
            "coeff_y": coeff_y.tolist()   # [d, e, f] -> y = d*lng + e*lat + f
        },
        "inverse": {
            "coeff_lng": inv_lng.tolist(), # lng = a*x + b*y + c
            "coeff_lat": inv_lat.tolist()  # lat = d*x + e*y + f
        },
        "graticules": {
            "equator_y": float(coeff_y[2]),  # when lat=0, lng=0
            "tropic_of_cancer_y": float(coeff_y[1] * 23.5 + coeff_y[2]),
            "arctic_circle_y": float(coeff_y[1] * 66.5 + coeff_y[2]),
            "prime_meridian_x": float(coeff_x[2])
        }
    }

    print("Computed Transform:")
    print("X = {:.5f} * lng + {:.5f} * lat + {:.2f}".format(*coeff_x))
    print("Y = {:.5f} * lng + {:.5f} * lat + {:.2f}".format(*coeff_y))
    print("Graticules:", transform["graticules"])

    return coeff_x, coeff_y, transform

def transform_coord(pt, coeff_x, coeff_y):
    lng, lat = pt[0], pt[1]
    x = coeff_x[0] * lng + coeff_x[1] * lat + coeff_x[2]
    y = coeff_y[0] * lng + coeff_y[1] * lat + coeff_y[2]
    # Clamp to image bounds
    x = max(0.0, min(10000.0, float(x)))
    y = max(0.0, min(8300.0, float(y)))
    return [round(x, 1), round(y, 1)]

def transform_geometry(geom, coeff_x, coeff_y):
    gtype = geom["type"]
    coords = geom["coordinates"]

    def rec_transform(val):
        if isinstance(val[0], (int, float)):
            return transform_coord(val, coeff_x, coeff_y)
        return [rec_transform(item) for item in val]

    return {
        "type": gtype,
        "coordinates": rec_transform(coords)
    }

def project_layer(raw_filename, out_filename, coeff_x, coeff_y):
    raw_path = os.path.join(RAW_DIR, raw_filename)
    if not os.path.exists(raw_path):
        print(f"Skipping {raw_filename}, not found.")
        return

    with open(raw_path, "r") as f:
        data = json.load(f)

    projected_features = []
    for f in data.get("features", []):
        if not f.get("geometry"):
            continue
        new_geom = transform_geometry(f["geometry"], coeff_x, coeff_y)
        projected_features.append({
            "type": "Feature",
            "properties": f.get("properties", {}),
            "geometry": new_geom
        })

    out_data = {
        "type": "FeatureCollection",
        "features": projected_features
    }

    out_path = os.path.join(OUT_DIR, out_filename)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out_data, f)
    print(f"Projected {len(projected_features)} features to {out_path} ({os.path.getsize(out_path) // 1024} KB)")

def main():
    coeff_x, coeff_y, transform = compute_transform()

    with open(os.path.join(OUT_DIR, "crs_transform.json"), "w") as f:
        json.dump(transform, f, indent=2)

    # Combine continents and islands into landmasses.geojson
    continents_raw = os.path.join(RAW_DIR, "continents.geojson")
    islands_raw = os.path.join(RAW_DIR, "islands.geojson")

    combined_land_features = []
    for rpath in [continents_raw, islands_raw]:
        if os.path.exists(rpath):
            with open(rpath, "r") as f:
                cdata = json.load(f)
            for f in cdata.get("features", []):
                if f.get("geometry"):
                    combined_land_features.append({
                        "type": "Feature",
                        "properties": f.get("properties", {}),
                        "geometry": transform_geometry(f["geometry"], coeff_x, coeff_y)
                    })

    land_out_path = os.path.join(OUT_DIR, "landmasses.geojson")
    with open(land_out_path, "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": combined_land_features}, f)
    print(f"Saved {len(combined_land_features)} landmasses to {land_out_path} ({os.path.getsize(land_out_path) // 1024} KB)")

    # Lakes
    project_layer("lakes.geojson", "lakes.geojson", coeff_x, coeff_y)

if __name__ == "__main__":
    main()
