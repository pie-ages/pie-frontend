import { StyleSheet } from 'react-native';

const HANGER_COLOR = '#E5E7EB';

export const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: 16,
    alignItems: 'center',
  },
  hanger: {
    height: 12,
    width: 14,
    alignItems: 'center',
  },
  hangerHook: {
    position: 'absolute',
    top: 0,
    left: 1,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderColor: HANGER_COLOR,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 4,
  },
  hangerStem: {
    position: 'absolute',
    top: 5,
    bottom: 0,
    width: 2,
    backgroundColor: HANGER_COLOR,
  },
  imageContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loader: {
    position: 'absolute',
  },
  removeButton: {
    position: 'absolute',
    top: 18,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#661414',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonPressed: {
    opacity: 0.7,
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});
