import { useEffect, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { LookPiecesStack } from '@/components/LookPiecesStack';
import { Spacing } from '@/constants/Theme';
import type { Look } from '@/types/look';

import { styles } from './styles';

const CARD_WIDTH_RATIO = 0.67;
const CARD_GAP = Spacing.four;
const EMPTY_CARD_ASPECT_RATIO = 0.65;
const PIECE_ASPECT_RATIO = 1.45;
const PIECE_GAP = 6;

// Maior largura em que o card mais alto ainda cabe em maxHeight, evitando scroll vertical.
function getMaxCardWidthForHeight(looks: Look[], maxHeight: number) {
  const maxPieces = Math.max(0, ...looks.map((look) => look.items.length));
  const emptyLimit = looks.some((look) => look.items.length === 0)
    ? maxHeight * EMPTY_CARD_ASPECT_RATIO
    : Infinity;
  const piecesLimit =
    maxPieces > 0
      ? ((maxHeight - (maxPieces - 1) * PIECE_GAP) * PIECE_ASPECT_RATIO) / maxPieces
      : Infinity;
  return Math.max(Math.min(emptyLimit, piecesLimit), 0);
}

type LookFocusCarouselProps = {
  looks: Look[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  maxHeight: number;
};

export function LookFocusCarousel({
  looks,
  activeIndex,
  onChangeIndex,
  maxHeight,
}: LookFocusCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);
  const programmaticTarget = useRef<number | null>(null);
  const hasPositioned = useRef(false);
  const [carouselWidth, setCarouselWidth] = useState(0);

  const cardWidth =
    maxHeight > 0
      ? Math.min(carouselWidth * CARD_WIDTH_RATIO, getMaxCardWidthForHeight(looks, maxHeight))
      : 0;
  const itemPitch = cardWidth + CARD_GAP;
  const sideInset = Math.max((carouselWidth - cardWidth) / 2, 0);

  // Sincroniza o scroll quando o look ativo muda por fora do gesto (toque no vizinho ou lookId inicial).
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

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!itemPitch) return;
    scrollOffset.current = event.nativeEvent.contentOffset.x;

    if (programmaticTarget.current !== null) {
      if (Math.abs(scrollOffset.current - programmaticTarget.current) < 1) {
        programmaticTarget.current = null;
      }
      return;
    }

    const index = Math.min(
      Math.max(Math.round(scrollOffset.current / itemPitch), 0),
      looks.length - 1,
    );
    if (index !== activeIndex) onChangeIndex(index);
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
      >
        {cardWidth > 0 &&
          looks.map((look, index) => {
            const isActive = index === activeIndex;

            return (
              <Pressable
                key={look.id}
                disabled={isActive}
                onPress={() => onChangeIndex(index)}
                accessibilityRole="button"
                accessibilityLabel={isActive ? look.name : `Ver ${look.name}`}
                style={[
                  { width: cardWidth },
                  index < looks.length - 1 && { marginRight: CARD_GAP },
                ]}
              >
                <LookPiecesStack look={look} />
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
}
