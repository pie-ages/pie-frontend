import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Colors } from '@/constants/Theme';

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
        <ActivityIndicator color={Colors.white} />
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

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.brand.primary,
  },
  secondary: {
    backgroundColor: Colors.brand.tertiary,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.brand.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});
