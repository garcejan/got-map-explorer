import { calculateRealisticRoute } from '../src/engine/pathfinder';
import { PRESET_JOURNEYS } from '../src/data/presets';

console.log('Testing all preset journeys in PRESET_JOURNEYS:');

for (const preset of PRESET_JOURNEYS) {
  const r = calculateRealisticRoute(
    preset.originId,
    preset.destinationId,
    preset.waypoints || [],
    preset.partyId,
    preset.mode,
    preset.goal || 'balanced'
  );
  if (r) {
    console.log(`✅ [${preset.id}] ${preset.name}: ${r.totalMiles} mi, ${r.legs.length} legs`);
  } else {
    console.log(`❌ [${preset.id}] ${preset.name}: FAILED`);
  }
}
