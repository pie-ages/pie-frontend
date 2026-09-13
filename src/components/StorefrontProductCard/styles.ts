import { StyleSheet } from 'react-native';

export const CARD_WIDTH = 176;

export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeLogo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  info: {
    paddingTop: 10,
    gap: 4,
    backgroundColor: '#F3F3F3',
    paddingBottom: 10,
  },
  name: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  color: {
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#3C3C43',
    opacity: 0.6,
  },
  price: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#3C3C43',
    opacity: 0.6,
  },
});
