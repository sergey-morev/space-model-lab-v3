export function createCamera(overrides = {}) {
  return {
    center: { x: 0, y: 0, ...(overrides.center ?? {}) },
    zoom: overrides.zoom ?? 180
  };
}

export function worldToScreen(point, camera, viewport) {
  const width = viewport?.width ?? 0;
  const height = viewport?.height ?? 0;
  const zoom = camera?.zoom ?? 1;
  const center = camera?.center ?? { x: 0, y: 0 };

  return {
    x: width / 2 + (point.x - center.x) * zoom,
    y: height / 2 + (point.y - center.y) * zoom
  };
}

export function screenToWorld(point, camera, viewport) {
  const width = viewport?.width ?? 0;
  const height = viewport?.height ?? 0;
  const zoom = camera?.zoom ?? 1;
  const center = camera?.center ?? { x: 0, y: 0 };

  return {
    x: (point.x - width / 2) / zoom + center.x,
    y: (point.y - height / 2) / zoom + center.y
  };
}
