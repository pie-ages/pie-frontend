import { StyleSheet } from 'react-native';

import { LOOK_EMPTY_CARD_ASPECT_RATIO } from '@/components/LookPiecesStack/styles';
import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  face: {
    width: '100%',
  },
  back: {
    aspectRatio: LOOK_EMPTY_CARD_ASPECT_RATIO,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.light.backgroundElement,
  },
  backFill: {
    width: '100%',
    height: '100%',
  },
  backImage: {
    width: '100%',
    height: '100%',
  },
  addPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  addPhotoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});
