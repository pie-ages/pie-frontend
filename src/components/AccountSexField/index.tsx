import { type ElementRef, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

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
  const [positioned, setPositioned] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const triggerRef = useRef<ElementRef<typeof View>>(null);

  const expanded = open && !disabled;
  const label = ACCOUNT_SEX_OPTIONS.find((option) => option.value === value)?.label ?? 'Selecione';

  const handleOpen = () => {
    setPositioned(false);
    setOpen(true);
    triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setDropdownTop(pageY + height);
      setDropdownLeft(pageX);
      setDropdownWidth(width);
      setPositioned(true);
    });
  };

  const handleClose = () => setOpen(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sexo</Text>

      <Pressable
        ref={triggerRef}
        accessibilityRole="combobox"
        accessibilityLabel={`Sexo: ${label}`}
        accessibilityState={{ expanded, disabled }}
        disabled={disabled}
        onPress={handleOpen}
        style={[styles.option, styles.trigger, disabled && styles.disabledOption]}
      >
        <Text style={styles.optionText}>{label}</Text>
        <Text style={styles.optionText}>{expanded ? '▴' : '▾'}</Text>
      </Pressable>

      <Modal visible={expanded} transparent animationType="none" onRequestClose={handleClose}>
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <View
            style={[
              styles.options,
              {
                top: dropdownTop,
                left: dropdownLeft,
                width: dropdownWidth,
                opacity: positioned ? 1 : 0,
              },
            ]}
          >
            {ACCOUNT_SEX_OPTIONS.map((option) => {
              const selected = value === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityLabel={option.label}
                  accessibilityState={{ checked: selected }}
                  onPress={() => {
                    handleClose();
                    onChange(option.value);
                  }}
                  style={[styles.option, selected && styles.selectedOption]}
                >
                  <Text style={[styles.optionText, selected && styles.selectedText]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
