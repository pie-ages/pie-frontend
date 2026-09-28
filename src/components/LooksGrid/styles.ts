import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    gap: 8,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  row: {
    gap: 12,
  },
  footer: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  retryText: {
    color: Colors.brand.primary,
    textAlign: 'center',
  },
});
