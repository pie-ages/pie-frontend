import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.light.backgroundElement,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.brand.primary,
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  name: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  removePressed: {
    opacity: 0.7,
  },
});
