import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { Colors } from '@/constants/Theme';

import { styles } from './styles';

type AuthButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
};

export function AuthButton({
  title,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        state.pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.brand.primary} />
      ) : (
        <Text
          style={[styles.text, variant === 'primary' ? styles.primaryText : styles.secondaryText]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
