import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  safeArea: {
    flexShrink: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  picker: {
    width: '100%',
    gap: Spacing.three,
  },
  panel: {
    height: 220,
    borderRadius: 12,
  },
  hueSlider: {
    borderRadius: 12,
  },
  error: {
    color: Colors.brand.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelText: {
    color: '#661414',
  },
  actionPressed: {
    opacity: 0.8,
  },
});
