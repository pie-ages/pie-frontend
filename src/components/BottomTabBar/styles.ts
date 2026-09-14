import { StyleSheet } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    width: '92%',
    maxWidth: MaxContentWidth,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.07)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.10)',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
  },
  buttonActive: {
    backgroundColor: 'rgba(224, 225, 230, 0.55)',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
  },
});
