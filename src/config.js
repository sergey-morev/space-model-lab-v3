export const APP_CONFIG = Object.freeze({
  name: "Space Model Lab v3",
  scaffoldStatus: "PHYSICS_KERNEL_ACTIVE",
  canvas: Object.freeze({
    background: "#070b12"
  }),
  physics: Object.freeze({
    gravitationalConstant: 1,
    timeStep: 0.001,
    softeningLength: 0.001,
    timeStepNote: "dt=0.001 is about 1/1294 of the inner baseline body's circular two-body period."
  }),
  simulation: Object.freeze({
    defaultTimeStep: 0.001,
    defaultSpeed: 1
  }),
  baseline: Object.freeze({
    presetId: "normalized-educational-nbody",
    stepCount: 5000,
    shortestPeriodBodyId: "inner",
    shortestPeriodApprox: 1.2932639185853036,
    shortestPeriodTimeSteps: 1293.2639185853036
  }),
  tolerances: Object.freeze({
    finiteState: 0,
    bodyCountDrift: 0,
    timestepCountDrift: 0,
    relativeEnergyDrift: 1e-3,
    momentumDrift: 1e-9,
    relativeAngularMomentumDrift: 1e-6
  })
});

export const STATUS = Object.freeze({
  ok: "OK",
  physicsReady: "PHYSICS_READY",
  scaffoldOnly: "SCAFFOLD_ONLY",
  notImplemented: "NOT_IMPLEMENTED",
  notChecked: "NOT_CHECKED"
});
