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
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
  },
  label: {
    fontWeight: '700',
  },
});
