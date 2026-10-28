import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { BrandColors } from '@/constants/Theme';

import { styles } from './styles';

type ProductActionButtonVariant = 'primary' | 'outline' | 'done';

type ProductActionButtonProps = PressableProps & {
  title: string;
  isLoading?: boolean;
  variant?: ProductActionButtonVariant;
  iconName?: keyof typeof Feather.glyphMap;
};

export function ProductActionButton({
  title,
  isLoading = false,
  variant = 'primary',
  iconName,
  disabled,
  style,
  ...props
}: ProductActionButtonProps) {
  const isDisabled = disabled || isLoading;
  const isPrimary = variant === 'primary';
  const contentColor = isPrimary ? '#FFFFFF' : BrandColors.primary;

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={(state) => [
        styles.button,
        variant === 'outline' && styles.outline,
        variant === 'done' && styles.done,
        state.pressed && !isDisabled && styles.pressed,
        isDisabled && variant !== 'done' && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <>
          {iconName ? <Feather name={iconName} size={18} color={contentColor} /> : null}
          <Text style={[styles.text, { color: contentColor }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
