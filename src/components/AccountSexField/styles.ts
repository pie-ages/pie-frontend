import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  options: {
    gap: 8,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  selectedOption: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.tertiary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedText: {
    color: Colors.brand.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
  },
});
