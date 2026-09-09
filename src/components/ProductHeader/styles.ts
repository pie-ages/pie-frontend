import { StyleSheet } from 'react-native';

import { BrandColors, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 13,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 17,
    lineHeight: 17,
  },
});
