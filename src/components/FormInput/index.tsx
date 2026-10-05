import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

import { styles } from './styles';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...rest }: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#D1D5DB" {...rest} />
    </View>
  );
}
