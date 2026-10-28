export type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

export function parseRgbChannel(value: string): number | null {
  const normalized = value.trim();

  if (!/^\d{1,3}$/.test(normalized)) {
    return null;
  }

  const channel = Number(normalized);

  return channel <= 255 ? channel : null;
}

export function rgbToHex({ red, green, blue }: RgbColor): string {
  const channels = [red, green, blue];

  const isValid = channels.every(
    (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
  );

  if (!isValid) {
    throw new Error('Os canais RGB devem ser inteiros entre 0 e 255.');
  }

  return `#${channels
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

export function hexToRgb(value: string): RgbColor | null {
  const normalized = value.trim();

  if (!/^#[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    red: Number.parseInt(normalized.slice(1, 3), 16),
    green: Number.parseInt(normalized.slice(3, 5), 16),
    blue: Number.parseInt(normalized.slice(5, 7), 16),
  };
}
