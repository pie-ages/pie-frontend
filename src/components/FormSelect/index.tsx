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
}

export function FormSelect({ label, value, placeholder, onPress, disabled }: FormSelectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.inputBox}
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[styles.text, !value && styles.placeholderText]}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}
