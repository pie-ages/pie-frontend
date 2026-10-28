import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/Theme';

export const PROFILE_AVATAR_SIZE = 64;

export const styles = StyleSheet.create({
  avatar: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    borderRadius: PROFILE_AVATAR_SIZE / 2,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  initials: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
