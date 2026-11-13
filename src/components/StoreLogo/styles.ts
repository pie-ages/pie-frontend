import { StyleSheet } from 'react-native';

import { BrandColors, Colors } from '@/constants/Theme';

export const STORE_LOGO_SIZE = 30;
const BORDER_WIDTH = 1.5;
const INNER_SIZE = STORE_LOGO_SIZE - BORDER_WIDTH * 2;

export const styles = StyleSheet.create({
  container: {
    width: STORE_LOGO_SIZE,
    height: STORE_LOGO_SIZE,
    borderRadius: STORE_LOGO_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.18)',
  },
  fallback: {
    backgroundColor: BrandColors.tertiary,
  },
  image: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_SIZE / 2,
  },
  initials: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
