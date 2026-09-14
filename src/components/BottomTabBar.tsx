import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { Colors, MaxContentWidth, Spacing } from '@/constants/Theme';

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

  return (
    <View {...props} style={[styles.wrapper, { bottom: insets.bottom + Spacing.one }]}>
      <View style={styles.container}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    width: '92%',
    maxWidth: MaxContentWidth,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
  },
  buttonActive: {
    backgroundColor: 'rgba(224, 225, 230, 0.55)',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
  },
});
