import { APP_CONFIG } from "../config.js";
import { worldToScreen } from "./camera.js";

const TRAIL_LIMIT = 150;
const STAR_BASE_COUNT = 120;
const STAR_MAX_COUNT = 240;

export function createRenderer(canvas) {
  const context = canvas.getContext("2d");
  const trails = new Map();
  let lastTrailStep = -1;
  let starCache = {
    width: 0,
    height: 0,
    stars: []
  };

  function pixelRatio() {
    const cssWidth = canvas.clientWidth || canvas.width || 1;
    return Math.max(1, canvas.width / cssWidth);
  }

  function bodyScreenRadius(body) {
    return Math.max(3 * pixelRatio(), (body.visualRadius ?? 4) * pixelRatio());
  }

  function projectBody(body, camera) {
    return worldToScreen(body.position, camera, {
      width: canvas.width,
      height: canvas.height
    });
  }

  function createSeededRandom(seed) {
    let value = seed >>> 0;

    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function ensureStarfield() {
    if (starCache.width === canvas.width && starCache.height === canvas.height) {
      return;
    }

    const count = Math.min(
      STAR_MAX_COUNT,
      Math.max(STAR_BASE_COUNT, Math.floor((canvas.width * canvas.height) / 9500))
    );
    const random = createSeededRandom(1337 + canvas.width * 17 + canvas.height * 31);
    const stars = [];

    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: random() * canvas.width,
        y: random() * canvas.height,
        radius: 0.35 + random() * 1.15,
        alpha: 0.16 + random() * 0.62
      });
    }

    starCache = {
      width: canvas.width,
      height: canvas.height,
      stars
    };
  }

  function clear() {
    const gradient = context.createRadialGradient(
      canvas.width * 0.45,
      canvas.height * 0.38,
      0,
      canvas.width * 0.5,
      canvas.height * 0.5,
      Math.max(canvas.width, canvas.height) * 0.72
    );
    gradient.addColorStop(0, "#101827");
    gradient.addColorStop(0.55, APP_CONFIG.canvas.background);
    gradient.addColorStop(1, "#02040a");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    ensureStarfield();
    context.save();
    for (const star of starCache.stars) {
      context.globalAlpha = star.alpha;
      context.beginPath();
      context.arc(star.x, star.y, star.radius * pixelRatio(), 0, Math.PI * 2);
      context.fillStyle = "#d8e7ff";
      context.fill();
    }
    context.restore();
  }

  function updateTrails(state) {
    if (state.simulation.stepCount === lastTrailStep) {
      return;
    }

    lastTrailStep = state.simulation.stepCount;

    for (const body of state.simulation.bodies) {
      const points = trails.get(body.id) ?? [];
      points.push({ x: body.position.x, y: body.position.y });

      if (points.length > TRAIL_LIMIT) {
        points.splice(0, points.length - TRAIL_LIMIT);
      }

      trails.set(body.id, points);
    }
  }

  function drawTrails(state, camera) {
    updateTrails(state);

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";

    for (const body of state.simulation.bodies) {
      const points = trails.get(body.id);
      if (!points || points.length < 2) {
        continue;
      }

      const ratio = pixelRatio();
      const color = body.color ?? "#e6edf5";
      context.strokeStyle = color;
      context.lineWidth = Math.max(1, ratio);

      for (let i = 1; i < points.length; i += 1) {
        const previous = worldToScreen(points[i - 1], camera, {
          width: canvas.width,
          height: canvas.height
        });
        const current = worldToScreen(points[i], camera, {
          width: canvas.width,
          height: canvas.height
        });
        const fade = i / points.length;

        context.globalAlpha = 0.04 + fade * 0.28;
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(current.x, current.y);
        context.stroke();
      }
    }

    context.restore();
  }

  function drawBody(body, camera) {
    const ratio = pixelRatio();
    const screen = projectBody(body, camera);
    const color = body.color ?? "#e6edf5";
    const radius = bodyScreenRadius(body);
    const selected = body.id === camera.selectedBodyId;
    const central = body.mass >= 0.1;
    const haloRadius = radius + (selected ? 14 * ratio : central ? 12 * ratio : 6 * ratio);

    context.save();
    context.globalCompositeOperation = "screen";
    const glow = context.createRadialGradient(screen.x, screen.y, radius * 0.25, screen.x, screen.y, haloRadius);
    glow.addColorStop(0, color);
    glow.addColorStop(0.45, color);
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.beginPath();
    context.arc(screen.x, screen.y, haloRadius, 0, Math.PI * 2);
    context.globalAlpha = selected ? 0.42 : central ? 0.34 : 0.2;
    context.fillStyle = glow;
    context.fill();

    context.globalCompositeOperation = "source-over";
    if (selected) {
      context.globalAlpha = 1;
      context.beginPath();
      context.arc(screen.x, screen.y, radius + 7 * ratio, 0, Math.PI * 2);
      context.strokeStyle = "#eaf6ff";
      context.lineWidth = 1.5 * ratio;
      context.stroke();
    }

    context.globalAlpha = 1;
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();

    context.globalAlpha = central ? 0.9 : selected ? 0.9 : 0.62;
    context.fillStyle = "#c7d3e1";
    context.font = `${(selected ? 12 : 10) * ratio}px system-ui, sans-serif`;
    context.fillText(body.name ?? body.id ?? "body", screen.x + radius + 7 * ratio, screen.y + 4 * ratio);
    context.restore();
  }

  function drawBarycenterMarker(state, camera) {
    const barycenter = state.diagnostics?.current?.barycenter;
    if (!barycenter?.finite) {
      return;
    }

    const ratio = pixelRatio();
    const screen = worldToScreen(barycenter, camera, {
      width: canvas.width,
      height: canvas.height
    });
    const radius = 6 * ratio;
    const arm = 10 * ratio;

    context.save();
    context.globalAlpha = 0.86;
    context.strokeStyle = "#8fe3ff";
    context.lineWidth = Math.max(1, ratio);
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
    context.moveTo(screen.x - arm, screen.y);
    context.lineTo(screen.x - radius * 0.45, screen.y);
    context.moveTo(screen.x + radius * 0.45, screen.y);
    context.lineTo(screen.x + arm, screen.y);
    context.moveTo(screen.x, screen.y - arm);
    context.lineTo(screen.x, screen.y - radius * 0.45);
    context.moveTo(screen.x, screen.y + radius * 0.45);
    context.lineTo(screen.x, screen.y + arm);
    context.stroke();
    context.restore();
  }

  function findBodyAtPoint(state, camera, point) {
    let nearestBody = null;
    let nearestDistance = Infinity;

    for (const body of state.simulation.bodies) {
      const screen = projectBody(body, camera);
      const hitRadius = Math.max(bodyScreenRadius(body) + 8 * pixelRatio(), 12 * pixelRatio());
      const distance = Math.hypot(point.x - screen.x, point.y - screen.y);

      if (distance <= hitRadius && distance < nearestDistance) {
        nearestBody = body;
        nearestDistance = distance;
      }
    }

    return nearestBody;
  }

  function drawOverlay(state) {
    const ratio = pixelRatio();
    const x = 20 * ratio;
    const firstLine = 32 * ratio;
    const lineGap = 22 * ratio;

    context.fillStyle = "#e6edf5";
    context.font = `${16 * ratio}px system-ui, sans-serif`;
    context.fillText("Space Model Lab v3 - Physics kernel active", x, firstLine);

    context.fillStyle = "#9dacbd";
    context.font = `${13 * ratio}px system-ui, sans-serif`;
    context.fillText("Educational normalized Newtonian N-body sandbox", x, firstLine + lineGap);
    context.fillText(`Steps: ${state.simulation.stepCount}`, x, firstLine + lineGap * 2);
  }

  function draw(state, camera) {
    clear();
    const renderCamera = {
      ...camera,
      selectedBodyId: state.ui.selectedBodyId
    };
    drawTrails(state, renderCamera);
    for (const body of state.simulation.bodies) {
      drawBody(body, renderCamera);
    }
    drawBarycenterMarker(state, renderCamera);
    drawOverlay(state);
  }

  function resetPresentation() {
    trails.clear();
    lastTrailStep = -1;
  }

  return { draw, findBodyAtPoint, resetPresentation };
}
