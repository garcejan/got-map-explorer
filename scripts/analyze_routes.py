import re
import math
import sys
import argparse

def load_nodes(nodes_path='src/data/nodes.ts'):
    nodes = {}
    with open(nodes_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Matches: node_id: { ... coords: [x, y] ... }
    # Let's match each node block
    pattern = r'(\w+):\s*\{([^\{\}]*?coords:\s*\[(\d+),\s*(\d+)\][^\{\}]*?)\}'
    for m in re.finditer(pattern, content):
        nid = m.group(1)
        x = int(m.group(3))
        y = int(m.group(4))
        nodes[nid] = (x, y)
    return nodes

def load_edges(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    edges = []
    # Find all "id: '...'" positions
    for match in re.finditer(r'id:\s*[\'\"]([^\'\"]+)[\'\"]', content):
        eid = match.group(1)
        # Find opening { before this id
        start = content.rfind('{', 0, match.start())
        if start == -1:
            continue
        # Find closing } matching this {
        depth = 0
        end = -1
        for idx in range(start, len(content)):
            if content[idx] == '{':
                depth += 1
            elif content[idx] == '}':
                depth -= 1
                if depth == 0:
                    end = idx
                    break
        if end == -1:
            continue
        block = content[start:end+1]
        
        from_m = re.search(r'from:\s*[\'\"]([^\'\"]+)[\'\"]', block)
        to_m = re.search(r'to:\s*[\'\"]([^\'\"]+)[\'\"]', block)
        wp_m = re.search(r'waypoints:\s*\[([\s\S]*?)\]\s*(?:\n|\r|\w|\})', block)
        if not from_m or not to_m:
            continue
        efrom = from_m.group(1)
        eto = to_m.group(1)
        wps = []
        if wp_m:
            wp_str = wp_m.group(1)
            for wp_match in re.finditer(r'\[\s*(\d+)\s*,\s*(\d+)\s*\]', wp_str):
                wps.append((int(wp_match.group(1)), int(wp_match.group(2))))
        edges.append({
            'id': eid,
            'from': efrom,
            'to': eto,
            'waypoints': wps
        })
    return edges

def analyze_edges(edges, nodes, edge_type='road', threshold_ratio=1.5, start_end_dist_threshold=80):
    issues = []
    
    for edge in edges:
        eid = edge['id']
        efrom = edge['from']
        eto = edge['to']
        wps = edge['waypoints']
        
        if efrom not in nodes:
            issues.append({'id': eid, 'type': 'missing_node', 'desc': f"From node '{efrom}' not in nodes.ts"})
            continue
        if eto not in nodes:
            issues.append({'id': eid, 'type': 'missing_node', 'desc': f"To node '{eto}' not in nodes.ts"})
            continue
        
        from_coords = nodes[efrom]
        to_coords = nodes[eto]
        
        if not wps:
            issues.append({'id': eid, 'type': 'empty_waypoints', 'desc': "No waypoints"})
            continue
            
        # createRoadEdge / createSeaEdge behavior:
        # waypoints[0] = fromNode.coords
        # waypoints[-1] = toNode.coords
        # intermediate waypoints are left unchanged!
        actual_wps = list(wps)
        actual_wps[0] = from_coords
        actual_wps[-1] = to_coords
        
        # Check if original raw waypoints matched from/to coords
        raw_start_dev = math.hypot(wps[0][0] - from_coords[0], wps[0][1] - from_coords[1])
        raw_end_dev = math.hypot(wps[-1][0] - to_coords[0], wps[-1][1] - to_coords[1])
        
        direct_dist = math.hypot(to_coords[0] - from_coords[0], to_coords[1] - from_coords[1])
        
        path_dist = 0
        for i in range(len(actual_wps) - 1):
            path_dist += math.hypot(actual_wps[i+1][0] - actual_wps[i][0], actual_wps[i+1][1] - actual_wps[i][1])
            
        ratio = path_dist / direct_dist if direct_dist > 0 else 1.0
        
        # Check backtrack: does any waypoint go backwards along the segment vector?
        # Vector V from start to end
        vx = to_coords[0] - from_coords[0]
        vy = to_coords[1] - from_coords[1]
        v_len_sq = vx*vx + vy*vy
        
        backtracking = False
        projections = []
        if v_len_sq > 0:
            for p in actual_wps:
                proj = ((p[0] - from_coords[0]) * vx + (p[1] - from_coords[1]) * vy) / v_len_sq
                projections.append(proj)
            
            # Check if projections decrease significantly (e.g. goes forward then reverses back)
            # or if any waypoint is far outside the [0, 1] segment (e.g. < -0.2 or > 1.2)
            max_proj = projections[0]
            for i in range(1, len(projections)):
                if projections[i] < max_proj - 0.15:
                    backtracking = True
                max_proj = max(max_proj, projections[i])
                if projections[i] < -0.2 or projections[i] > 1.2:
                    # Point is projecting behind start or past end
                    # Only flag if perpendicular deviation isn't justifying it
                    backtracking = True
        
        if raw_start_dev > start_end_dist_threshold or raw_end_dev > start_end_dist_threshold or ratio > threshold_ratio or backtracking:
            issues.append({
                'id': eid,
                'from': efrom,
                'to': eto,
                'from_coords': from_coords,
                'to_coords': to_coords,
                'raw_wps': wps,
                'actual_wps': actual_wps,
                'raw_start_dev': round(raw_start_dev),
                'raw_end_dev': round(raw_end_dev),
                'direct_dist': round(direct_dist),
                'path_dist': round(path_dist),
                'ratio': round(ratio, 2),
                'backtracking': backtracking,
                'projections': [round(p, 2) for p in projections]
            })
            
    return issues

def main():
    parser = argparse.ArgumentParser(description='Analyze road and sea route geometry.')
    parser.add_argument('--roads', default='src/data/roads.ts', help='Path to roads.ts')
    parser.add_argument('--sea', default='src/data/seaLanes.ts', help='Path to seaLanes.ts')
    parser.add_argument('--nodes', default='src/data/nodes.ts', help='Path to nodes.ts')
    parser.add_argument('--ratio', type=float, default=1.35, help='Path distance ratio threshold')
    parser.add_argument('--dev', type=float, default=60, help='Raw endpoint deviation threshold')
    args = parser.parse_args()
    
    nodes = load_nodes(args.nodes)
    print(f"Loaded {len(nodes)} nodes.")
    
    roads = load_edges(args.roads)
    print(f"Loaded {len(roads)} roads.")
    road_issues = analyze_edges(roads, nodes, 'road', args.ratio, args.dev)
    
    print(f"\nFound {len(road_issues)} suspicious roads:")
    for issue in road_issues:
        if 'desc' in issue:
            print(f"\n--- [{issue['id']}] Issue: {issue['desc']} ---")
        else:
            print(f"\n--- [{issue['id']}] ({issue['from']} -> {issue['to']}) ---")
            print(f"  From: {issue['from']} {issue['from_coords']}, To: {issue['to']} {issue['to_coords']}")
            print(f"  Raw endpoints deviation: start={issue['raw_start_dev']}px, end={issue['raw_end_dev']}px")
            print(f"  Direct: {issue['direct_dist']}px, Path: {issue['path_dist']}px (Ratio: {issue['ratio']})")
            print(f"  Backtracking: {issue['backtracking']}, Projections: {issue['projections']}")
            print(f"  Raw waypoints: {issue['raw_wps']}")
            print(f"  Actual waypoints: {issue['actual_wps']}")

    sea = load_edges(args.sea)
    print(f"\nLoaded {len(sea)} sea lanes.")
    sea_issues = analyze_edges(sea, nodes, 'sea', args.ratio, args.dev)
    print(f"\nFound {len(sea_issues)} suspicious sea lanes:")
    for issue in sea_issues:
        if 'desc' in issue:
            print(f"\n--- [{issue['id']}] Issue: {issue['desc']} ---")
        else:
            print(f"\n--- [{issue['id']}] ({issue['from']} -> {issue['to']}) ---")
            print(f"  From: {issue['from']} {issue['from_coords']}, To: {issue['to']} {issue['to_coords']}")
            print(f"  Raw endpoints deviation: start={issue['raw_start_dev']}px, end={issue['raw_end_dev']}px")
            print(f"  Direct: {issue['direct_dist']}px, Path: {issue['path_dist']}px (Ratio: {issue['ratio']})")
            print(f"  Backtracking: {issue['backtracking']}, Projections: {issue['projections']}")
            print(f"  Raw waypoints: {issue['raw_wps']}")
            print(f"  Actual waypoints: {issue['actual_wps']}")

if __name__ == '__main__':
    main()
