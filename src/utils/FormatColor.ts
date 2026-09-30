// API returns color ids in lowercase (e.g. "azul", "off-white").
export function formatColor(color: string): string {
  return color.charAt(0).toUpperCase() + color.slice(1);
}
