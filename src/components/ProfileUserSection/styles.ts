import { StyleSheet } from 'react-native';

import { PROFILE_AVATAR_SIZE } from '@/components/ProfileAvatar/styles';
import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    minHeight: PROFILE_AVATAR_SIZE + Spacing.three * 2 + 2,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  email: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
