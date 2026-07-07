import assert from "node:assert/strict";

import {
  compareInvariantSnapshot,
  computeBarycenter,
  createInvariantSnapshot
} from "../simulation/diagnostics.js";
import { initControls } from "../ui/controls.js";

const EPSILON = 1e-12;

function assertNear(actual, expected, message) {
  assert.ok(
    Math.abs(actual - expected) <= EPSILON,
    `${message}: expected ${expected}, received ${actual}`
  );
}

function createBody(overrides = {}) {
  return {
    id: overrides.id ?? "body",
    name: overrides.name ?? "Body",
    role: overrides.role ?? "test",
    mass: overrides.mass ?? 1,
    position: {
      x: overrides.position?.x ?? 0,
      y: overrides.position?.y ?? 0
    },
    velocity: {
      x: overrides.velocity?.x ?? 0,
      y: overrides.velocity?.y ?? 0
    },
    acceleration: {
      x: overrides.acceleration?.x ?? 0,
      y: overrides.acceleration?.y ?? 0
    },
    visualRadius: overrides.visualRadius ?? 4,
    color: overrides.color ?? "#ffffff"
  };
}

function assertBarycenterBehavior() {
  const equalMass = computeBarycenter([
    createBody({ mass: 1, position: { x: -1, y: 0 } }),
    createBody({ mass: 1, position: { x: 1, y: 0 } })
  ]);

  assert.equal(equalMass.finite, true);
  assertNear(equalMass.x, 0, "equal-mass barycenter x");
  assertNear(equalMass.y, 0, "equal-mass barycenter y");

  const weighted = computeBarycenter([
    createBody({ mass: 3, position: { x: 0, y: 0 } }),
    createBody({ mass: 1, position: { x: 4, y: 0 } })
  ]);

  assert.equal(weighted.finite, true);
  assertNear(weighted.x, 1, "weighted barycenter x");
  assertNear(weighted.y, 0, "weighted barycenter y");

  const zeroMass = computeBarycenter([
    createBody({ mass: 0, position: { x: -1, y: 0 } }),
    createBody({ mass: 0, position: { x: 1, y: 0 } })
  ]);

  assert.equal(zeroMass.finite, false);
  assert.equal(zeroMass.totalMass, 0);

  const nonFiniteMass = computeBarycenter([
    createBody({ mass: Infinity, position: { x: 0, y: 0 } })
  ]);
  assert.equal(nonFiniteMass.finite, false);

  const nonFinitePosition = computeBarycenter([
    createBody({ mass: 1, position: { x: NaN, y: 0 } })
  ]);
  assert.equal(nonFinitePosition.finite, false);
}

function assertInvariantSnapshotBehavior() {
  const bodies = [
    createBody({ id: "a", mass: 3, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0.1 } }),
    createBody({ id: "b", mass: 1, position: { x: 4, y: 0 }, velocity: { x: 0, y: -0.3 } })
  ];
  const before = JSON.stringify(bodies);
  const snapshot = createInvariantSnapshot(bodies);
  const after = JSON.stringify(bodies);

  assert.equal(after, before, "createInvariantSnapshot must not mutate bodies");
  assert.equal(typeof snapshot.totalEnergy, "number");
  assert.ok("totalMomentum" in snapshot);
  assert.equal(typeof snapshot.momentumMagnitude, "number");
  assert.equal(typeof snapshot.totalAngularMomentum, "number");
  assert.ok("finite" in snapshot);
  assert.ok("barycenter" in snapshot);
  assert.deepEqual(Object.keys(snapshot.barycenter).sort(), ["finite", "totalMass", "x", "y"]);
  assert.equal(snapshot.barycenter.finite, true);
  assertNear(snapshot.barycenter.x, 1, "snapshot barycenter x");
}

function assertComparisonBoundary() {
  const reference = createInvariantSnapshot([
    createBody({ id: "a", mass: 3, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0.1 } }),
    createBody({ id: "b", mass: 1, position: { x: 4, y: 0 }, velocity: { x: 0, y: -0.3 } })
  ]);
  const current = createInvariantSnapshot([
    createBody({ id: "a", mass: 3, position: { x: 0.1, y: 0 }, velocity: { x: 0, y: 0.1 } }),
    createBody({ id: "b", mass: 1, position: { x: 4.1, y: 0 }, velocity: { x: 0, y: -0.3 } })
  ]);
  const comparison = compareInvariantSnapshot(reference, current);

  assert.equal(Object.hasOwn(comparison, "barycenter"), false);
  assert.equal(Object.keys(comparison).some((key) => key.toLowerCase().includes("bary")), false);
  assert.ok("relativeEnergyDrift" in comparison);
  assert.ok("momentumDrift" in comparison);
  assert.ok("relativeAngularMomentumDrift" in comparison);
}

class FakeElement {
  constructor() {
    this.value = "";
    this.textContent = "";
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }
}

function createFakeDocument() {
  const elements = new Map();
  for (const id of ["toggle-run", "reset-sim", "speed-control", "zoom-in", "zoom-out", "inspector"]) {
    elements.set(id, new FakeElement());
  }

  return {
    getElementById(id) {
      const element = elements.get(id);
      assert.ok(element, `missing fake DOM element: ${id}`);
      return element;
    },
    elements
  };
}

function assertTelemetryRendering() {
  const fakeDocument = createFakeDocument();
  const state = {
    simulation: {
      bodies: [createBody({ id: "sun", name: "Sun" })],
      status: "ready",
      presetId: "test-preset",
      time: 0,
      stepCount: 0,
      note: "observable-check fixture"
    },
    diagnostics: {
      reference: null,
      current: {
        totalEnergy: -1.25,
        totalMomentum: { x: 0, y: 0 },
        momentumMagnitude: 0,
        totalAngularMomentum: 0.5,
        barycenter: { x: 0, y: 0, totalMass: 1, finite: true },
        finite: true
      },
      comparison: {
        relativeEnergyDrift: 1e-8,
        relativeAngularMomentumDrift: 2e-9
      }
    },
    camera: {
      zoom: 180
    },
    ui: {
      paused: true,
      selectedBodyId: null,
      speed: 1
    }
  };

  initControls({
    document: fakeDocument,
    state,
    onTogglePaused() {},
    onReset() {},
    onSpeedChange() {},
    onZoomIn() {},
    onZoomOut() {}
  });

  const text = fakeDocument.elements.get("inspector").textContent;
  for (const label of ["INVARIANT TELEMETRY", "Energy", "Delta E / E", "|P|", "Delta L / L"]) {
    assert.ok(text.includes(label), `telemetry inspector text missing: ${label}`);
  }
}

function runCheck(name, check) {
  check();
  console.log(`PASS: ${name}`);
}

try {
  runCheck("computeBarycenter", assertBarycenterBehavior);
  runCheck("createInvariantSnapshot", assertInvariantSnapshotBehavior);
  runCheck("compareInvariantSnapshot barycenter boundary", assertComparisonBoundary);
  runCheck("invariant telemetry fake-DOM rendering", assertTelemetryRendering);
  console.log("OBSERVABLE LAYER CHECK: PASS");
} catch (error) {
  console.error("OBSERVABLE LAYER CHECK: FAIL");
  console.error(error?.stack ?? error);
  process.exitCode = 1;
}
