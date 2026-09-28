import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;
export const MAX_CONTENT_WIDTH = 430;

export function useLayoutScale() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(Math.min(width, MAX_CONTENT_WIDTH) / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  return useMemo(() => ({ scale, s: (value: number) => value * scale }), [scale]);
}

export type ScaleFn = (value: number) => number;
