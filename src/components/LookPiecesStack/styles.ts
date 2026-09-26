import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  piece: {
    width: '100%',
    aspectRatio: 1.45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.backgroundSelected,
  },
  pieceImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    width: '100%',
    aspectRatio: 0.65,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.light.backgroundElement,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
