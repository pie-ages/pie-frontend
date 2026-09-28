import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const LOOK_PIECE_GAP = 6;
export const LOOK_PIECE_ASPECT_RATIO = 1.45;
export const LOOK_EMPTY_CARD_ASPECT_RATIO = 0.65;
export const LOOK_PIECE_RADIUS = 12;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: LOOK_PIECE_GAP,
  },
  piece: {
    width: '100%',
    aspectRatio: LOOK_PIECE_ASPECT_RATIO,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    aspectRatio: LOOK_EMPTY_CARD_ASPECT_RATIO,
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
