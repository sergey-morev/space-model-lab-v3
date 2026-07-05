import { APP_CONFIG } from "../config.js";

function resolvePhysicsConfig(config = {}) {
  return {
    gravitationalConstant: config.gravitationalConstant ?? APP_CONFIG.physics.gravitationalConstant,
    softeningLength: config.softeningLength ?? APP_CONFIG.physics.softeningLength
  };
}

function createZeroAccelerations(count) {
  return Array.from({ length: count }, () => ({ x: 0, y: 0 }));
}

export function computeAccelerations(bodies, config = {}) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeAccelerations requires an array of bodies.");
  }

  const { gravitationalConstant, softeningLength } = resolvePhysicsConfig(config);
  const softeningSquared = softeningLength * softeningLength;
  const accelerations = createZeroAccelerations(bodies.length);

  for (let i = 0; i < bodies.length; i += 1) {
    const bodyA = bodies[i];
    for (let j = i + 1; j < bodies.length; j += 1) {
      const bodyB = bodies[j];
      const dx = bodyB.position.x - bodyA.position.x;
      const dy = bodyB.position.y - bodyA.position.y;
      const distanceSquared = dx * dx + dy * dy + softeningSquared;
      const distance = Math.sqrt(distanceSquared);
      const inverseDistanceCubed = 1 / (distanceSquared * distance);
      const scale = gravitationalConstant * inverseDistanceCubed;

      const accelA = scale * bodyB.mass;
      const accelB = scale * bodyA.mass;

      accelerations[i].x += dx * accelA;
      accelerations[i].y += dy * accelA;
      accelerations[j].x -= dx * accelB;
      accelerations[j].y -= dy * accelB;
    }
  }

  return accelerations;
}

export function computePotentialEnergy(bodies, config = {}) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computePotentialEnergy requires an array of bodies.");
  }

  const { gravitationalConstant, softeningLength } = resolvePhysicsConfig(config);
  const softeningSquared = softeningLength * softeningLength;
  let potentialEnergy = 0;

  for (let i = 0; i < bodies.length; i += 1) {
    const bodyA = bodies[i];
    for (let j = i + 1; j < bodies.length; j += 1) {
      const bodyB = bodies[j];
      const dx = bodyB.position.x - bodyA.position.x;
      const dy = bodyB.position.y - bodyA.position.y;
      const softenedDistance = Math.sqrt(dx * dx + dy * dy + softeningSquared);
      potentialEnergy -= gravitationalConstant * bodyA.mass * bodyB.mass / softenedDistance;
    }
  }

  return potentialEnergy;
}

export function isGravityImplemented() {
  return true;
}
