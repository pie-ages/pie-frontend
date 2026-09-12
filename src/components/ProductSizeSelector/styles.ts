import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: BrandColors.tertiary,
  },
  circleSelected: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  circleUnavailable: {
    backgroundColor: 'transparent',
    borderColor: `${BrandColors.disabled}50`,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnavailable: {
    color: '#000000',
  },
  strikeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikeLine: {
    width: 2,
    height: 26,
    borderRadius: 1,
    backgroundColor: '#1A1A1A',
    transform: [{ rotate: '55deg' }],
  },
});
