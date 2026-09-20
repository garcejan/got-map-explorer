import re, math
from collections import defaultdict, deque

with open('src/data/nodes.ts') as f:
    text = f.read()

nodes = {}
for m in re.finditer(r'^\s*([a-zA-Z0-9_]+):\s*\{\s*id:\s*\"([^\"]+)\",\s*name:\s*\"([^\"]+)\",\s*region:\s*\"([^\"]+)\",\s*type:\s*\"([^\"]+)\",\s*coords:\s*\[(\d+),\s*(\d+)\]', text, re.MULTILINE):
    nid, _, name, region, ntype, x, y = m.groups()
    is_port = 'isPort: true' in text[m.start():m.start()+300]
    nodes[nid] = {'id': nid, 'name': name, 'region': region, 'type': ntype, 'coords': (int(x), int(y)), 'isPort': is_port}

with open('src/data/roads.ts') as f:
    roads_text = f.read()
with open('src/data/seaLanes.ts') as f:
    sea_text = f.read()

edges = re.findall(r'from:\s*[\"\'](\w+)[\"\'],\s*to:\s*[\"\'](\w+)[\"\']', roads_text + sea_text)
existing_edges = set((u, v) for u, v in edges) | set((v, u) for u, v in edges)

print(f"Existing edges: {len(edges)}")
