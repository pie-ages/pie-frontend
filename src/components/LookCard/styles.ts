import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.light.backgroundElement,
  },
  mediaTap: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  collage: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  collageCell: {
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.backgroundSelected,
  },
  collageImage: {
    width: '100%',
    height: '100%',
  },
  photoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundSelected,
  },
  photoButtonPressed: {
    opacity: 0.7,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  count: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
