import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});
