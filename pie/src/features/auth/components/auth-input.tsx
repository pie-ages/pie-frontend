import type { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type AuthInputProps = TextInputProps & {
  label: string;
  rightElement?: ReactNode;
};

export function AuthInput({
  label,
  rightElement,
  style,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#B3B3B3"
          {...props}
        />

        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1F1F',
  },
  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F1F1F',
  },
});