import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  list: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  item: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
  },
  caption: {
    color: '#000000',
    paddingHorizontal: Spacing.four,
  },
});
