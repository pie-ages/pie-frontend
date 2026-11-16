import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TabTriggerSlotProps } from 'expo-router/ui';
import { createContext, forwardRef, useContext, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  View,
  type LayoutChangeEvent,
  type LayoutRectangle,
  type PressableInstance,
  type ViewProps,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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

type ActivePillContextValue = {
  reportActiveSlot: (label: string, layout: LayoutRectangle) => void;
  hasAnimatedPill: boolean;
};

const ActivePillContext = createContext<ActivePillContextValue>({
  reportActiveSlot: () => {},
  hasAnimatedPill: false,
});

export const TabBarButton = forwardRef<PressableInstance, TabBarButtonProps>(function TabBarButton(
  { label, icon, iconSet = 'feather', isFocused, onLayout, ...props },
  ref,
) {
  const { reportActiveSlot, hasAnimatedPill } = useContext(ActivePillContext);
  const layoutRef = useRef<LayoutRectangle | null>(null);
  const scale = useSharedValue(isFocused ? 1 : 0.94);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.94, {
      damping: 18,
      stiffness: 220,
      reduceMotion: ReduceMotion.System,
    });
    if (isFocused && layoutRef.current) {
      reportActiveSlot(label, layoutRef.current);
    }
  }, [isFocused, label, reportActiveSlot, scale]);

  const handleLayout = (event: LayoutChangeEvent) => {
    layoutRef.current = event.nativeEvent.layout;
    if (isFocused) {
      reportActiveSlot(label, event.nativeEvent.layout);
    }
    onLayout?.(event);
  };

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isFocused ? Colors.brand.primary : Colors.icon;

  return (
    <Pressable
      ref={ref}
      {...props}
      onLayout={handleLayout}
      style={({ pressed }) => [
        styles.button,
        isFocused && !hasAnimatedPill && styles.buttonActive,
        pressed && styles.pressed,
      ]}
    >
      <Animated.View style={[styles.buttonInner, iconAnimatedStyle]}>
        {iconSet === 'ionicons' && <Ionicons name={icon as never} size={26} color={color} />}
        {iconSet === 'material-community' && (
          <MaterialCommunityIcons name={icon as never} size={26} color={color} />
        )}
        {iconSet === 'feather' && <Feather name={icon as never} size={26} color={color} />}

        <ThemedText type="small" style={[styles.label, { color }]}>
          {label}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
});

const PILL_BORDER_OFFSET = 1;

export function BottomTabBar(props: ViewProps) {
  const insets = useSafeAreaInsets();
  const [activeLayout, setActiveLayout] = useState<LayoutRectangle | null>(null);
  const hasPlaced = useRef(false);
  const translateX = useSharedValue(0);
  const pillWidth = useSharedValue(0);

  const reportActiveSlot = (label: string, layout: LayoutRectangle) => {
    setActiveLayout((prev) => {
      if (
        prev &&
        Math.abs(prev.x - layout.x) < 0.5 &&
        Math.abs(prev.width - layout.width) < 0.5 &&
        Math.abs(prev.height - layout.height) < 0.5
      ) {
        return prev;
      }
      return layout;
    });
  };

  useEffect(() => {
    if (!activeLayout) return;
    const targetX = activeLayout.x - PILL_BORDER_OFFSET;
    if (hasPlaced.current) {
      translateX.value = withTiming(targetX, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      });
      pillWidth.value = withTiming(activeLayout.width, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
        reduceMotion: ReduceMotion.System,
      });
    } else {
      translateX.value = targetX;
      pillWidth.value = activeLayout.width;
      hasPlaced.current = true;
    }
  }, [activeLayout, pillWidth, translateX]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    width: pillWidth.value,
    transform: [{ translateX: translateX.value }],
  }));

  const webStyle =
    Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(235, 235, 240, 0.65)',
        } as object)
      : undefined;

  const pillNode = activeLayout ? (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.activePill,
        {
          top: activeLayout.y - PILL_BORDER_OFFSET,
          height: activeLayout.height,
        },
        pillAnimatedStyle,
      ]}
    />
  ) : null;

  return (
    <ActivePillContext.Provider
      value={{ reportActiveSlot, hasAnimatedPill: Boolean(activeLayout) }}
    >
      <View {...props} style={[styles.wrapper, { bottom: insets.bottom + Spacing.one }]}>
        {Platform.OS === 'web' ? (
          <View style={[styles.container, webStyle]}>
            {pillNode}
            {props.children}
          </View>
        ) : (
          <BlurView intensity={45} tint="light" style={styles.container}>
            {pillNode}
            {props.children}
          </BlurView>
        )}
      </View>
    </ActivePillContext.Provider>
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
