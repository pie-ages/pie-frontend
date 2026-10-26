import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View, type LayoutRectangle, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
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
          backgroundColor: 'rgba(235, 235, 240, 0.65)',
        } as object)
      : undefined;

  return (
    <View {...props} style={[styles.wrapper, { bottom: insets.bottom + Spacing.one }]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.container, webStyle]}>{props.children}</View>
      ) : (
        <BlurView intensity={45} tint="light" style={styles.container}>
          {props.children}
        </BlurView>
      )}
    </View>
  );
}

type TabBarSpotlightProps = Pick<TabBarButtonProps, 'label' | 'icon' | 'iconSet'> & {
  index: number;
  tabCount: number;
};

const SPOTLIGHT_BORDER_WIDTH = 1;
const SPOTLIGHT_SLIDE = {
  duration: 300,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
};

export function TabBarSpotlight({ index, tabCount, ...button }: TabBarSpotlightProps) {
  const insets = useSafeAreaInsets();
  const [slots, setSlots] = useState<(LayoutRectangle | undefined)[]>([]);
  const hasPlaced = useRef(false);
  const translateX = useSharedValue(0);

  const slot = slots[index];

  useEffect(() => {
    if (!slot) return;

    const target = slot.x - SPOTLIGHT_BORDER_WIDTH;

    if (hasPlaced.current) {
      translateX.value = withTiming(target, SPOTLIGHT_SLIDE);
    } else {
      translateX.value = target;
      hasPlaced.current = true;
    }
  }, [slot, translateX]);

  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  return (
    <View pointerEvents="none" style={[styles.wrapper, { bottom: insets.bottom + Spacing.one }]}>
      <View style={[styles.container, styles.spotlightContainer]}>
        {slot && (
          <Animated.View
            style={[
              styles.spotlightPill,
              { top: slot.y - SPOTLIGHT_BORDER_WIDTH, width: slot.width, height: slot.height },
              pillStyle,
            ]}
          />
        )}

        {Array.from({ length: tabCount }, (_, i) => (
          <View
            key={i}
            style={styles.spotlightSlot}
            onLayout={({ nativeEvent }) =>
              setSlots((current) => {
                const next = [...current];
                next[i] = nativeEvent.layout;
                return next;
              })
            }
          >
            {i === index && (
              <Animated.View
                key={`${button.label}`}
                entering={FadeIn.duration(250).reduceMotion(ReduceMotion.System)}
                style={styles.spotlightContent}
              >
                <TabBarButton {...button} isFocused />
              </Animated.View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
