export function random(min = 0, max = 1) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const range = max - min;
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    return min + (bytes[0] / (0xFFFFFFFF + 1)) * range;
  }
  return min + Math.random() * (max - min);
}

export default random;
