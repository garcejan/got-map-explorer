"""
Project ArcGIS roads.geojson into Image Space [10000x8300] and Leaflet coordinates,
classify features into major highways and kingdom paths, and export public/data/gis_roads.geojson.
"""

import json
import math
import os

RAW_PATH = "scripts/precompute/raw/roads.geojson"
TRANSFORM_PATH = "public/data/crs_transform.json"
OUT_PATH = "public/data/gis_roads.geojson"

MAP_WIDTH = 10000.0
MAP_HEIGHT = 8300.0
MILES_PER_PIXEL = 600.0 / 686.0

def load_transform():
    with open(TRANSFORM_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    coeff_x = data["forward"]["coeff_x"]
    coeff_y = data["forward"]["coeff_y"]
    return coeff_x, coeff_y

def transform_pt(lng, lat, coeff_x, coeff_y):
    x = coeff_x[0] * lng + coeff_x[1] * lat + coeff_x[2]
    y = coeff_y[0] * lng + coeff_y[1] * lat + coeff_y[2]
    x = max(0.0, min(MAP_WIDTH, float(x)))
    y = max(0.0, min(MAP_HEIGHT, float(y)))
    return [round(x, 1), round(y, 1)]

def calc_length_miles(coords):
    px_len = 0.0
    for i in range(len(coords) - 1):
        dx = coords[i+1][0] - coords[i][0]
        dy = coords[i+1][1] - coords[i][1]
        px_len += math.hypot(dx, dy)
    return round(px_len * MILES_PER_PIXEL)

def main():
    if not os.path.exists(RAW_PATH):
        raise FileNotFoundError(f"Missing {RAW_PATH}")

    coeff_x, coeff_y = load_transform()

    with open(RAW_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    projected_features = []
    major_count = 0
    path_count = 0

    for idx, feat in enumerate(raw_data.get("features", [])):
        geom = feat.get("geometry")
        if not geom:
            continue

        props = feat.get("properties") or {}
        name = props.get("name")
        size = props.get("size") or 4
        continent = props.get("continent")
        
        # If continent is not specified, infer from longitude
        gtype = geom.get("type")
        raw_coords = geom.get("coordinates")

        # Normalize to list of lines
        if gtype == "LineString":
            lines = [raw_coords]
        elif gtype == "MultiLineString":
            lines = raw_coords
        else:
            continue

        for line_idx, line in enumerate(lines):
            if len(line) < 2:
                continue

            proj_coords = [transform_pt(pt[0], pt[1], coeff_x, coeff_y) for pt in line]
            
            # Determine continent if None
            avg_x = sum(p[0] for p in proj_coords) / len(proj_coords)
            resolved_continent = continent or ("Westeros" if avg_x < 2650 else "Essos")

            # Determine category:
            # major_highway: has a named artery or size <= 2
            # kingdom_path: regional road / path
            is_major = bool(name) or (size <= 2)
            category = "major_highway" if is_major else "kingdom_path"

            if is_major:
                major_count += 1
            else:
                path_count += 1

            length_miles = calc_length_miles(proj_coords)

            road_name = name or f"Kingdom Path ({resolved_continent})"

            # Leaflet CRS.Simple coordinates: [8300 - y, x]
            leaflet_coords = [[round(MAP_HEIGHT - p[1], 1), p[0]] for p in proj_coords]

            projected_features.append({
                "type": "Feature",
                "id": f"gis_road_{idx}_{line_idx}",
                "properties": {
                    "gisId": props.get("OBJECTID"),
                    "name": road_name,
                    "rawName": name,
                    "category": category,
                    "size": size,
                    "continent": resolved_continent,
                    "lengthMiles": length_miles,
                    "vertexCount": len(proj_coords)
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": proj_coords,
                    "leafletCoordinates": leaflet_coords
                }
            })

    out_data = {
        "type": "FeatureCollection",
        "metadata": {
            "totalFeatures": len(projected_features),
            "majorHighways": major_count,
            "kingdomPaths": path_count
        },
        "features": projected_features
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out_data, f)

    file_size_kb = os.path.getsize(OUT_PATH) // 1024
    print(f"✅ Generated {OUT_PATH}: {len(projected_features)} features ({major_count} highways, {path_count} kingdom paths, {file_size_kb} KB)")

if __name__ == "__main__":
    main()
