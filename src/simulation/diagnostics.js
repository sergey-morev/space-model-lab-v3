import { APP_CONFIG } from "../config.js";
import { computePotentialEnergy } from "../physics/gravity.js";

function resolvePhysicsConfig(config = {}) {
  return {
    gravitationalConstant: config.gravitationalConstant ?? APP_CONFIG.physics.gravitationalConstant,
    softeningLength: config.softeningLength ?? APP_CONFIG.physics.softeningLength
  };
}

function safeRelativeDrift(referenceValue, currentValue) {
  if (!Number.isFinite(referenceValue) || !Number.isFinite(currentValue)) {
    return NaN;
  }

  return Math.abs(currentValue - referenceValue) / Math.max(Math.abs(referenceValue), Number.EPSILON);
}

export function computeKineticEnergy(bodies) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeKineticEnergy requires an array of bodies.");
  }

  return bodies.reduce((sum, body) => {
    const speedSquared = body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y;
    return sum + 0.5 * body.mass * speedSquared;
  }, 0);
}

export function computeTotalEnergy(bodies, physicsConfig = {}) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeTotalEnergy requires an array of bodies.");
  }

  const resolvedPhysicsConfig = resolvePhysicsConfig(physicsConfig);
  return computeKineticEnergy(bodies) + computePotentialEnergy(bodies, resolvedPhysicsConfig);
}

export function computeTotalMomentum(bodies) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeTotalMomentum requires an array of bodies.");
  }

  return bodies.reduce(
    (momentum, body) => ({
      x: momentum.x + body.mass * body.velocity.x,
      y: momentum.y + body.mass * body.velocity.y
    }),
    { x: 0, y: 0 }
  );
}

export function computeMomentumMagnitude(momentum) {
  return Math.hypot(momentum?.x ?? NaN, momentum?.y ?? NaN);
}

export function computeAngularMomentum(bodies) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeAngularMomentum requires an array of bodies.");
  }

  return bodies.reduce(
    (sum, body) => sum + body.mass * (body.position.x * body.velocity.y - body.position.y * body.velocity.x),
    0
  );
}

export function computeBarycenter(bodies) {
  if (!Array.isArray(bodies)) {
    throw new TypeError("computeBarycenter requires an array of bodies.");
  }

  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const body of bodies) {
    if (!Number.isFinite(body.mass)
      || !Number.isFinite(body.position.x)
      || !Number.isFinite(body.position.y)) {
      return {
        x: NaN,
        y: NaN,
        totalMass: Number.isFinite(totalMass) ? totalMass : NaN,
        finite: false
      };
    }

    totalMass += body.mass;
    weightedX += body.mass * body.position.x;
    weightedY += body.mass * body.position.y;
  }

  if (!Number.isFinite(totalMass) || totalMass === 0) {
    return {
      x: NaN,
      y: NaN,
      totalMass,
      finite: false
    };
  }

  const x = weightedX / totalMass;
  const y = weightedY / totalMass;

  return {
    x,
    y,
    totalMass,
    finite: Number.isFinite(x) && Number.isFinite(y)
  };
}

function isFiniteBody(body) {
  return Number.isFinite(body.mass)
    && Number.isFinite(body.position.x)
    && Number.isFinite(body.position.y)
    && Number.isFinite(body.velocity.x)
    && Number.isFinite(body.velocity.y)
    && (!body.acceleration || (Number.isFinite(body.acceleration.x) && Number.isFinite(body.acceleration.y)));
}

export function allBodiesFinite(bodies) {
  return Array.isArray(bodies) && bodies.every(isFiniteBody);
}

export function createInvariantSnapshot(bodies, physicsConfig = {}) {
  const totalMomentum = computeTotalMomentum(bodies);

  return {
    totalEnergy: computeTotalEnergy(bodies, physicsConfig),
    totalMomentum,
    momentumMagnitude: computeMomentumMagnitude(totalMomentum),
    totalAngularMomentum: computeAngularMomentum(bodies),
    barycenter: computeBarycenter(bodies),
    finite: allBodiesFinite(bodies)
  };
}

export function compareInvariantSnapshot(reference, current) {
  const momentumDriftVector = {
    x: current.totalMomentum.x - reference.totalMomentum.x,
    y: current.totalMomentum.y - reference.totalMomentum.y
  };
  const angularMomentumDrift = Math.abs(current.totalAngularMomentum - reference.totalAngularMomentum);

  return {
    energyDrift: Math.abs(current.totalEnergy - reference.totalEnergy),
    relativeEnergyDrift: safeRelativeDrift(reference.totalEnergy, current.totalEnergy),
    momentumDriftVector,
    momentumDrift: computeMomentumMagnitude(momentumDriftVector),
    angularMomentumDrift,
    relativeAngularMomentumDrift: safeRelativeDrift(reference.totalAngularMomentum, current.totalAngularMomentum),
    finite: Boolean(reference.finite && current.finite)
  };
}
