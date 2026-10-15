import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: 16,
    alignItems: 'center',
  },
  hangerHook: {
    width: 2,
    height: 12,
    backgroundColor: '#E5E7EB',
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
  name: {
    marginTop: 8,
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});
