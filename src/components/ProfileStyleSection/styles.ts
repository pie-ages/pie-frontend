import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  pill: {
    backgroundColor: Colors.brand.tertiary,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  item: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
  caption: {
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.four,
  },
});
