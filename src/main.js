import { resetSimulation } from "./simulation/reset.js";
import { stepSimulation } from "./simulation/step.js";
import { createCamera } from "./render/camera.js";
import { createRenderer } from "./render/renderer.js";
import { initControls } from "./ui/controls.js";

const MIN_STEPS_PER_FRAME = 1;
const MAX_STEPS_PER_FRAME = 4;
const MIN_CAMERA_ZOOM = 40;
const MAX_CAMERA_ZOOM = 320;
const CAMERA_ZOOM_STEP = 20;
const CAMERA_FIT_MARGIN = 0.4;

const canvas = document.getElementById("space-canvas");
const renderer = createRenderer(canvas);
const state = resetSimulation();
state.camera = createCamera(state.camera);

let controls;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const fallbackWidth = canvas.width || 960;
  const fallbackHeight = canvas.height || 640;
  const width = Math.max(1, Math.floor((rect.width || fallbackWidth) * ratio));
  const height = Math.max(1, Math.floor((rect.height || fallbackHeight) * ratio));

  if (canvas.width !== width) {
    canvas.width = width;
  }
  if (canvas.height !== height) {
    canvas.height = height;
  }
}

function fitCameraToBodies() {
  if (state.simulation.bodies.length === 0) {
    return;
  }

  const maxExtent = state.simulation.bodies.reduce((extent, body) => {
    return Math.max(extent, Math.abs(body.position.x), Math.abs(body.position.y));
  }, 0.5);
  const viewportSize = Math.min(canvas.width || 960, canvas.height || 640);
  const fittedZoom = Math.max(
    MIN_CAMERA_ZOOM,
    Math.min(MAX_CAMERA_ZOOM, (viewportSize * CAMERA_FIT_MARGIN) / maxExtent)
  );

  state.camera.center = { x: 0, y: 0 };
  state.camera.zoom = fittedZoom;
}

function resetApp() {
  const fresh = resetSimulation();
  state.simulation = fresh.simulation;
  state.ui.paused = true;
  state.ui.selectedBodyId = null;
  fitCameraToBodies();
  renderer.resetPresentation();
}

function clampStepsPerFrame(speed) {
  if (!Number.isFinite(speed)) {
    return MIN_STEPS_PER_FRAME;
  }

  return Math.max(MIN_STEPS_PER_FRAME, Math.min(MAX_STEPS_PER_FRAME, Math.trunc(speed)));
}

function canvasPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / (rect.width || canvas.width || 1);
  const scaleY = canvas.height / (rect.height || canvas.height || 1);

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function selectBodyAtEvent(event) {
  const point = canvasPointFromEvent(event);
  const body = renderer.findBodyAtPoint(state, state.camera, point);
  state.ui.selectedBodyId = body?.id ?? null;
  controls.updateInspector();
}

function updateCanvasCursor(event) {
  const point = canvasPointFromEvent(event);
  const body = renderer.findBodyAtPoint(state, state.camera, point);
  canvas.style.cursor = body ? "pointer" : "default";
}

controls = initControls({
  document,
  state,
  onTogglePaused() {
    state.ui.paused = !state.ui.paused;
  },
  onReset() {
    resetApp();
  },
  onSpeedChange(speed) {
    state.ui.speed = clampStepsPerFrame(speed);
  },
  onZoomIn() {
    state.camera.zoom = Math.min(MAX_CAMERA_ZOOM, state.camera.zoom + CAMERA_ZOOM_STEP);
  },
  onZoomOut() {
    state.camera.zoom = Math.max(MIN_CAMERA_ZOOM, state.camera.zoom - CAMERA_ZOOM_STEP);
  }
});

resizeCanvas();
fitCameraToBodies();
canvas.addEventListener("click", selectBodyAtEvent);
canvas.addEventListener("pointermove", updateCanvasCursor);
canvas.addEventListener("pointerleave", () => {
  canvas.style.cursor = "default";
});

function frame() {
  resizeCanvas();

  if (!state.ui.paused) {
    const stepsThisFrame = clampStepsPerFrame(state.ui.speed);
    for (let step = 0; step < stepsThisFrame; step += 1) {
      stepSimulation(state);
    }
    controls.updateInspector();
  }

  renderer.draw(state, state.camera);
  controls.updateInspector();
  requestAnimationFrame(frame);
}

frame();
