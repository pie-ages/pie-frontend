import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
