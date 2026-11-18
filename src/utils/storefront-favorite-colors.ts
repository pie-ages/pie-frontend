import type { FilterOption } from '@/types/Filter';

import { hexToRgb } from './rgb-color';

// Keys are catalog taxonomy IDs. The API provides names and IDs without swatches.
const COLOR_REFERENCES: Record<string, readonly string[]> = {
  bege: ['#F5E6CC', '#D2B48C', '#C8AD7F'],
  azul: ['#001F3F', '#000080', '#1B365D', '#0000FF', '#4169E1', '#5B9BD5', '#ADD8E6'],
  preto: ['#000000', '#1C1C1C'],
  branco: ['#FFFFFF'],
  cinza: ['#404040', '#808080', '#C0C0C0', '#E5E5E5'],
  verde: ['#006400', '#008000', '#00FF00', '#808000', '#2E8B57', '#90EE90'],
  vermelho: ['#800020', '#B22222', '#FF0000'],
  rosa: ['#FF1493', '#FF69B4', '#FFC0CB', '#D57EAA'],
  terracota: ['#8A4634', '#B75D45', '#CC6B49', '#D98971'],
  'off-white': ['#FAF9F6', '#FFF8EE', '#FFFFF0'],
};

export function getFavoriteColorIds(
  options: readonly FilterOption[],
  favoriteColors: readonly string[],
): ReadonlySet<string> {
  const favoriteIds = new Set<string>();
  if (favoriteColors.length === 0) return favoriteIds;

  const references = options.flatMap(({ id }) => {
    if (!Object.hasOwn(COLOR_REFERENCES, id)) return [];

    return COLOR_REFERENCES[id].flatMap((hex) => {
      const rgb = hexToRgb(hex);
      return rgb ? [{ id, rgb }] : [];
    });
  });

  for (const hex of favoriteColors) {
    const color = hexToRgb(hex);
    if (!color) continue;

    let nearestId: string | undefined;
    let nearestDistance = Infinity;

    for (const { id, rgb } of references) {
      const distance =
        (color.red - rgb.red) ** 2 + (color.green - rgb.green) ** 2 + (color.blue - rgb.blue) ** 2;
      if (distance < nearestDistance) {
        nearestId = id;
        nearestDistance = distance;
      }
    }

    if (nearestId !== undefined) favoriteIds.add(nearestId);
  }

  return favoriteIds;
}
