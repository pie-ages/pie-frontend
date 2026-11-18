import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: '#FCEDE7',
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: Colors.brand.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
