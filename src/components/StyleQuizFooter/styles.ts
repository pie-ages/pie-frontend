import { Platform, StyleSheet } from 'react-native';

import { Colors, SystemFonts } from '@/constants/Theme';
import type { ScaleFn } from '@/hooks/UseLayoutScale';

export function createStyles(s: ScaleFn) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: s(16),
      paddingHorizontal: s(16),
      paddingTop: s(8),
    },
    button: {
      flex: 1,
      height: s(34),
      paddingHorizontal: s(14),
      borderRadius: 1000,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.light.backgroundSelected,
    },
    buttonSelected: {
      backgroundColor: Colors.brand.primary,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    text: {
      ...SystemFonts.regular,
      fontSize: s(15),
      letterSpacing: Platform.OS === 'ios' ? undefined : s(-0.4),
      lineHeight: s(20),
      color: Colors.light.text,
    },
    textSelected: {
      color: Colors.white,
    },
  });
}
