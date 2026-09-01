import Feather from '@expo/vector-icons/Feather';
import { SymbolView } from 'expo-symbols';
import {
    Pressable,
    StyleSheet,
    type TextInputProps,
} from 'react-native';

import { AuthInput } from '@/features/auth/components/auth-input';

type AuthPasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  label: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
};

export function AuthPasswordInput({
  label,
  isVisible,
  onToggleVisibility,
  ...props
}: AuthPasswordInputProps) {
  return (
    <AuthInput
      label={label}
      secureTextEntry={!isVisible}
      {...props}
      rightElement={
        <Pressable
          onPress={onToggleVisibility}
          style={styles.visibilityButton}
          accessibilityRole="button"
          accessibilityLabel={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <SymbolView
            name={isVisible ? 'eye.slash' : 'eye'}
            size={22}
            tintColor="#777777"
            fallback={
              <Feather name={isVisible ? 'eye-off' : 'eye'} size={22} color="#777777" />
            }
          />
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  visibilityButton: {
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
