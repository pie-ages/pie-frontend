import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
