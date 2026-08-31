import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';

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
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary'
              ? styles.primaryText
              : styles.secondaryText,
          ]}
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
    backgroundColor: '#6E263D',
  },
  secondary: {
    backgroundColor: '#F3EBEE',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#6E263D',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});