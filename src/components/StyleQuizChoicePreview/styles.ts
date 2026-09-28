import { StyleSheet } from 'react-native';

import { Colors, FontFamilies, SystemFonts } from '@/constants/Theme';
import type { ScaleFn } from '@/hooks/UseLayoutScale';

export function createStyles(s: ScaleFn) {
  const contentWidth = s(253);

  return StyleSheet.create({
    dim: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s(24),
    },
    card: {
      width: contentWidth,
      gap: s(12),
      padding: s(12),
      borderRadius: s(24),
      backgroundColor: Colors.white,
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 134.5 / 192,
      borderRadius: s(16),
      overflow: 'hidden',
      backgroundColor: Colors.light.backgroundElement,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    info: {
      alignItems: 'center',
      paddingBottom: s(4),
    },
    label: {
      fontFamily: FontFamilies.jakartaBold,
      fontSize: s(18),
      lineHeight: s(24),
      color: Colors.light.text,
      textAlign: 'center',
    },
    description: {
      fontFamily: FontFamilies.jakartaRegular,
      fontSize: s(12),
      lineHeight: s(16),
      color: Colors.light.textSecondary,
      textAlign: 'center',
    },
    title: {
      ...SystemFonts.bold,
      fontSize: s(22),
      lineHeight: s(28),
      color: Colors.light.text,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: s(12),
      width: contentWidth,
    },
    dimmed: {
      opacity: 0.5,
    },
    smallCard: {
      flex: 1,
      gap: s(8),
      padding: s(8),
      borderRadius: s(16),
      backgroundColor: Colors.white,
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    },
    smallLabel: {
      fontFamily: FontFamilies.jakartaBold,
      fontSize: s(13),
      lineHeight: s(18),
      color: Colors.light.text,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: s(12),
      width: contentWidth,
    },
    button: {
      flex: 1,
      height: s(44),
      borderRadius: 1000,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {
      backgroundColor: Colors.light.backgroundSelected,
    },
    confirmButton: {
      backgroundColor: Colors.brand.primary,
    },
    pressed: {
      opacity: 0.8,
    },
    buttonText: {
      ...SystemFonts.regular,
      fontSize: s(16),
      lineHeight: s(21),
    },
    backText: {
      color: Colors.light.text,
    },
    confirmText: {
      color: Colors.white,
    },
  });
}
