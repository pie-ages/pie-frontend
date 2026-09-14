import { StyleSheet } from 'react-native';

import { CARD_WIDTH } from '@/components/StorefrontProductCard';

export const COLUMN_GAP = 12;
export const GRID_WIDTH = CARD_WIDTH * 2 + COLUMN_GAP;

export const styles = StyleSheet.create({
  list: {
    width: GRID_WIDTH,
    alignSelf: 'center',
  },
  content: {
    gap: 8,
    paddingTop: 0,
  },
  row: {
    gap: COLUMN_GAP,
  },
});
