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
    gradient.addColorStop(0, "#101010");
    gradient.addColorStop(0.55, "#090909");
    gradient.addColorStop(1, "#050505");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    ensureStarfield();
    context.save();
    for (const star of starCache.stars) {
      context.globalAlpha = star.alpha;
      context.beginPath();
      context.arc(star.x, star.y, star.radius * pixelRatio(), 0, Math.PI * 2);
      context.fillStyle = "#dddddd";
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

    context.restore();
  }

  function drawLabels(bodies, camera) {
    const ratio = pixelRatio();
    const padding = 3 * ratio;
    const margin = 6 * ratio;
    const projected = bodies.map((body) => ({ body, screen: projectBody(body, camera), radius: bodyScreenRadius(body) }));
    const occupied = projected.map(({ screen, radius }) => ({
      x: screen.x - radius - padding, y: screen.y - radius - padding,
      width: 2 * (radius + padding), height: 2 * (radius + padding)
    }));
    const overlap = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x))
      * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));

    context.save();
    context.textBaseline = "top";
    // Selected labels get first choice. Placement uses screen rectangles only;
    // it never changes world state, hit targets, or body projection.
    projected.sort((a, b) => Number(b.body.id === camera.selectedBodyId) - Number(a.body.id === camera.selectedBodyId));
    for (const { body, screen, radius } of projected) {
      if (screen.x < 0 || screen.x > canvas.width || screen.y < 0 || screen.y > canvas.height) continue;
      const selected = body.id === camera.selectedBodyId;
      const label = body.name ?? body.id ?? "body";
      context.font = `${(selected ? 13 : 12) * ratio}px system-ui, sans-serif`;
      const width = Math.min(canvas.width - 2 * margin, context.measureText(label).width + 2 * padding);
      const height = 18 * ratio;
      let placement;
      let leastOverlap = Infinity;
      for (const offset of [0, -1, 1, -2, 2, -3, 3]) {
        for (const side of [1, -1]) {
          const candidate = {
            x: Math.max(margin, Math.min(canvas.width - margin - width,
              side > 0 ? screen.x + radius + 7 * ratio : screen.x - radius - 7 * ratio - width)),
            y: Math.max(margin, Math.min(canvas.height - margin - height, screen.y - height / 2 + offset * height)),
            width, height
          };
          const area = occupied.reduce((sum, box) => sum + overlap(candidate, box), 0);
          if (area < leastOverlap) {
            placement = candidate;
            leastOverlap = area;
          }
          if (area === 0) break;
        }
        if (leastOverlap === 0) break;
      }
      occupied.push(placement);
      const anchor = {
        x: Math.max(placement.x, Math.min(placement.x + width, screen.x)),
        y: Math.max(placement.y, Math.min(placement.y + height, screen.y))
      };
      context.globalAlpha = 0.45;
      context.strokeStyle = body.color ?? "#c7d3e1";
      context.lineWidth = ratio;
      context.beginPath();
      context.moveTo(screen.x, screen.y);
      context.lineTo(anchor.x, anchor.y);
      context.stroke();
      context.globalAlpha = selected ? 1 : 0.85;
      context.lineWidth = 3 * ratio;
      context.strokeStyle = "#090909";
      context.fillStyle = "#d3dce8";
      context.strokeText(label, placement.x + padding, placement.y + padding, width - 2 * padding);
      context.fillText(label, placement.x + padding, placement.y + padding, width - 2 * padding);
    }
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
    drawLabels(state.simulation.bodies, renderCamera);
  }

  function resetPresentation() {
    trails.clear();
    lastTrailStep = -1;
  }

  return { draw, findBodyAtPoint, resetPresentation };
}
