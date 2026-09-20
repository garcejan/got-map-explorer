import { NODES } from '../src/data/nodes';
import { ROADS } from '../src/data/roads';
import { SEA_LANES } from '../src/data/seaLanes';
import { calculateRealisticRoute } from '../src/engine/pathfinder';
import { PRESET_JOURNEYS } from '../src/data/presets';
import { fromLeafletLatLng } from '../src/engine/scale';

interface EdgeAnalysis {
  id: string;
  name: string;
  from: string;
  to: string;
  type: string;
  waypoints: [number, number][];
  issues: string[];
  maxTurnAngleDeg: number;
  pathLength: number;
  straightLength: number;
  lengthRatio: number;
}

function dist(p1: [number, number], p2: [number, number]): number {
  return Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
}

// Compute angle between vector (p1 -> p2) and (p2 -> p3) in degrees
// 0 deg = straight ahead, 180 deg = direct 180 turnaround (hairpin)
function turnAngleDeg(p1: [number, number], p2: [number, number], p3: [number, number]): number {
  const v1x = p2[0] - p1[0];
  const v1y = p2[1] - p1[1];
  const v2x = p3[0] - p2[0];
  const v2y = p3[1] - p2[1];
  
  const len1 = Math.hypot(v1x, v1y);
  const len2 = Math.hypot(v2x, v2y);
  if (len1 < 1e-4 || len2 < 1e-4) return 0;
  
  const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
  const clampedDot = Math.max(-1, Math.min(1, dot));
  // angle in radians: acos(dot)
  return (Math.acos(clampedDot) * 180) / Math.PI;
}

function analyzeEdge(edge: any, type: string): EdgeAnalysis {
  const wps: [number, number][] = edge.waypoints;
  const fromNode = NODES[edge.from];
  const toNode = NODES[edge.to];
  
  const issues: string[] = [];
  let maxTurnAngle = 0;
  
  if (!fromNode) issues.push(`Missing origin node '${edge.from}'`);
  if (!toNode) issues.push(`Missing dest node '${edge.to}'`);
  
  if (wps.length < 2) {
    issues.push(`Less than 2 waypoints`);
  }
  
  // Calculate total path distance and check turns
  let pathLen = 0;
  for (let i = 0; i < wps.length - 1; i++) {
    pathLen += dist(wps[i], wps[i + 1]);
    if (i < wps.length - 2) {
      const angle = turnAngleDeg(wps[i], wps[i + 1], wps[i + 2]);
      if (angle > maxTurnAngle) maxTurnAngle = angle;
      if (angle > 95) {
        issues.push(`Sharp turn / hairpin at waypoint #${i + 1} (${wps[i + 1][0]}, ${wps[i + 1][1]}): ${angle.toFixed(1)}°`);
      }
    }
  }
  
  const straightLen = fromNode && toNode ? dist(fromNode.coords, toNode.coords) : 0;
  const ratio = straightLen > 0 ? pathLen / straightLen : 1;
  
  if (ratio > 1.35) {
    issues.push(`High path length ratio: ${ratio.toFixed(2)}x straight-line distance`);
  }
  
  // Check if intermediate waypoints backtrack along the overall direction
  if (fromNode && toNode) {
    const vx = toNode.coords[0] - fromNode.coords[0];
    const vy = toNode.coords[1] - fromNode.coords[1];
    const vLenSq = vx * vx + vy * vy;
    
    if (vLenSq > 0) {
      let maxProj = 0;
      for (let i = 0; i < wps.length; i++) {
        const proj = ((wps[i][0] - fromNode.coords[0]) * vx + (wps[i][1] - fromNode.coords[1]) * vy) / vLenSq;
        if (proj < -0.1) {
          issues.push(`Waypoint #${i} (${wps[i][0]}, ${wps[i][1]}) projects behind start (proj=${proj.toFixed(2)})`);
        } else if (proj > 1.1) {
          issues.push(`Waypoint #${i} (${wps[i][0]}, ${wps[i][1]}) overshoots destination (proj=${proj.toFixed(2)})`);
        } else if (proj < maxProj - 0.15) {
          issues.push(`Waypoint #${i} backtracks (proj dropped from ${maxProj.toFixed(2)} to ${proj.toFixed(2)})`);
        }
        maxProj = Math.max(maxProj, proj);
      }
    }
  }
  
  return {
    id: edge.id,
    name: edge.name,
    from: edge.from,
    to: edge.to,
    type,
    waypoints: wps,
    issues,
    maxTurnAngleDeg: Math.round(maxTurnAngle),
    pathLength: Math.round(pathLen),
    straightLength: Math.round(straightLen),
    lengthRatio: Number(ratio.toFixed(2))
  };
}

console.log('================ AUDITING ALL ROADS ================');
const roadAnalyses = ROADS.map(r => analyzeEdge(r, 'road'));
const problematicRoads = roadAnalyses.filter(a => a.issues.length > 0);

for (const a of problematicRoads) {
  console.log(`\n[ROAD] ${a.id}: "${a.name}" (${a.from} -> ${a.to})`);
  console.log(`  Straight: ${a.straightLength}px, Path: ${a.pathLength}px, Ratio: ${a.lengthRatio}, MaxTurn: ${a.maxTurnAngleDeg}°`);
  console.log(`  Waypoints: ${JSON.stringify(a.waypoints)}`);
  for (const iss of a.issues) {
    console.log(`  - ⚠️ ${iss}`);
  }
}

console.log(`\nTotal Roads: ${ROADS.length}, Problematic: ${problematicRoads.length}`);

console.log('\n================ AUDITING ALL SEA LANES ================');
const seaAnalyses = SEA_LANES.map(s => analyzeEdge(s, 'sea'));
const problematicSea = seaAnalyses.filter(a => a.issues.length > 0);

for (const a of problematicSea) {
  console.log(`\n[SEA] ${a.id}: "${a.name}" (${a.from} -> ${a.to})`);
  console.log(`  Straight: ${a.straightLength}px, Path: ${a.pathLength}px, Ratio: ${a.lengthRatio}, MaxTurn: ${a.maxTurnAngleDeg}°`);
  console.log(`  Waypoints: ${JSON.stringify(a.waypoints)}`);
  for (const iss of a.issues) {
    console.log(`  - ⚠️ ${iss}`);
  }
}

console.log(`\nTotal Sea Lanes: ${SEA_LANES.length}, Problematic: ${problematicSea.length}`);

console.log('\n================ AUDITING PRESET JOURNEYS ================');
for (const preset of PRESET_JOURNEYS) {
  const result = calculateRealisticRoute(
    preset.originId,
    preset.destinationId,
    preset.waypoints || [],
    preset.partyId,
    preset.mode,
    preset.goal
  );
  
  if (!result) {
    console.log(`\n[PRESET] ❌ FAILED TO ROUTE: ${preset.name} (${preset.originId} -> ${preset.destinationId})`);
    continue;
  }
  
  // Convert result.allCoordinates (Leaflet [lat, lng]) to image coords [x, y]
  const imgCoords: [number, number][] = result.allCoordinates.map(ll => fromLeafletLatLng(ll));
  let maxTurn = 0;
  const turns: { idx: number; angle: number; pt: [number, number] }[] = [];
  
  for (let i = 0; i < imgCoords.length - 2; i++) {
    const angle = turnAngleDeg(imgCoords[i], imgCoords[i + 1], imgCoords[i + 2]);
    if (angle > maxTurn) maxTurn = angle;
    if (angle > 90) {
      turns.push({ idx: i + 1, angle: Math.round(angle), pt: imgCoords[i + 1] });
    }
  }
  
  console.log(`\n[PRESET] ${preset.name} (${preset.originId} -> ${preset.destinationId})`);
  console.log(`  Legs: ${result.legs.length}, Total Miles: ${result.totalMiles}, Days: ${result.totalDays}, Max Turn: ${Math.round(maxTurn)}°`);
  if (turns.length > 0) {
    console.log(`  ⚠️ Sharp turns/hairpins detected (${turns.length}):`);
    for (const t of turns) {
      console.log(`    - at pt #${t.idx} [${t.pt[0]}, ${t.pt[1]}]: ${t.angle}°`);
    }
  } else {
    console.log(`  ✅ Smooth path`);
  }
}
