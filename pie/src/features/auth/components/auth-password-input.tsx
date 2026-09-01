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
            size={20}
            tintColor="#9B9B9B"
            fallback={
              <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color="#9B9B9B" />
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
