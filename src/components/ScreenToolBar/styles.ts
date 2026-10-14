import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flexShrink: 1,
    fontSize: 30,
    fontWeight: '700',
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileButton: {
    backgroundColor: Colors.brand.tertiary,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
});
