import { createAppState } from "../state.js";
import { STATUS } from "../config.js";
import { getPreset, BASELINE_PRESET_ID } from "./presets.js";

function cloneBody(body) {
  return {
    ...body,
    position: { ...body.position },
    velocity: { ...body.velocity },
    acceleration: body.acceleration ? { ...body.acceleration } : { x: 0, y: 0 }
  };
}

export function resetSimulation(presetId = BASELINE_PRESET_ID) {
  const state = createAppState();
  const preset = getPreset(presetId);

  state.simulation.bodies = preset.bodies.map(cloneBody);
  state.simulation.time = 0;
  state.simulation.stepCount = 0;
  state.simulation.status = STATUS.physicsReady;
  state.simulation.presetId = preset.id;
  state.simulation.note = preset.note;

  return state;
}
