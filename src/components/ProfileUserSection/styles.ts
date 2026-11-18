import { StyleSheet } from 'react-native';

import { PROFILE_AVATAR_SIZE } from '@/components/ProfileAvatar/styles';
import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    minHeight: PROFILE_AVATAR_SIZE + Spacing.three * 2 + 2,
    justifyContent: 'center',
    backgroundColor: '#FFF3EE',
    borderColor: '#EEDCD3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
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
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
