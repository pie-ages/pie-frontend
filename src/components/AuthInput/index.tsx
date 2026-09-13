import type { ReactNode } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type AuthInputProps = TextInputProps & {
  label: string;
  rightElement?: ReactNode;
};

export function AuthInput({ label, rightElement, style, ...props }: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.placeholder}
          {...props}
        />

        {rightElement}
      </View>
    </View>
  );
}
