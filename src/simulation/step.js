import { APP_CONFIG, STATUS } from "../config.js";
import { integrateStep } from "../physics/integrator.js";

export function stepSimulation(state) {
  if (!state?.simulation) {
    throw new TypeError("stepSimulation requires an app state with simulation state.");
  }

  const dt = APP_CONFIG.physics.timeStep;
  const step = integrateStep(state.simulation.bodies, {
    dt,
    gravitationalConstant: APP_CONFIG.physics.gravitationalConstant,
    softeningLength: APP_CONFIG.physics.softeningLength
  });

  state.simulation.bodies = step.bodies;
  state.simulation.time += dt;
  state.simulation.stepCount += 1;
  state.simulation.lastStepStatus = STATUS.ok;

  return {
    status: STATUS.ok,
    dt,
    stepCount: state.simulation.stepCount,
    bodyCount: state.simulation.bodies.length
  };
}
