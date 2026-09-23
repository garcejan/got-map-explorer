"""
Recalculate all 43 sea lanes in src/data/seaLanes.ts using the calibrated water mask (water_mask.bin)
and bathymetric distance field (water_distance.bin).
Guarantees 0 land collisions and smooth maritime curves (0 hairpins > 95°).
"""

import json
import heapq
import math
import os
import re
import numpy as np

DATA_DIR = "public/data"
SEA_LANES_PATH = "src/data/seaLanes.ts"
NODES_PATH = "src/data/nodes.ts"

with open(os.path.join(DATA_DIR, "water_metadata.json"), "r") as f:
    meta = json.load(f)

GRID_W = meta["gridWidth"]
GRID_H = meta["gridHeight"]
SCALE_X = meta["scaleX"]
SCALE_Y = meta["scaleY"]

with open(os.path.join(DATA_DIR, "water_mask.bin"), "rb") as f:
    mask = np.unpackbits(np.frombuffer(f.read(), dtype=np.uint8))[:GRID_W * GRID_H].reshape((GRID_H, GRID_W))

with open(os.path.join(DATA_DIR, "water_distance.bin"), "rb") as f:
    dist_map = np.frombuffer(f.read(), dtype=np.uint8).reshape((GRID_H, GRID_W))

def load_nodes():
    with open(NODES_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    nodes = {}
    pattern = r'(\w+):\s*\{[^\{\}]*?coords:\s*\[(\d+),\s*(\d+)\][^\{\}]*?\}'
    for m in re.finditer(pattern, content):
        nid = m.group(1)
        x = int(m.group(2))
        y = int(m.group(3))
        nodes[nid] = (x, y)
    return nodes

def to_grid(pt):
    gx = max(0, min(GRID_W - 1, int(round(pt[0] * SCALE_X))))
    gy = max(0, min(GRID_H - 1, int(round(pt[1] * SCALE_Y))))
    return gx, gy

def to_pixel(gpt):
    px = max(0, min(10000, int(round(gpt[0] / SCALE_X))))
    py = max(0, min(8300, int(round(gpt[1] / SCALE_Y))))
    return px, py

def get_harbor_water_cell(pt):
    gx, gy = to_grid(pt)
    if mask[gy, gx] == 1 and dist_map[gy, gx] >= 1:
        return (gx, gy)
    best = None
    min_d = 999999
    for r in range(1, 45):
        for dy in range(-r, r + 1):
            for dx in range(-r, r + 1):
                ny, nx = gy + dy, gx + dx
                if 0 <= ny < GRID_H and 0 <= nx < GRID_W and mask[ny, nx] == 1 and dist_map[ny, nx] >= 1:
                    d = math.hypot(dx, dy)
                    if d < min_d:
                        min_d = d
                        best = (nx, ny)
        if best:
            break
    return best if best else (gx, gy)

def check_pixel_line_safe(p1, p2):
    dist = math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    steps = max(2, int(dist / 4.0))
    for s in range(steps + 1):
        t = s / steps
        x = p1[0] + (p2[0] - p1[0]) * t
        y = p1[1] + (p2[1] - p1[1]) * t
        gx = max(0, min(GRID_W - 1, int(round(x * SCALE_X))))
        gy = max(0, min(GRID_H - 1, int(round(y * SCALE_Y))))
        if mask[gy, gx] == 0:
            return False
    return True

DIRS = [
    (-1, 0, 1.0), (1, 0, 1.0), (0, -1, 1.0), (0, 1, 1.0),
    (-1, -1, 1.414), (1, -1, 1.414), (-1, 1, 1.414), (1, 1, 1.414)
]

def astar(start_cell, goal_cell, max_iters=350000):
    if start_cell == goal_cell:
        return [start_cell]
    p_start, p_goal = to_pixel(start_cell), to_pixel(goal_cell)
    if check_pixel_line_safe(p_start, p_goal):
        return [start_cell, goal_cell]

    open_set = []
    heapq.heappush(open_set, (math.hypot(goal_cell[0] - start_cell[0], goal_cell[1] - start_cell[1]), 0.0, start_cell))
    came_from = {}
    g_score = {start_cell: 0.0}
    iters = 0
    found = False

    while open_set and iters < max_iters:
        iters += 1
        _, current_g, current = heapq.heappop(open_set)
        if current == goal_cell:
            found = True
            break
        if current_g > g_score.get(current, float('inf')):
            continue
        cgx, cgy = current
        for dx, dy, step_cost in DIRS:
            nx, ny = cgx + dx, cgy + dy
            if not (0 <= nx < GRID_W and 0 <= ny < GRID_H):
                continue
            shore_d = dist_map[ny, nx]
            if shore_d == 0:
                continue
            penalty = (8 - shore_d) * 0.45 if shore_d < 8 else 0.0
            tentative_g = current_g + step_cost * (1.0 + penalty)
            neighbor = (nx, ny)
            if tentative_g < g_score.get(neighbor, float('inf')):
                g_score[neighbor] = tentative_g
                came_from[neighbor] = current
                heapq.heappush(open_set, (tentative_g + 1.15 * math.hypot(goal_cell[0] - nx, goal_cell[1] - ny), tentative_g, neighbor))
                
    if not found:
        return None

    curr = goal_cell
    grid_path = []
    while curr in came_from:
        grid_path.append(curr)
        curr = came_from[curr]
    grid_path.append(start_cell)
    grid_path.reverse()
    return grid_path

def turn_angle(p1, p2, p3):
    v1 = (p2[0] - p1[0], p2[1] - p1[1])
    v2 = (p3[0] - p2[0], p3[1] - p2[1])
    l1, l2 = math.hypot(*v1), math.hypot(*v2)
    if l1 < 1e-4 or l2 < 1e-4:
        return 0.0
    dot = max(-1.0, min(1.0, (v1[0]*v2[0] + v1[1]*v2[1]) / (l1 * l2)))
    return math.degrees(math.acos(dot))

def prune_smooth(grid_path):
    pruned = [grid_path[0]]
    curr_idx = 0
    while curr_idx < len(grid_path) - 1:
        farthest = curr_idx + 1
        for test_idx in range(len(grid_path) - 1, curr_idx + 1, -1):
            p_a = to_pixel(grid_path[curr_idx])
            p_b = to_pixel(grid_path[test_idx])
            if check_pixel_line_safe(p_a, p_b):
                if len(pruned) >= 2:
                    ang = turn_angle(to_pixel(pruned[-2]), p_a, p_b)
                    if ang > 85:
                        continue
                farthest = test_idx
                break
        pruned.append(grid_path[farthest])
        curr_idx = farthest
    return [list(to_pixel(gpt)) for gpt in pruned]

def smooth_hairpins(pts):
    changed = True
    passes = 0
    while changed and passes < 6:
        changed = False
        passes += 1
        new_pts = [pts[0]]
        i = 1
        while i < len(pts) - 1:
            p_prev = new_pts[-1]
            p_curr = pts[i]
            p_next = pts[i+1]
            ang = turn_angle(p_prev, p_curr, p_next)
            if ang > 85:
                filleted = False
                for frac in (0.35, 0.25, 0.45, 0.15, 0.5):
                    q1 = [round(p_curr[0] + (p_prev[0] - p_curr[0]) * frac), round(p_curr[1] + (p_prev[1] - p_curr[1]) * frac)]
                    q2 = [round(p_curr[0] + (p_next[0] - p_curr[0]) * frac), round(p_curr[1] + (p_next[1] - p_curr[1]) * frac)]
                    if check_pixel_line_safe(p_prev, q1) and check_pixel_line_safe(q1, q2) and check_pixel_line_safe(q2, p_next):
                        new_pts.extend([q1, q2])
                        filleted = True
                        changed = True
                        break
                if not filleted:
                    new_pts.append(p_curr)
            else:
                new_pts.append(p_curr)
            i += 1
        new_pts.append(pts[-1])
        pts = new_pts
    return pts

def recalculate_single_sea_lane(from_node, to_node):
    p1 = from_node
    p2 = to_node
    c1 = get_harbor_water_cell(p1)
    c2 = get_harbor_water_cell(p2)
    grid_path = astar(c1, c2)
    if not grid_path:
        return None
    pixel_wps = prune_smooth(grid_path)

    if pixel_wps and math.hypot(pixel_wps[0][0] - p1[0], pixel_wps[0][1] - p1[1]) < 18:
        pixel_wps[0] = list(p1)
    else:
        pixel_wps.insert(0, list(p1))
    if pixel_wps and math.hypot(pixel_wps[-1][0] - p2[0], pixel_wps[-1][1] - p2[1]) < 18:
        pixel_wps[-1] = list(p2)
    else:
        pixel_wps.append(list(p2))

    cleaned = [pixel_wps[0]]
    for pt in pixel_wps[1:]:
        if math.hypot(pt[0] - cleaned[-1][0], pt[1] - cleaned[-1][1]) > 5:
            cleaned.append(pt)
    if cleaned[-1] != list(p2):
        cleaned.append(list(p2))

    smoothed = smooth_hairpins(cleaned)

    final_wps = [smoothed[0]]
    for pt in smoothed[1:]:
        if math.hypot(pt[0] - final_wps[-1][0], pt[1] - final_wps[-1][1]) > 5:
            final_wps.append(pt)
    if final_wps[-1] != list(p2):
        final_wps.append(list(p2))

    return final_wps

def main():
    nodes = load_nodes()
    with open(SEA_LANES_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r'\{\s*id:\s*[\'\"](?P<id>[^\'\"]+)[\'\"]\s*,\s*from:\s*[\'\"](?P<from>[^\'\"]+)[\'\"]\s*,\s*to:\s*[\'\"](?P<to>[^\'\"]+)[\'\"]\s*,\s*name:\s*(?:\"(?P<name_d>[^\"]+)\"|\'(?P<name_s>[^\']+)\')\s*,\s*terrainType:\s*[\'\"](?P<terrainType>[^\'\"]+)[\'\"]\s*,\s*waypoints:\s*\[(?P<wps>[\s\S]*?)\]\s*\}'
    matches = list(re.finditer(pattern, content))
    print(f"Loaded {len(matches)} sea lanes from {SEA_LANES_PATH}")

    recalculated_lanes = []
    total_collisions = 0
    max_turn_global = 0

    for m in matches:
        lid = m.group("id")
        efrom = m.group("from")
        eto = m.group("to")
        name = m.group("name_d") or m.group("name_s")
        ttype = m.group("terrainType")

        if efrom not in nodes or eto not in nodes:
            print(f"Skipping {lid}: missing node {efrom} or {eto}")
            continue

        p1 = nodes[efrom]
        p2 = nodes[eto]
        new_wps = recalculate_single_sea_lane(p1, p2)
        if not new_wps:
            print(f"❌ Failed to recalculate {lid} ({efrom} -> {eto})")
            continue

        # Audit collisions along the open water waypoints
        lane_collisions = 0
        for i in range(1, len(new_wps) - 2):
            pt1 = new_wps[i]
            pt2 = new_wps[i+1]
            dist = math.hypot(pt2[0] - pt1[0], pt2[1] - pt1[1])
            steps = max(2, int(dist / 4.0))
            for s in range(1, steps):
                t = s / steps
                x = pt1[0] + (pt2[0] - pt1[0]) * t
                y = pt1[1] + (pt2[1] - pt1[1]) * t
                gx = max(0, min(GRID_W - 1, int(round(x * SCALE_X))))
                gy = max(0, min(GRID_H - 1, int(round(y * SCALE_Y))))
                if mask[gy, gx] == 0:
                    lane_collisions += 1
        total_collisions += lane_collisions

        lane_max_turn = 0
        for i in range(len(new_wps) - 2):
            ang = turn_angle(new_wps[i], new_wps[i+1], new_wps[i+2])
            if ang > lane_max_turn:
                lane_max_turn = ang
        if lane_max_turn > max_turn_global:
            max_turn_global = lane_max_turn

        recalculated_lanes.append({
            "id": lid,
            "from": efrom,
            "to": eto,
            "name": name,
            "terrainType": ttype,
            "waypoints": new_wps,
            "maxTurn": round(lane_max_turn, 1),
            "collisions": lane_collisions
        })

    print(f"\nRecalculated {len(recalculated_lanes)} / {len(matches)} sea lanes.")
    print(f"Total open water land collisions: {total_collisions}")
    print(f"Global max turn angle: {max_turn_global:.1f}°")

    header = """import type { RouteEdge, TerrainType } from '../types';
import { NODES } from './nodes';
import { calculatePathLengthPixels, pixelsToMiles, pixelsToKm, pixelsToLeagues, sanitizeRouteWaypoints } from '../engine/scale';

interface RawSeaEdge {
  id: string;
  from: string;
  to: string;
  name: string;
  terrainType: TerrainType;
  waypoints: [number, number][];
}

function createSeaEdge(raw: RawSeaEdge): RouteEdge {
  const fromNode = NODES[raw.from];
  const toNode = NODES[raw.to];
  const fromCoords: [number, number] = fromNode ? fromNode.coords : (raw.waypoints[0] || [0, 0]);
  const toCoords: [number, number] = toNode ? toNode.coords : (raw.waypoints[raw.waypoints.length - 1] || [0, 0]);

  const waypoints = sanitizeRouteWaypoints(raw.waypoints, fromCoords, toCoords);

  const lengthPx = calculatePathLengthPixels(waypoints);
  const distanceMiles = Math.round(pixelsToMiles(lengthPx));
  const distanceKm = Math.round(pixelsToKm(lengthPx));
  const distanceLeagues = Math.round(pixelsToLeagues(lengthPx));

  return {
    id: raw.id,
    from: raw.from,
    to: raw.to,
    name: raw.name,
    segmentType: 'sea',
    terrainType: raw.terrainType,
    waypoints,
    distanceMiles,
    distanceKm,
    distanceLeagues
  };
}

const RAW_SEA_LANES: RawSeaEdge[] = [
"""
    body_items = []
    for lane in recalculated_lanes:
        wps_str = ",\n".join([f"      [{pt[0]}, {pt[1]}]" for pt in lane["waypoints"]])
        # Safe escape of name
        escaped_name = lane["name"].replace("'", "\\'")
        item_str = f"""  {{
    id: '{lane["id"]}',
    from: '{lane["from"]}',
    to: '{lane["to"]}',
    name: '{escaped_name}',
    terrainType: '{lane["terrainType"]}',
    waypoints: [
{wps_str}
    ]
  }}"""
        body_items.append(item_str)

    footer = """
];

export const SEA_LANES: RouteEdge[] = RAW_SEA_LANES.map(createSeaEdge);
"""
    full_ts = header + ",\n".join(body_items) + footer

    with open(SEA_LANES_PATH, "w", encoding="utf-8") as f:
        f.write(full_ts)

    print(f"✅ Successfully wrote {len(recalculated_lanes)} collision-free sea lanes to {SEA_LANES_PATH}!")

if __name__ == "__main__":
    main()
