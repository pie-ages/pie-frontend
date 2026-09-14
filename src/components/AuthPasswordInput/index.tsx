import Feather from '@expo/vector-icons/Feather';
import { SymbolView } from 'expo-symbols';
import { Pressable, type TextInputProps } from 'react-native';

import { AuthInput } from '@/components/AuthInput';
import { Colors } from '@/constants/Theme';

import { styles } from './styles';

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
            tintColor={Colors.icon}
            fallback={
              <Feather name={isVisible ? 'eye-off' : 'eye'} size={20} color={Colors.icon} />
            }
          />
        </Pressable>
      }
    />
  );
}
