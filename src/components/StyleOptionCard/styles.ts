import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    flexGrow: 0,
    flexBasis: '31%',
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  cardDefault: {
    backgroundColor: Colors.brand.tertiary,
  },
  cardSelected: {
    backgroundColor: Colors.brand.primary,
  },
  cardPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  labelDefault: {
    color: Colors.light.text,
  },
  labelSelected: {
    color: Colors.white,
  },
});
