import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.brand.primary,
  },
  secondary: {
    backgroundColor: Colors.brand.tertiary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.light.text,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
