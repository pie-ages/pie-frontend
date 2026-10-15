import { StyleSheet } from 'react-native';

import { Colors, FontFamilies } from '@/constants/Theme';
import type { ScaleFn } from '@/hooks/UseLayoutScale';

export function createStyles(s: ScaleFn) {
  const cardPadding = s(8);

  return StyleSheet.create({
    card: {
      flex: 1,
      gap: s(8),
      padding: cardPadding,
      borderRadius: s(16),
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.white,
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    cardSelected: {
      padding: cardPadding - 1,
      borderWidth: 2,
      borderColor: Colors.brand.primary,
    },
    cardPressed: {
      opacity: 0.85,
    },
    imageContainer: {
      width: '100%',
      aspectRatio: 134.5 / 192,
      borderRadius: s(12),
      overflow: 'hidden',
      backgroundColor: Colors.light.backgroundElement,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    badge: {
      position: 'absolute',
      top: s(8),
      left: s(8),
      paddingHorizontal: s(8),
      paddingVertical: s(2),
      borderRadius: 9999,
      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    },
    badgePrimary: {
      backgroundColor: Colors.brand.primary,
    },
    badgeSecondary: {
      backgroundColor: Colors.light.text,
    },
    badgeText: {
      fontFamily: FontFamilies.jakartaBold,
      fontSize: s(9),
      lineHeight: s(13.5),
      color: Colors.white,
    },
    info: {
      width: '100%',
      paddingTop: s(2),
      alignItems: 'center',
    },
    label: {
      fontFamily: FontFamilies.jakartaBold,
      fontSize: s(14),
      lineHeight: s(18),
      color: Colors.light.text,
      textAlign: 'center',
    },
  });
}
