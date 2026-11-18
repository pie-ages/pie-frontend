import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    width: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BrandColors.primary,
    backgroundColor: BrandColors.tertiary,
  },
});
