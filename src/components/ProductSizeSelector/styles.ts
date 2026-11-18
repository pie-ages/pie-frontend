import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
  chip: {
    minWidth: 36,
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.primary,
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    includeFontPadding: false,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
