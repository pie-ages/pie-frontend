import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  container: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lensCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 0,
  },
  topLeft: {
    top: 16,
    left: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 16,
    right: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 4,
  },
  instructionText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
});
