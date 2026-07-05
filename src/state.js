import { APP_CONFIG } from "./config.js";

export function createAppState() {
  return {
    simulation: {
      bodies: [],
      time: 0,
      stepCount: 0,
      status: APP_CONFIG.scaffoldStatus,
      presetId: null,
      note: "Educational normalized Newtonian N-body sandbox."
    },
    camera: {
      center: { x: 0, y: 0 },
      zoom: 180
    },
    ui: {
      paused: true,
      selectedBodyId: null,
      speed: APP_CONFIG.simulation.defaultSpeed
    }
  };
}
