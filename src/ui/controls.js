export function initControls(options) {
  const {
    document,
    state,
    onTogglePaused,
    onReset,
    onSpeedChange,
    onZoomIn,
    onZoomOut
  } = options;

  const toggleButton = document.getElementById("toggle-run");
  const resetButton = document.getElementById("reset-sim");
  const speedControl = document.getElementById("speed-control");
  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  const inspector = document.getElementById("inspector");

  speedControl.value = String(state.ui.speed);

  toggleButton.addEventListener("click", () => {
    onTogglePaused();
    toggleButton.textContent = state.ui.paused ? "Play" : "Pause";
    updateInspector();
  });

  resetButton.addEventListener("click", () => {
    onReset();
    toggleButton.textContent = state.ui.paused ? "Play" : "Pause";
    updateInspector();
  });

  speedControl.addEventListener("input", () => {
    onSpeedChange(Number(speedControl.value));
    updateInspector();
  });

  zoomInButton.addEventListener("click", () => {
    onZoomIn();
    updateInspector();
  });

  zoomOutButton.addEventListener("click", () => {
    onZoomOut();
    updateInspector();
  });

  function formatValue(value, digits = 6) {
    if (!Number.isFinite(value)) {
      return "n/a";
    }

    return value.toFixed(digits);
  }

  function formatVectorComponent(vector, axis) {
    return formatValue(vector?.[axis]);
  }

  function formatOptionalValue(value) {
    return value ?? "n/a";
  }

  function row(label, value) {
    return `${label.padEnd(30)} ${value}`;
  }

  function updateInspector() {
    const selectedBody = state.ui.selectedBodyId
      ? state.simulation.bodies.find((body) => body.id === state.ui.selectedBodyId)
      : null;
    const selectedLabel = selectedBody ? `${selectedBody.name ?? selectedBody.id} (${selectedBody.id})` : "none";
    const selectedPositionX = selectedBody ? selectedBody.position?.x : undefined;
    const selectedPositionY = selectedBody ? selectedBody.position?.y : undefined;
    const selectedVelocityX = selectedBody ? selectedBody.velocity?.x : undefined;
    const selectedVelocityY = selectedBody ? selectedBody.velocity?.y : undefined;
    const selectedSpeed = Number.isFinite(selectedVelocityX) && Number.isFinite(selectedVelocityY)
      ? Math.hypot(selectedVelocityX, selectedVelocityY)
      : NaN;
    const selectedDistance = Number.isFinite(selectedPositionX) && Number.isFinite(selectedPositionY)
      ? Math.hypot(selectedPositionX, selectedPositionY)
      : NaN;
    const selectedDetails = selectedBody
      ? [
          "",
          "-- SELECTED BODY --",
          row("id", selectedBody.id),
          row("name", selectedBody.name ?? "unknown"),
          row("role", selectedBody.role ?? "n/a"),
          row("normalized mass", formatValue(selectedBody.mass)),
          row("position x (normalized units)", formatVectorComponent(selectedBody.position, "x")),
          row("position y (normalized units)", formatVectorComponent(selectedBody.position, "y")),
          row("velocity x (norm units/step)", formatVectorComponent(selectedBody.velocity, "x")),
          row("velocity y (norm units/step)", formatVectorComponent(selectedBody.velocity, "y")),
          row("speed magnitude", formatValue(selectedSpeed)),
          row("distance from origin/Sun", formatValue(selectedDistance)),
          row("visual radius", formatOptionalValue(selectedBody.visualRadius)),
          row("color", formatOptionalValue(selectedBody.color))
        ]
      : [
          "",
          "-- SELECTED BODY --",
          "Select a body to inspect normalized orbital diagnostics."
        ];

    inspector.textContent = [
      "SPACE MODEL LAB V3",
      "Normalized educational units. Not real ephemeris data.",
      "",
      "-- SIMULATION --",
      row("status", state.simulation.status ?? "unknown"),
      row("mode", state.ui.paused ? "paused" : "running"),
      row("preset id", state.simulation.presetId ?? "unknown"),
      row("body count", state.simulation.bodies.length),
      row("simulation time", formatValue(state.simulation.time, 3)),
      row("step count", state.simulation.stepCount),
      row("fixed steps/frame", state.ui.speed),
      row("camera zoom", formatValue(state.camera.zoom, 2)),
      row("selected body", selectedLabel),
      "",
      "-- NOTE --",
      state.simulation.note ?? "Headless invariant baseline available through node src/dev/baseline.js.",
      ...selectedDetails
    ].join("\n");
  }

  updateInspector();

  return { updateInspector };
}
