import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

const TooltipColors = {
  border: '#F5F5F4',
  badgeBackground: 'rgba(72, 22, 29, 0.1)',
  badgeBorder: 'rgba(226, 149, 120, 0.2)',
  title: '#48161D',
  description: '#57534E',
  back: '#A8A29E',
  nextBackground: '#48161D',
} as const;

export const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    alignSelf: 'center',
    width: 310,
    maxWidth: '90%',
    padding: Spacing.three,
    gap: 3.3,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: TooltipColors.border,
    backgroundColor: Colors.white,
  },
  cardEnd: {
    alignSelf: 'auto',
    right: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    minWidth: 94,
    minHeight: 20,
    paddingHorizontal: 10,
    paddingVertical: Spacing.half,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: TooltipColors.badgeBorder,
    backgroundColor: TooltipColors.badgeBackground,
  },
  badgeLabel: {
    fontSize: 9,
    lineHeight: 13.5,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: Colors.brand.primary,
  },
  titleContainer: {
    minHeight: 18.7,
    paddingTop: 2.7,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: TooltipColors.title,
  },
  descriptionContainer: {
    minHeight: 42.45,
    paddingBottom: 9.45,
  },
  description: {
    fontSize: 11,
    lineHeight: 16.5,
    color: TooltipColors.description,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: TooltipColors.border,
  },
  backButton: {
    minWidth: 44.5,
    minHeight: 16.5,
  },
  backLabel: {
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '600',
    color: TooltipColors.back,
  },
  nextButton: {
    minWidth: 87,
    minHeight: 29,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: TooltipColors.nextBackground,
  },
  nextLabel: {
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '700',
    color: Colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
});
