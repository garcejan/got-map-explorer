import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';

function checkEdge(edge: any) {
  const fn = NODES[edge.from];
  const tn = NODES[edge.to];
  const wps = edge.waypoints;
  const issues: string[] = [];

  for (let i = 0; i < wps.length - 2; i++) {
    const v1x = wps[i + 1][0] - wps[i][0];
    const v1y = wps[i + 1][1] - wps[i][1];
    const v2x = wps[i + 2][0] - wps[i + 1][0];
    const v2y = wps[i + 2][1] - wps[i + 1][1];
    const dot = (v1x * v2x + v1y * v2y) / (Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y));
    const deg = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
    if (deg > 80) {
      issues.push(`Turn @ wp#${i + 1} ${JSON.stringify(wps[i + 1])}: ${deg.toFixed(1)}°`);
    }
  }

  // Projection check
  const vx = tn.coords[0] - fn.coords[0];
  const vy = tn.coords[1] - fn.coords[1];
  const lenSq = vx * vx + vy * vy;
  for (let i = 0; i < wps.length; i++) {
    const p = wps[i];
    const proj = ((p[0] - fn.coords[0]) * vx + (p[1] - fn.coords[1]) * vy) / lenSq;
    if (proj < -0.1) {
      issues.push(`wp#${i} ${JSON.stringify(p)} behind start (proj=${proj.toFixed(2)})`);
    } else if (proj > 1.1) {
      issues.push(`wp#${i} ${JSON.stringify(p)} past dest (proj=${proj.toFixed(2)})`);
    }
  }

  return issues;
}

console.log('=== PROBLEMATIC ROADS ===');
for (const r of ROADS) {
  const issues = checkEdge(r);
  if (issues.length > 0) {
    console.log(`\nRoad: ${r.id} (${r.from} -> ${r.to})`);
    console.log(`  Name: ${r.name}`);
    console.log(`  Endpoints: ${JSON.stringify(NODES[r.from].coords)} -> ${JSON.stringify(NODES[r.to].coords)}`);
    console.log(`  Current Waypoints: ${JSON.stringify(r.waypoints)}`);
    for (const iss of issues) console.log(`  ⚠️ ${iss}`);
  }
}

console.log('\n=== PROBLEMATIC SEA LANES ===');
for (const s of SEA_LANES) {
  const issues = checkEdge(s);
  if (issues.length > 0) {
    console.log(`\nSea: ${s.id} (${s.from} -> ${s.to})`);
    console.log(`  Name: ${s.name}`);
    console.log(`  Endpoints: ${JSON.stringify(NODES[s.from].coords)} -> ${JSON.stringify(NODES[s.to].coords)}`);
    console.log(`  Current Waypoints: ${JSON.stringify(s.waypoints)}`);
    for (const iss of issues) console.log(`  ⚠️ ${iss}`);
  }
}
