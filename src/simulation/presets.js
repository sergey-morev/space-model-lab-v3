import { APP_CONFIG } from "../config.js";

export const BASELINE_PRESET_ID = APP_CONFIG.baseline.presetId;

function freezeBody(body) {
  return Object.freeze({
    ...body,
    position: Object.freeze(body.position),
    velocity: Object.freeze(body.velocity)
  });
}

const orbiters = [
  {
    id: "inner",
    name: "Inner",
    role: "shortest-period educational orbiter",
    mass: 0.000001,
    color: "#b8b2a6",
    visualRadius: 4,
    radius: 0.35,
    angle: 0
  },
  {
    id: "second",
    name: "Second",
    role: "educational orbiter",
    mass: 0.000002,
    color: "#d8b26e",
    visualRadius: 6,
    radius: 0.55,
    angle: 1.1
  },
  {
    id: "third",
    name: "Third",
    role: "educational orbiter",
    mass: 0.000003,
    color: "#6fb7ff",
    visualRadius: 6,
    radius: 0.8,
    angle: 2.4
  },
  {
    id: "fourth",
    name: "Fourth",
    role: "educational orbiter",
    mass: 0.0000015,
    color: "#d86c4f",
    visualRadius: 5,
    radius: 1.1,
    angle: 3.7
  },
  {
    id: "outer",
    name: "Outer",
    role: "educational outer orbiter",
    mass: 0.00001,
    color: "#d3a16d",
    visualRadius: 10,
    radius: 1.6,
    angle: 5.0
  }
];

function createOrbiterBody(orbiter) {
  const { gravitationalConstant } = APP_CONFIG.physics;
  const centralMass = 1;
  const x = Math.cos(orbiter.angle) * orbiter.radius;
  const y = Math.sin(orbiter.angle) * orbiter.radius;
  const speed = Math.sqrt(gravitationalConstant * centralMass / orbiter.radius);
  const velocity = {
    x: -Math.sin(orbiter.angle) * speed,
    y: Math.cos(orbiter.angle) * speed
  };

  return {
    id: orbiter.id,
    name: orbiter.name,
    role: orbiter.role,
    mass: orbiter.mass,
    color: orbiter.color,
    visualRadius: orbiter.visualRadius,
    position: { x, y },
    velocity
  };
}

const orbiterBodies = orbiters.map(createOrbiterBody);
const orbiterMomentum = orbiterBodies.reduce(
  (momentum, body) => ({
    x: momentum.x + body.mass * body.velocity.x,
    y: momentum.y + body.mass * body.velocity.y
  }),
  { x: 0, y: 0 }
);

const baselineBodies = Object.freeze([
  freezeBody({
    id: "sun",
    name: "Sun",
    role: "central educational mass",
    mass: 1,
    color: "#ffd166",
    visualRadius: 16,
    position: { x: 0, y: 0 },
    velocity: { x: -orbiterMomentum.x, y: -orbiterMomentum.y }
  }),
  ...orbiterBodies.map(freezeBody)
]);

export const PRESETS = Object.freeze({
  [BASELINE_PRESET_ID]: Object.freeze({
    id: BASELINE_PRESET_ID,
    name: "Normalized educational N-body baseline",
    note: "Normalized educational units only. Not calibrated or date-accurate astronomy data.",
    shortestPeriodBodyId: APP_CONFIG.baseline.shortestPeriodBodyId,
    shortestPeriodApprox: APP_CONFIG.baseline.shortestPeriodApprox,
    bodies: baselineBodies
  })
});

export function getPreset(presetId = BASELINE_PRESET_ID) {
  return PRESETS[presetId] ?? PRESETS[BASELINE_PRESET_ID];
}
