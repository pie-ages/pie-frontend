import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderColor: '#EADFDA',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    color: Colors.light.text,
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
});
