import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
    marginBottom: 4,
  },
  rackLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
    position: 'absolute',
    top: 30,
    zIndex: -1,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  footer: {
    width: 110,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
  retryText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
