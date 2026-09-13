import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingHorizontal: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 30,
    paddingHorizontal: 4,
    borderRadius: 50,
  },
  chipDefault: {
    backgroundColor: Colors.brand.tertiary,
  },
  chipSelected: {
    backgroundColor: Colors.brand.primary,
  },
  chipPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelDefault: {
    color: Colors.light.text,
  },
  labelSelected: {
    color: Colors.white,
  },
});
