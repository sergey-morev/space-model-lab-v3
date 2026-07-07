import { APP_CONFIG } from "../config.js";
import { isGravityImplemented } from "../physics/gravity.js";
import { isIntegratorImplemented } from "../physics/integrator.js";
import { compareInvariantSnapshot, createInvariantSnapshot } from "../simulation/diagnostics.js";
import { getPreset, BASELINE_PRESET_ID } from "../simulation/presets.js";
import { resetSimulation } from "../simulation/reset.js";
import { stepSimulation } from "../simulation/step.js";

const physicsConfig = APP_CONFIG.physics;
const baselineConfig = APP_CONFIG.baseline;
const tolerances = APP_CONFIG.tolerances;

function formatNumber(value) {
  if (value === 0) {
    return "0";
  }
  if (!Number.isFinite(value)) {
    return String(value);
  }
  return value.toExponential(12);
}

function canonicalFinalState(state) {
  return JSON.stringify({
    time: state.simulation.time.toPrecision(17),
    stepCount: state.simulation.stepCount,
    bodies: state.simulation.bodies.map((body) => ({
      id: body.id,
      mass: body.mass.toPrecision(17),
      position: {
        x: body.position.x.toPrecision(17),
        y: body.position.y.toPrecision(17)
      },
      velocity: {
        x: body.velocity.x.toPrecision(17),
        y: body.velocity.y.toPrecision(17)
      }
    }))
  });
}

function runScenario() {
  const state = resetSimulation(BASELINE_PRESET_ID);
  const initialBodies = state.simulation.bodies;
  const initial = {
    bodyCount: initialBodies.length,
    stepCount: state.simulation.stepCount,
    ...createInvariantSnapshot(initialBodies, physicsConfig)
  };

  for (let step = 0; step < baselineConfig.stepCount; step += 1) {
    stepSimulation(state);
  }

  const finalBodies = state.simulation.bodies;
  const final = {
    bodyCount: finalBodies.length,
    stepCount: state.simulation.stepCount,
    ...createInvariantSnapshot(finalBodies, physicsConfig)
  };

  const comparison = compareInvariantSnapshot(initial, final);

  return {
    state,
    initial,
    final,
    ...comparison,
    canonicalFinalState: canonicalFinalState(state)
  };
}

const preset = getPreset(BASELINE_PRESET_ID);
const runA = runScenario();
const runB = runScenario();
const repeatable = runA.canonicalFinalState === runB.canonicalFinalState;

const checks = [
  {
    label: "finite numeric state",
    pass: runA.initial.finite && runA.final.finite
  },
  {
    label: "stable body count",
    pass: runA.initial.bodyCount === runA.final.bodyCount
      && runA.final.bodyCount === preset.bodies.length
  },
  {
    label: "stable timestep count",
    pass: runA.initial.stepCount === 0
      && runA.final.stepCount === baselineConfig.stepCount
  },
  {
    label: "relative total energy drift <= 1e-3",
    pass: runA.relativeEnergyDrift <= tolerances.relativeEnergyDrift,
    detail: formatNumber(runA.relativeEnergyDrift)
  },
  {
    label: "total momentum drift <= 1e-9",
    pass: runA.momentumDrift <= tolerances.momentumDrift,
    detail: formatNumber(runA.momentumDrift)
  },
  {
    label: "relative angular momentum drift <= 1e-6",
    pass: runA.relativeAngularMomentumDrift <= tolerances.relativeAngularMomentumDrift,
    detail: formatNumber(runA.relativeAngularMomentumDrift)
  },
  {
    label: "repeatable report for same initial state and engine path",
    pass: repeatable
  },
  {
    label: "gravity implementation active",
    pass: isGravityImplemented()
  },
  {
    label: "integrator implementation active",
    pass: isIntegratorImplemented()
  },
  {
    label: "no render/camera/viewport dependency by construction",
    pass: true,
    detail: "baseline imports config, physics, and simulation modules only"
  }
];

console.log("SPACE MODEL LAB V3 PHYSICS BASELINE");
console.log(`Node version: ${process.version}`);
console.log(`baseline preset name: ${preset.name}`);
console.log(`G: ${physicsConfig.gravitationalConstant}`);
console.log(`dt: ${physicsConfig.timeStep}`);
console.log(`softening: ${physicsConfig.softeningLength}`);
console.log(`step count: ${baselineConfig.stepCount}`);
console.log(`shortest-period / timestep explanation: ${physicsConfig.timeStepNote}`);
console.log(`initial total energy: ${formatNumber(runA.initial.totalEnergy)}`);
console.log(`final total energy: ${formatNumber(runA.final.totalEnergy)}`);
console.log(`relative energy drift: ${formatNumber(runA.relativeEnergyDrift)}`);
console.log(`initial total momentum: (${formatNumber(runA.initial.totalMomentum.x)}, ${formatNumber(runA.initial.totalMomentum.y)})`);
console.log(`final total momentum: (${formatNumber(runA.final.totalMomentum.x)}, ${formatNumber(runA.final.totalMomentum.y)})`);
console.log(`momentum drift: ${formatNumber(runA.momentumDrift)}`);
console.log(`initial angular momentum: ${formatNumber(runA.initial.totalAngularMomentum)}`);
console.log(`final angular momentum: ${formatNumber(runA.final.totalAngularMomentum)}`);
console.log(`angular momentum drift: ${formatNumber(runA.angularMomentumDrift)}`);
console.log(`relative angular momentum drift: ${formatNumber(runA.relativeAngularMomentumDrift)}`);
console.log(`body count start/end: ${runA.initial.bodyCount}/${runA.final.bodyCount}`);
console.log(`timestep count start/end: ${runA.initial.stepCount}/${runA.final.stepCount}`);
console.log(`finite-state check: ${runA.initial.finite && runA.final.finite ? "PASS" : "FAIL"}`);
console.log(`repeatability check: ${repeatable ? "PASS" : "FAIL"}`);
console.log("import-boundary statement: no renderer, UI, main, camera, DOM, canvas, or viewport imports are used by this baseline.");

for (const check of checks) {
  const detail = check.detail ? ` - ${check.detail}` : "";
  console.log(`${check.pass ? "PASS" : "FAIL"}: ${check.label}${detail}`);
}

const failed = checks.filter((check) => !check.pass);
const finalStatus = failed.length === 0 ? "PASS" : "FAIL";
console.log(`final status: ${finalStatus}`);

if (failed.length > 0) {
  process.exitCode = 1;
}
