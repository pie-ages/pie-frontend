import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

const SIZE = 48;

export const styles = StyleSheet.create({
  swatch: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: Colors.brand.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
