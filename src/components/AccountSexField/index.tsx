import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ACCOUNT_SEX_OPTIONS, type AccountSexChoice } from '@/constants/AccountSex';

import { styles } from './styles';

interface AccountSexFieldProps {
  value: AccountSexChoice;
  onChange: (value: AccountSexChoice) => void;
  disabled?: boolean;
  error?: string;
}

export function AccountSexField({
  value,
  onChange,
  disabled = false,
  error,
}: AccountSexFieldProps) {
  const [open, setOpen] = useState(false);
  const expanded = open && !disabled;
  const label = ACCOUNT_SEX_OPTIONS.find((option) => option.value === value)?.label ?? 'Selecione';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sexo</Text>

      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={`Sexo: ${label}`}
        accessibilityState={{ expanded, disabled }}
        disabled={disabled}
        onPress={() => setOpen(!open)}
        style={[styles.option, styles.trigger, disabled && styles.disabledOption]}
      >
        <Text style={styles.optionText}>{label}</Text>
        <Text style={styles.optionText}>{expanded ? '▴' : '▾'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.options}>
          {ACCOUNT_SEX_OPTIONS.map((option) => {
            const selected = value === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ checked: selected, disabled }}
                disabled={disabled}
                onPress={() => {
                  setOpen(false);
                  onChange(option.value);
                }}
                style={[
                  styles.option,
                  selected && styles.selectedOption,
                  disabled && styles.disabledOption,
                ]}
              >
                <Text style={[styles.optionText, selected && styles.selectedText]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
