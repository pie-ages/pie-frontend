import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    width: '100%',
  },
  panel: {
    maxHeight: '82%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.four,
  },
  scroll: {
    flexGrow: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.tertiary,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
    alignItems: 'center',
  },
  group: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipLabelDefault: {
    color: Colors.light.text,
  },
  chipLabelSelected: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: Colors.white,
  },
  clearButton: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.tertiary,
  },
  clearButtonDisabled: {
    backgroundColor: Colors.light.backgroundElement,
  },
  clearLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
  clearLabelDisabled: {
    color: Colors.light.textSecondary,
  },
  applyButton: {
    flex: 1.4,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  applyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
});
