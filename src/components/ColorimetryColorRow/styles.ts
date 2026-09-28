import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: Spacing.three,
    paddingHorizontal: 50,
    gap: 8,
  },
  title: {
    color: '#292524',
    fontSize: 20,
    lineHeight: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 50,
    marginBottom: Spacing.two,
  },
  caption: {
    color: '#000000',
    fontSize: 16,
    lineHeight: 22,
  },
});
