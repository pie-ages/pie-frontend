import '@/global.css';

import { Platform, type TextStyle } from 'react-native';

import type { Style } from '@/types/Style';

export const Colors = {
  light: {
    text: '#1F1F1F',
    textSecondary: '#60646C',
    textGreen: '#323A32',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
  },
  brand: {
    primary: '#661414',
    secondary: '#CBA790',
    tertiary: '#FDE2D9',
    accent: '#6E263D',
  },
  border: '#D8D8D8',
  placeholder: '#B3B3B3',
  icon: '#777777',
  iconMuted: '#B0B4BA',
  error: '#FF383C',
  white: '#FFFFFF',
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const StyleTextColors: Record<Style, { base: string; highlight: string }> = {
  romantico: { base: '#1F1F1F', highlight: '#661414' },
  criativo: { base: '#1F1F1F', highlight: '#661414' },
  casual: { base: '#1F1F1F', highlight: '#661414' },
  classico: { base: '#1F1F1F', highlight: '#661414' },
  refinado: { base: '#1F1F1F', highlight: '#661414' },
  dramatico: { base: '#FFFFFF', highlight: '#FDE2D9' },
  sensual: { base: '#FFFFFF', highlight: '#FDE2D9' },
};

export const BrandColors = {
  primary: '#661414',
  tertiary: '#FDE2D9',
  disabled: '#787880',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const FontFamilies = {
  jakartaRegular: 'PlusJakartaSans_400Regular',
  jakartaBold: 'PlusJakartaSans_700Bold',
  interRegular: 'Inter_400Regular',
  interBold: 'Inter_700Bold',
} as const;

export const SystemFonts: Record<'regular' | 'bold', TextStyle> = {
  regular: Platform.select<TextStyle>({
    ios: { fontWeight: '400' },
    default: { fontFamily: FontFamilies.interRegular },
  }),
  bold: Platform.select<TextStyle>({
    ios: { fontWeight: '700' },
    default: { fontFamily: FontFamilies.interBold },
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 90 }) ?? 0;
export const MaxContentWidth = 800;
