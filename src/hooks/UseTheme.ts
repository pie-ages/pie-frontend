/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/UseColorScheme';

export function useTheme() {
  const scheme = useColorScheme();

  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}
