import { StyleSheet } from 'react-native';

import { BrandColors, Spacing } from '@/constants/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  imageWrapper: {
    marginBottom: 48,
  },
  sectionsWrapper: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  descriptionSection: {
    gap: Spacing.one,
  },
  sizeSection: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 17,
    lineHeight: 17,
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '400',
  },
  priceValue: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '700',
  },
  storeValue: {
    color: BrandColors.primary,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '700',
  },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
  },
});
