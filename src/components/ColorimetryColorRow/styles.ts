import { StyleSheet } from 'react-native';

import { Colors, Spacing } from '@/constants/Theme';

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
  },
  editableRow: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSlot: {
    width: 48,
    height: 48,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#661414',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
