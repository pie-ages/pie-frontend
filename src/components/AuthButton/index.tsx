import { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

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
  onPressIn,
  onPressOut,
  ...props
}: AuthButtonProps) {
  const isDisabled = disabled || isLoading;
  const reduceMotion = useReducedMotion();
  const [pressScale] = useState(() => new Animated.Value(1));

  function handlePressIn(event: GestureResponderEvent) {
    if (!isDisabled) {
      if (reduceMotion) {
        pressScale.setValue(1);
      } else {
        Animated.spring(pressScale, {
          toValue: 0.98,
          speed: 30,
          bounciness: 0,
          useNativeDriver: true,
        }).start();
      }
    }
    onPressIn?.(event);
  }

  function handlePressOut(event: GestureResponderEvent) {
    if (reduceMotion) {
      pressScale.setValue(1);
    } else {
      Animated.spring(pressScale, {
        toValue: 1,
        speed: 30,
        bounciness: 0,
        useNativeDriver: true,
      }).start();
    }
    onPressOut?.(event);
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pressScale }] }]}>
      <Pressable
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    </Animated.View>
  );
}
