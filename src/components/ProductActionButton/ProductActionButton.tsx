import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { styles } from './styles';

type ProductActionButtonProps = PressableProps & {
  title: string;
  isLoading?: boolean;
};

export function ProductActionButton({
  title,
  isLoading = false,
  disabled,
  style,
  ...props
}: ProductActionButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        state.pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}
