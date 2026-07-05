export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(v, scalar) {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}

export function lengthSquared(v) {
  return dot(v, v);
}

export function length(v) {
  return Math.sqrt(lengthSquared(v));
}

export function clone(v) {
  return { x: v.x, y: v.y };
}
