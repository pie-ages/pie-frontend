import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.tertiary,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
