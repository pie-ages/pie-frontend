import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    gap: 8,
    paddingTop: 0,
    paddingHorizontal: Spacing.two,
  },
  row: {
    gap: 12,
  },
});
