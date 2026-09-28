import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  grid: {
    flex: 1,
    gap: Spacing.two,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    minHeight: 56,
    maxHeight: 112,
  },
});
