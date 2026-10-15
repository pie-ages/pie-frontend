import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { LookFlipCard } from '@/components/LookFlipCard';
import {
  LOOK_EMPTY_CARD_ASPECT_RATIO,
  LOOK_PIECE_ASPECT_RATIO,
  LOOK_PIECE_GAP,
} from '@/components/LookPiecesStack/styles';
import { Spacing } from '@/constants/Theme';
import type { Look } from '@/types/Look';

import { styles } from './styles';

const CARD_WIDTH_RATIO = 0.67;
const CARD_GAP = Spacing.four;
const INACTIVE_OPACITY = 0.4;

function getMaxCardWidthForHeight(looks: Look[], maxHeight: number) {
  const maxPieces = Math.max(0, ...looks.map((look) => look.items.length));
  const emptyLimit = looks.some((look) => look.items.length === 0)
    ? maxHeight * LOOK_EMPTY_CARD_ASPECT_RATIO
    : Infinity;
  const piecesLimit =
    maxPieces > 0
      ? ((maxHeight - (maxPieces - 1) * LOOK_PIECE_GAP) * LOOK_PIECE_ASPECT_RATIO) / maxPieces
      : Infinity;
  return Math.max(Math.min(emptyLimit, piecesLimit), 0);
}

type LookFocusCarouselProps = {
  looks: Look[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onAddPhoto?: (lookId: string) => void;
  maxHeight: number;
};

export function LookFocusCarousel({
  looks,
  activeIndex,
  onChangeIndex,
  onAddPhoto,
  maxHeight,
}: LookFocusCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const programmaticTarget = useRef<number | null>(null);
  const hasPositioned = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const cardWidth =
    maxHeight > 0
      ? Math.min(carouselWidth * CARD_WIDTH_RATIO, getMaxCardWidthForHeight(looks, maxHeight))
      : 0;
  const itemPitch = cardWidth + CARD_GAP;
  const sideInset = Math.max((carouselWidth - cardWidth) / 2, 0);

  useEffect(() => {
    if (!itemPitch) return;
    if (hasPositioned.current && Math.round(scrollOffset.current / itemPitch) === activeIndex) {
      return;
    }

    const target = activeIndex * itemPitch;
    const shouldAnimate = hasPositioned.current;
    hasPositioned.current = true;
    if (Math.abs(scrollOffset.current - target) < 1) return;

    programmaticTarget.current = target;
    scrollRef.current?.scrollTo({ x: target, animated: shouldAnimate });
  }, [activeIndex, itemPitch]);

  useEffect(
    () => () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    },
    [],
  );

  function currentIndex(offsetX: number) {
    return Math.min(Math.max(Math.round(offsetX / itemPitch), 0), looks.length - 1);
  }

  function updateActiveIndex(offsetX: number) {
    if (!itemPitch) return;
    const index = currentIndex(offsetX);
    if (index !== activeIndex) onChangeIndex(index);
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!itemPitch) return;
    scrollOffset.current = event.nativeEvent.contentOffset.x;
    scrollX.setValue(scrollOffset.current);

    if (programmaticTarget.current !== null) {
      if (Math.abs(scrollOffset.current - programmaticTarget.current) < 1) {
        programmaticTarget.current = null;
      }
      return;
    }

    if (Platform.OS === 'web') {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => snapToNearest(scrollOffset.current), 120);
    }
  }

  function snapToNearest(offsetX: number) {
    if (!itemPitch) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    const index = currentIndex(offsetX);
    const target = index * itemPitch;
    if (index !== activeIndex) onChangeIndex(index);
    if (Math.abs(scrollOffset.current - target) < 1) return;
    programmaticTarget.current = target;
    scrollRef.current?.scrollTo({ x: target, animated: true });
  }

  return (
    <View
      style={styles.container}
      onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        contentContainerStyle={[styles.content, { paddingHorizontal: sideInset }]}
        snapToInterval={itemPitch || undefined}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onScrollBeginDrag={() => {
          programmaticTarget.current = null;
        }}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          if (Platform.OS === 'web') {
            snapToNearest(offsetX);
          } else {
            updateActiveIndex(offsetX);
          }
        }}
      >
        {cardWidth > 0 &&
          looks.map((look, index) => {
            const opacity = scrollX.interpolate({
              inputRange: [(index - 1) * itemPitch, index * itemPitch, (index + 1) * itemPitch],
              outputRange: [INACTIVE_OPACITY, 1, INACTIVE_OPACITY],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={look.id}
                style={[
                  { width: cardWidth, opacity },
                  index < looks.length - 1 && { marginRight: CARD_GAP },
                ]}
              >
                <LookFlipCard
                  look={look}
                  interactive={index === activeIndex}
                  onSelect={() => onChangeIndex(index)}
                  onAddPhoto={onAddPhoto}
                />
              </Animated.View>
            );
          })}
      </ScrollView>
    </View>
  );
}
