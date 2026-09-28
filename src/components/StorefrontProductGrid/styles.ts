import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    gap: 8,
    paddingTop: 0,
    paddingHorizontal: Spacing.two,
  },
  row: {
    gap: 12,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  refreshIndicator: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});
