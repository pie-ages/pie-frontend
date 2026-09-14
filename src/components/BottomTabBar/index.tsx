import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Platform, Pressable, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';

import { styles } from './styles';

type IconSet = 'feather' | 'ionicons' | 'material-community';

type TabBarButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: string;
  iconSet?: IconSet;
};

export const TabBarButton = forwardRef<View, TabBarButtonProps>(function TabBarButton(
  { label, icon, iconSet = 'feather', isFocused, ...props },
  ref,
) {
  const color = isFocused ? Colors.brand.primary : Colors.icon;

  return (
    <Pressable
      ref={ref}
      {...props}
      style={({ pressed }) => [
        styles.button,
        isFocused && styles.buttonActive,
        pressed && styles.pressed,
      ]}
    >
      {iconSet === 'ionicons' && <Ionicons name={icon as never} size={26} color={color} />}
      {iconSet === 'material-community' && (
        <MaterialCommunityIcons name={icon as never} size={26} color={color} />
      )}
      {iconSet === 'feather' && <Feather name={icon as never} size={26} color={color} />}

      <ThemedText type="small" style={[styles.label, { color }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
});

export function BottomTabBar(props: ViewProps) {
  const insets = useSafeAreaInsets();

  const webStyle =
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.55)',
        } as object)
      : undefined;

  return (
    <View {...props} style={[styles.wrapper, { bottom: insets.bottom + Spacing.one }]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.container, webStyle]}>{props.children}</View>
      ) : (
        <BlurView intensity={70} tint="light" style={styles.container}>
          {props.children}
        </BlurView>
      )}
    </View>
  );
}
