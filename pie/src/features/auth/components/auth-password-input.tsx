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
            name={{
              ios: isVisible ? 'eye.slash' : 'eye',
              android: isVisible ? 'visibility_off' : 'visibility',
              web: isVisible ? 'visibility_off' : 'visibility',
            }}
            size={22}
            tintColor="#777777"
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
