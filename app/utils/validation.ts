export function isValidUrl(value = "") {
  if (!value || typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function hasText(value = "") {
  return typeof value === "string" && value.trim().length > 0;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default {
  isValidUrl,
  hasText,
  clamp,
};
