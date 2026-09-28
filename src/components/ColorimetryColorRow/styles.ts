import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    color: '#292524',
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: Spacing.four,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  caption: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: Spacing.four,
  },
});
