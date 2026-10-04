import assert from 'node:assert/strict';
import { APP_CONFIG } from '../config.js';
import { stepSimulation } from '../simulation/step.js';
import { integrateStep } from '../physics/integrator.js';
import { computeAccelerations } from '../physics/gravity.js';
import { createInvariantSnapshot, compareInvariantSnapshot, computeRelativeMotion } from '../simulation/diagnostics.js';
import { resetSimulation } from '../simulation/reset.js';
import { getPreset, HIERARCHY_PRESET_ID } from '../simulation/presets.js';
const cfg = {
  G: 1,
  dt: 0.001,
  softening: 0.001,
  horizon: 50,
  steps: 50000,
  starMass: 1,
  planetMass: 0.02,
  moonMass: 0.00002,
  outerSeparation: 1,
  innerSeparation: 0.06
};
assert.equal(APP_CONFIG.physics.gravitationalConstant, cfg.G);
assert.equal(APP_CONFIG.physics.timeStep, cfg.dt);
assert.equal(APP_CONFIG.physics.softeningLength, cfg.softening);
const innerMass = cfg.planetMass + cfg.moonMass,
  totalMass = cfg.starMass + innerMass;
const omega = (m, r) => Math.sqrt(cfg.G * m / (r * r + cfg.softening * cfg.softening) ** 1.5);
const innerOmega = omega(innerMass, cfg.innerSeparation),
  outerOmega = omega(totalMass, cfg.outerSeparation);
const innerSpeed = cfg.innerSeparation * innerOmega,
  outerSpeed = cfg.outerSeparation * outerOmega;
const body = (id, mass, x, y, vx, vy) => ({
  id,
  mass,
  position: {
    x,
    y
  },
  velocity: {
    x: vx,
    y: vy
  }
});
const preset = getPreset(HIERARCHY_PRESET_ID);
assert.equal(preset.id, 'normalized-star-planet-moon', 'must not silently resolve the baseline');
const seed = preset.bodies;
const exactSeed = [body('star', 1, -0.01962706613595812, 0, 0, -0.0198225446056207), body('planet', 0.02, 0.980372933864042, -0.00005994005994005994, 0.0005769416183836161, 0.9901370931878473), body('moon', 0.00002, 0.980372933864042, 0.05994005994005994, -0.5769416183836161, 0.9901370931878473)];
assert.deepEqual(seed.map(({
  id,
  mass,
  position,
  velocity
}) => ({
  id,
  mass,
  position,
  velocity
})), exactSeed, 'frozen exact seed');
assert.equal(seed[0].referenceBodyId, undefined);
assert.equal(seed[1].referenceBodyId, 'star');
assert.equal(seed[2].referenceBodyId, 'planet');
const canonical = s => JSON.stringify({
  time: s.simulation.time.toPrecision(17),
  stepCount: s.simulation.stepCount,
  bodies: s.simulation.bodies.map(b => ({
    id: b.id,
    mass: b.mass.toPrecision(17),
    position: {
      x: b.position.x.toPrecision(17),
      y: b.position.y.toPrecision(17)
    },
    velocity: {
      x: b.velocity.x.toPrecision(17),
      y: b.velocity.y.toPrecision(17)
    }
  }))
});
const norm = v => Math.hypot(v.x, v.y);
const sub = (a, b) => ({
  x: a.x - b.x,
  y: a.y - b.y
});
const relative = b => {
  const [s, p, m] = b;
  const com = {
    x: (p.mass * p.position.x + m.mass * m.position.x) / innerMass,
    y: (p.mass * p.position.y + m.mass * m.position.y) / innerMass
  };
  return {
    inner: sub(m.position, p.position),
    outer: sub(com, s.position)
  };
};
const gates = (initial, peak, ranges, wind, finite, ids, steps) => [['finite state at t=0 and every step', finite], ['body count and IDs star/planet/moon at every step', ids], ['fixed step count 50000', steps === cfg.steps], ['A initial |P| <= 1e-12', initial.momentumMagnitude <= 1e-12], ['A initial barycenter distance <= 1e-12', norm(initial.barycenter) <= 1e-12], ['B peak relative energy drift <= 1e-3', peak.energy.value <= 1e-3], ['B peak momentum drift <= 1e-9', peak.momentum.value <= 1e-9], ['B peak relative angular momentum drift <= 1e-6', peak.angular.value <= 1e-6], ['B peak barycenter propagation error <= 1e-9', peak.barycenter.value <= 1e-9], ['C Planet–Moon separation in [0.03,0.12]', ranges.inner.min >= 0.03 && ranges.inner.max <= 0.12], ['C Star–inner COM separation in [0.8,1.2]', ranges.outer.min >= 0.8 && ranges.outer.max <= 1.2], ['C Moon prograde windings >= 50', wind.inner >= 50], ['C inner COM prograde windings >= 6', wind.outer >= 6]].map(([gate, pass]) => ({
  gate,
  pass
}));
function run() {
  const state = resetSimulation(HIERARCHY_PRESET_ID);
  const initial = createInvariantSnapshot(state.simulation.bodies);
  const peak = Object.fromEntries(['energy', 'momentum', 'angular', 'barycenter'].map(k => [k, {
    value: 0,
    step: 0
  }]));
  const ranges = {
    inner: {
      min: Infinity,
      max: -Infinity
    },
    outer: {
      min: Infinity,
      max: -Infinity
    }
  };
  const angles = {
      inner: 0,
      outer: 0
    },
    previous = {};
  let finite = true,
    ids = true,
    firstViolation = null,
    final;
  for (let n = 0; n <= cfg.steps; n++) {
    if (n > 0) stepSimulation(state);
    final = createInvariantSnapshot(state.simulation.bodies);
    finite &&= final.finite && Object.values(final.totalMomentum).every(Number.isFinite) && Number.isFinite(final.totalEnergy) && Number.isFinite(final.totalAngularMomentum) && final.barycenter.finite;
    ids &&= JSON.stringify(state.simulation.bodies.map(b => b.id)) === JSON.stringify(['star', 'planet', 'moon']);
    const drift = compareInvariantSnapshot(initial, final);
    const t = n * cfg.dt;
    const error = norm({
      x: final.barycenter.x - initial.barycenter.x - initial.totalMomentum.x * t / totalMass,
      y: final.barycenter.y - initial.barycenter.y - initial.totalMomentum.y * t / totalMass
    });
    for (const [key, value] of Object.entries({
      energy: drift.relativeEnergyDrift,
      momentum: drift.momentumDrift,
      angular: drift.relativeAngularMomentumDrift,
      barycenter: error
    })) if (value > peak[key].value) peak[key] = {
      value,
      step: n
    };
    for (const [key, v] of Object.entries(relative(state.simulation.bodies))) {
      const r = norm(v);
      ranges[key].min = Math.min(ranges[key].min, r);
      ranges[key].max = Math.max(ranges[key].max, r);
      const angle = Math.atan2(v.y, v.x);
      if (n > 0) {
        const delta = angle - previous[key];
        angles[key] += Math.atan2(Math.sin(delta), Math.cos(delta));
      }
      previous[key] = angle;
    }
    const checks = gates(initial, peak, ranges, {
      inner: Infinity,
      outer: Infinity
    }, finite, ids, cfg.steps);
    const failed = checks.filter(g => !g.pass);
    if (!firstViolation && failed.length) firstViolation = {
      step: n,
      time: t,
      gates: failed
    };
  }
  const wind = {
    inner: angles.inner / (2 * Math.PI),
    outer: angles.outer / (2 * Math.PI)
  };
  const checks = gates(initial, peak, ranges, wind, finite, ids, state.simulation.stepCount);
  return {
    initial,
    final,
    peak,
    ranges,
    wind,
    finite,
    ids,
    checkedSamples: cfg.steps + 1,
    integerStepTime: cfg.steps * cfg.dt,
    accumulatedTime: state.simulation.time,
    firstViolation,
    checks,
    canonicalFinalState: canonical(state),
    finalBodies: state.simulation.bodies
  };
}
const first = run();
const second = run();
const repeatable = first.canonicalFinalState === second.canonicalFinalState;
const pair = [body('planet', cfg.planetMass, 0, -cfg.moonMass / innerMass * cfg.innerSeparation, cfg.moonMass / innerMass * innerSpeed, 0), body('moon', cfg.moonMass, 0, cfg.planetMass / innerMass * cfg.innerSeparation, -cfg.planetMass / innerMass * innerSpeed, 0)];
const period = 2 * Math.PI / innerOmega,
  steps = Math.round(period / cfg.dt),
  t = steps * cfg.dt;
const pairState = {
  simulation: {
    bodies: structuredClone(pair),
    time: 0,
    stepCount: 0
  }
};
for (let i = 0; i < steps; i++) stepSimulation(pairState);
const analytic = {
  x: -cfg.innerSeparation * Math.sin(innerOmega * t),
  y: cfg.innerSeparation * Math.cos(innerOmega * t)
};
const actual = sub(pairState.simulation.bodies[1].position, pairState.simulation.bodies[0].position);
const relativePositionError = norm(sub(actual, analytic)) / cfg.innerSeparation;
// Assertion tolerances fixed in source before the first execution; roundoff allowances only, not WO gate changes.
const covarianceTolerance = 1e-12,
  recoilTolerance = 1e-12;
const accelerations = computeAccelerations(pair);
const recoil = norm({
  x: pair[0].mass * accelerations[0].x + pair[1].mass * accelerations[1].x,
  y: pair[0].mass * accelerations[0].y + pair[1].mass * accelerations[1].y
});
const integrated = integrateStep(pair).bodies;
const shift = {
    x: 0.25,
    y: -0.125
  },
  boost = {
    x: 0.125,
    y: -0.0625
  };
const translated = integrateStep(pair.map(b => ({
  ...b,
  position: {
    x: b.position.x + shift.x,
    y: b.position.y + shift.y
  }
}))).bodies;
const boosted = integrateStep(pair.map(b => ({
  ...b,
  velocity: {
    x: b.velocity.x + boost.x,
    y: b.velocity.y + boost.y
  }
}))).bodies;
let translationError = 0,
  boostError = 0;
for (let i = 0; i < 2; i++) {
  translationError = Math.max(translationError, norm(sub(translated[i].position, {
    x: integrated[i].position.x + shift.x,
    y: integrated[i].position.y + shift.y
  })), norm(sub(translated[i].velocity, integrated[i].velocity)));
  boostError = Math.max(boostError, norm(sub(boosted[i].position, {
    x: integrated[i].position.x + boost.x * cfg.dt,
    y: integrated[i].position.y + boost.y * cfg.dt
  })), norm(sub(boosted[i].velocity, {
    x: integrated[i].velocity.x + boost.x,
    y: integrated[i].velocity.y + boost.y
  })));
}
const pairCOM = createInvariantSnapshot(pairState.simulation.bodies).barycenter;
const recoilPosition = norm(pairCOM);
const anchors = {
  pair,
  period,
  steps,
  t,
  analytic,
  actual,
  relativePositionError,
  recoil,
  recoilPosition,
  translationError,
  boostError,
  covarianceTolerance,
  recoilTolerance
};
const checks = [...first.checks, {
  gate: 'D identical same-engine canonical final state',
  pass: repeatable
}, {
  gate: 'analytic pair relative-position error <= 1e-3',
  pass: relativePositionError <= 1e-3
}, {
  gate: 'mass-weighted recoil consistency (force and evolved COM)',
  pass: recoil <= recoilTolerance && recoilPosition <= recoilTolerance
}, {
  gate: 'translation covariance (one full KDK step)',
  pass: translationError <= covarianceTolerance
}, {
  gate: 'uniform-velocity boost covariance (one full KDK step)',
  pass: boostError <= covarianceTolerance
}];
// Independent 3-4-5 vector fixture, including invalid and absent references.
const fixture = [body('reference', 1, 1, 2, 1, 2), {
  ...body('observed', 1, 4, 6, 4, 6),
  referenceBodyId: 'reference'
}, {
  ...body('missing', 1, 0, 0, 0, 0),
  referenceBodyId: 'unknown'
}, {
  ...body('self', 1, 0, 0, 0, 0),
  referenceBodyId: 'self'
}, {
  ...body('nonfinite', 1, NaN, 0, 0, 0),
  referenceBodyId: 'reference'
}];
const before = JSON.stringify(fixture);
const relativeFixture = computeRelativeMotion(fixture);
assert.equal(JSON.stringify(fixture), before, 'relative diagnostics must be read-only');
assert.deepEqual(relativeFixture.observed.relativePosition, {
  x: 3,
  y: 4
});
assert.deepEqual(relativeFixture.observed.relativeVelocity, {
  x: 3,
  y: 4
});
assert.equal(relativeFixture.observed.distance, 5);
assert.equal(relativeFixture.observed.speed, 5);
assert.equal(relativeFixture.reference.valid, true);
assert.equal(relativeFixture.reference.distance, null);
for (const id of ['missing', 'self', 'nonfinite']) assert.equal(relativeFixture[id].valid, false);
const baselineRelative = computeRelativeMotion(resetSimulation().simulation.bodies);
assert.ok(Object.values(baselineRelative).every(r => r.valid && r.referenceBodyId === null && r.distance === null && r.speed === null));
const expectedStep = integrateStep(seed).bodies;
const alteredStep = integrateStep(seed.map(b => ({
  ...b,
  referenceBodyId: 'arbitrary-observation-only'
}))).bodies;
assert.deepEqual(expectedStep.map(({
  position,
  velocity,
  acceleration
}) => ({
  position,
  velocity,
  acceleration
})), alteredStep.map(({
  position,
  velocity,
  acceleration
}) => ({
  position,
  velocity,
  acceleration
})), 'observation references cannot affect dynamics');
checks.push({
  gate: 'relative diagnostics correct, read-only, invalid/n/a fixtures',
  pass: true
}, {
  gate: 'reference metadata independent of force/integrator',
  pass: true
});
checks.push({
  gate: 'all repeated-run frozen gates',
  pass: second.checks.every(c => c.pass)
});
const result = {
  status: checks.every(c => c.pass) ? 'PASS' : 'FAIL',
  scenarioId: preset.id,
  engine: process.version,
  cfg,
  seed,
  first,
  repeatable,
  secondCanonicalFinalState: second.canonicalFinalState,
  anchors,
  checks
};
console.log('SPACE MODEL LAB V3 HIERARCHY CHECK');
console.log(JSON.stringify(result, null, 2));
for (const check of checks) console.log(`${check.pass ? 'PASS' : 'FAIL'}: ${check.gate}`);
console.log(`final hierarchy result ${result.status}`);
if (result.status !== 'PASS') process.exitCode = 1;
