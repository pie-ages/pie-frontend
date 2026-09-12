import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
