import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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
    this.hidden = false;
    this.style = {};
    this.attributes = new Map();
    this.listeners = new Map();
    const classes = new Set();
    this.classList = {
      toggle(name, enabled) {
        if (enabled) {
          classes.add(name);
        } else {
          classes.delete(name);
        }
      },
      contains(name) {
        return classes.has(name);
      }
    };
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  toggleAttribute(name, enabled) {
    if (enabled) {
      this.attributes.set(name, "");
    } else {
      this.attributes.delete(name);
    }
    return enabled;
  }
}

function createFakeDocument() {
  const markup = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  const elements = new Map();
  for (const [, id] of markup.matchAll(/\bid="([^"]+)"/g)) {
    assert.equal(elements.has(id), false, `duplicate HTML id: ${id}`);
    if (id === "space-canvas") {
      continue;
    }
    elements.set(id, new FakeElement());
  }

  return {
    getElementById(id) {
      const element = elements.get(id);
      assert.ok(element, `missing fake DOM element: ${id}`);
      return element;
    },
    elements,
    markup
  };
}

function assertTelemetryRendering() {
  const fakeDocument = createFakeDocument();
  const state = {
    simulation: {
      bodies: [createBody({ id: "sun", name: "Sun", position: { x: 3, y: 4 }, velocity: { x: 0.3, y: 0.4 } })],
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

  let resetCalls = 0;
  const controls = initControls({
    document: fakeDocument,
    state,
    onTogglePaused() { state.ui.paused = !state.ui.paused; },
    onReset() { resetCalls += 1; },
    onSpeedChange(speed) { state.ui.speed = Math.max(1, Math.min(4, Math.trunc(speed))); },
    onZoomIn() { state.camera.zoom += 20; },
    onZoomOut() { state.camera.zoom -= 20; }
  });

  function node(id) { return fakeDocument.getElementById(id); }
  function assertText(id, expected) { assert.equal(node(id).textContent, expected, id); }
  function dispatch(id, type) {
    const listener = node(id).listeners.get(type);
    assert.ok(listener, `missing ${type} listener: ${id}`);
    listener();
  }

  for (const label of ["Invariant telemetry", "Energy", "Delta E / E", "|P|", "Delta L / L"]) {
    assert.ok(fakeDocument.markup.includes(label), `HTML telemetry label missing: ${label}`);
  }
  assertText("metric-energy", "-1.2500000000e+0");
  assertText("metric-energy-drift", "1.000000e-8");
  assertText("metric-momentum", "0");
  assertText("metric-angular-drift", "2.000000e-9");
  assert.equal(node("play-icon").attributes.has("hidden"), false);
  assert.equal(node("pause-icon").attributes.has("hidden"), true);
  assert.equal(node("selection-empty").hidden, false);
  assert.equal(node("selection-details").hidden, true);
  assertText("simulation-selected", "none");

  state.ui.selectedBodyId = "sun";
  const beforeDisplay = structuredClone(state);
  controls.updateInspector();
  assert.deepEqual(state, beforeDisplay, "inspector must not mutate app or body state");
  assert.equal(node("selection-details").hidden, false);
  assert.equal(node("selection-empty").hidden, true);
  assertText("body-name", "Sun");
  assertText("body-distance", "5.000000");
  assertText("body-speed", "0.500000");
  assertText("body-position-x", "3.000000");
  assertText("body-velocity-y", "0.400000");

  // Stepping replaces body objects; the inspector must resolve the selected ID again.
  state.simulation.bodies = [createBody({ id: "sun", name: "Sun", position: { x: 0, y: 2 }, velocity: { x: 0, y: 1 } })];
  state.simulation.time = 0.25;
  state.simulation.stepCount = 250;
  state.diagnostics.current.totalEnergy = -1.2;
  controls.updateInspector();
  assertText("body-distance", "2.000000");
  assertText("body-speed", "1.000000");
  assertText("metric-energy", "-1.2000000000e+0");
  assertText("simulation-time", "0.250");
  assertText("footer-steps", "250");

  dispatch("toggle-run", "click");
  assertText("toggle-run-label", "Pause");
  assert.equal(node("toggle-run").attributes.get("aria-pressed"), "true");
  assert.equal(node("play-icon").attributes.has("hidden"), true);
  assert.equal(node("pause-icon").attributes.has("hidden"), false);
  dispatch("toggle-run", "click");
  assertText("toggle-run-label", "Play");
  assert.equal(node("toggle-run").attributes.get("aria-pressed"), "false");
  assert.equal(node("play-icon").attributes.has("hidden"), false);
  assert.equal(node("pause-icon").attributes.has("hidden"), true);

  node("speed-control").value = "4";
  dispatch("speed-control", "input");
  assert.equal(state.ui.speed, 4);
  assertText("speed-value", "4");
  assertText("simulation-speed", "4");
  dispatch("zoom-in", "click");
  assert.equal(state.camera.zoom, 200);
  assertText("zoom-value", "200");
  dispatch("zoom-out", "click");
  assert.equal(state.camera.zoom, 180);
  dispatch("reset-sim", "click");
  assert.equal(resetCalls, 1, "Reset must call the composition callback");

  state.diagnostics.current = null;
  state.diagnostics.comparison = null;
  state.simulation.bodies = [createBody({ id: "sun", mass: Infinity, position: { x: NaN, y: 1 }, velocity: { x: 0, y: Infinity }, visualRadius: NaN })];
  controls.updateInspector();
  for (const id of ["metric-energy", "metric-energy-drift", "metric-momentum", "metric-angular-drift", "body-mass", "body-distance", "body-speed", "body-radius"]) {
    assertText(id, "n/a");
  }
  state.ui.selectedBodyId = null;
  controls.updateInspector();
  assert.equal(node("selection-details").hidden, true);
  assert.equal(node("selection-empty").hidden, false);
  assertText("footer-selected", "none");
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
