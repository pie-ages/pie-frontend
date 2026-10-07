import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { styles } from './styles';

interface FormSelectProps {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  error?: string;
}

export function FormSelect({
  label,
  value,
  placeholder,
  onPress,
  disabled,
  error,
}: FormSelectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.inputBox, error ? styles.inputError : null]}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[styles.text, !value && styles.placeholderText]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
