/**
 * Add a unique instance parameter to a URL to bypass model caching.
 * This ensures each character gets its own model instance, preventing
 * animation mixer conflicts when multiple characters use the same model.
 */
export function makeUniqueModelUrl(url: string, instanceId: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}instance=${encodeURIComponent(instanceId)}`;
}
