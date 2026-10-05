export function initControls(options) {
  const {
    document,
    state,
    onTogglePaused,
    onReset,
    onScenarioChange,
    onSpeedChange,
    onZoomIn,
    onZoomOut
  } = options;

  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) {
      const node = document.getElementById(id);
      if (!node) {
        throw new Error(`Missing UI element: ${id}`);
      }
      elements.set(id, node);
    }
    return elements.get(id);
  }

  function text(id, value) {
    const node = element(id);
    const next = String(value);
    if (node.textContent !== next) {
      node.textContent = next;
    }
  }

  function formatValue(value, digits = 6) {
    return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
  }

  function formatScientific(value, digits = 6) {
    if (!Number.isFinite(value)) {
      return "n/a";
    }
    return value === 0 ? "0" : value.toExponential(digits);
  }

  function formatStatus(value) {
    return typeof value === "string" ? value.replaceAll("_", " ").toLowerCase() : "unknown";
  }

  const toggleButton = element("toggle-run");
  const speedControl = element("speed-control");
  const scenarioControl = element("scenario-control");
  speedControl.value = String(state.ui.speed);

  toggleButton.addEventListener("click", () => {
    onTogglePaused();
    updateInspector();
  });
  element("reset-sim").addEventListener("click", () => {
    onReset();
    updateInspector();
  });
  scenarioControl.addEventListener("change", () => {
    onScenarioChange(scenarioControl.value);
    updateInspector();
  });
  speedControl.addEventListener("input", () => {
    onSpeedChange(Number(speedControl.value));
    speedControl.value = String(state.ui.speed);
    updateInspector();
  });
  element("zoom-in").addEventListener("click", () => {
    onZoomIn();
    updateInspector();
  });
  element("zoom-out").addEventListener("click", () => {
    onZoomOut();
    updateInspector();
  });

  function updateInspector() {
    const simulation = state.simulation;
    const selectedBody = state.ui.selectedBodyId
      ? simulation.bodies.find((body) => body.id === state.ui.selectedBodyId)
      : null;
    const selectedLabel = selectedBody ? selectedBody.name ?? selectedBody.id : "none";
    const diagnostics = state.diagnostics ?? {};
    scenarioControl.value = simulation.presetId;
    const relative = diagnostics.current?.relativeMotionByBodyId?.[selectedBody?.id];
    const hasReference = relative?.valid && relative.referenceBodyId !== null;
    text("body-reference", hasReference ? `${relative.referenceName} (${relative.referenceBodyId})` : "none / n/a");
    text("body-reference-distance", hasReference ? formatValue(relative.distance) : "n/a");
    text("body-reference-speed", hasReference ? formatValue(relative.speed) : "n/a");
    const mode = state.ui.paused ? "Paused" : "Running";
    const time = formatValue(simulation.time, 3);
    const zoom = formatValue(state.camera.zoom, 0);

    text("toggle-run-label", state.ui.paused ? "Play" : "Pause");
    toggleButton.setAttribute("aria-pressed", String(!state.ui.paused));
    toggleButton.title = state.ui.paused ? "Play simulation" : "Pause simulation";
    element("play-icon").toggleAttribute("hidden", !state.ui.paused);
    element("pause-icon").toggleAttribute("hidden", state.ui.paused);
    text("speed-value", state.ui.speed);
    text("zoom-value", zoom);

    text("metric-energy", formatScientific(diagnostics.current?.totalEnergy, 10));
    text("metric-energy-drift", formatScientific(diagnostics.comparison?.relativeEnergyDrift));
    text("metric-momentum", formatScientific(diagnostics.current?.momentumMagnitude));
    text("metric-angular-drift", formatScientific(diagnostics.comparison?.relativeAngularMomentumDrift));

    element("selection-empty").hidden = Boolean(selectedBody);
    element("selection-details").hidden = !selectedBody;
    element("selection-indicator").classList.toggle("selected", Boolean(selectedBody));
    if (selectedBody) {
      const x = selectedBody.position?.x;
      const y = selectedBody.position?.y;
      const vx = selectedBody.velocity?.x;
      const vy = selectedBody.velocity?.y;
      const speed = Number.isFinite(vx) && Number.isFinite(vy) ? Math.hypot(vx, vy) : NaN;
      const distance = Number.isFinite(x) && Number.isFinite(y) ? Math.hypot(x, y) : NaN;

      text("body-name", selectedLabel);
      text("body-role", selectedBody.role ?? "n/a");
      text("body-id", selectedBody.id ?? "n/a");
      text("body-mass", formatScientific(selectedBody.mass, 4));
      text("body-distance", formatValue(distance));
      text("body-speed", formatValue(speed));
      text("body-position-x", formatValue(x));
      text("body-position-y", formatValue(y));
      text("body-velocity-x", formatValue(vx));
      text("body-velocity-y", formatValue(vy));
      text("body-radius", formatValue(selectedBody.visualRadius, 1));
      text("body-color", selectedBody.color ?? "n/a");
      const swatch = element("body-color-swatch");
      swatch.style.backgroundColor = "#888888";
      if (typeof selectedBody.color === "string") {
        swatch.style.backgroundColor = selectedBody.color;
      }
    }

    text("simulation-status", formatStatus(simulation.status));
    text("simulation-mode", mode);
    element("simulation-mode").classList.toggle("running", !state.ui.paused);
    text("simulation-preset", simulation.presetId ?? "unknown");
    text("simulation-bodies", simulation.bodies.length);
    text("simulation-time", time);
    text("simulation-steps", simulation.stepCount);
    text("simulation-speed", state.ui.speed);
    text("simulation-zoom", zoom);
    text("simulation-selected", selectedBody ? `${selectedLabel} (${selectedBody.id})` : "none");
    text("simulation-note", simulation.note ?? "Headless invariant baseline available through node src/dev/baseline.js.");

    text("footer-mode", mode);
    element("run-status-dot").classList.toggle("paused", state.ui.paused);
    text("footer-time", time);
    text("footer-steps", simulation.stepCount);
    text("footer-bodies", simulation.bodies.length);
    text("footer-selected", selectedLabel);
  }

  updateInspector();
  return { updateInspector };
}
