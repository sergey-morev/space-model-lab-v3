import { APP_CONFIG } from "../config.js";
import { computeAccelerations } from "./gravity.js";

function cloneBodyWithState(body, position, velocity, acceleration) {
  return {
    ...body,
    position,
    velocity,
    acceleration
  };
}

function resolveStepConfig(config = {}) {
  return {
    dt: config.dt ?? APP_CONFIG.physics.timeStep,
    gravitationalConstant: config.gravitationalConstant ?? APP_CONFIG.physics.gravitationalConstant,
    softeningLength: config.softeningLength ?? APP_CONFIG.physics.softeningLength
  };
}

export function integrateStep(bodies, config = {}) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("integrateStep requires an array of bodies.");
  }

  const physicsConfig = resolveStepConfig(config);
  const { dt } = physicsConfig;
  const currentAccelerations = computeAccelerations(bodies, physicsConfig);

  const driftedBodies = bodies.map((body, index) => {
    const acceleration = currentAccelerations[index];
    const halfVelocity = {
      x: body.velocity.x + 0.5 * dt * acceleration.x,
      y: body.velocity.y + 0.5 * dt * acceleration.y
    };
    const position = {
      x: body.position.x + dt * halfVelocity.x,
      y: body.position.y + dt * halfVelocity.y
    };

    return cloneBodyWithState(body, position, halfVelocity, acceleration);
  });

  const nextAccelerations = computeAccelerations(driftedBodies, physicsConfig);
  const nextBodies = driftedBodies.map((body, index) => {
    const nextAcceleration = nextAccelerations[index];
    const velocity = {
      x: body.velocity.x + 0.5 * dt * nextAcceleration.x,
      y: body.velocity.y + 0.5 * dt * nextAcceleration.y
    };

    return cloneBodyWithState(body, { ...body.position }, velocity, nextAcceleration);
  });

  return {
    bodies: nextBodies,
    dt,
    accelerations: nextAccelerations
  };
}

export function isIntegratorImplemented() {
  return true;
}
