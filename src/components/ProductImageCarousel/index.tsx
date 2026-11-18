import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Animated,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  View,
} from 'react-native';

import { Spacing } from '@/constants/Theme';
import { useTheme } from '@/hooks/UseTheme';

import { styles } from './styles';

type ProductImageCarouselProps = {
  images: (string | number)[];
};

const IMAGE_WIDTH_RATIO = 240 / 393;
const PREVIEW_OPACITY = 0.45;
const PREVIEW_SCALE = 0.86;
const MAX_PREVIEW_WIDTH = 32;

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const imageWidth = carouselWidth * IMAGE_WIDTH_RATIO;
  const sideInset = Math.max((carouselWidth - imageWidth) / 2, 0);
  const previewWidth = Math.min(MAX_PREVIEW_WIDTH, sideInset / 2);
  // Scaling pulls the preview's edge inward within its slot.
  const scaledImageInset = (imageWidth * (1 - PREVIEW_SCALE)) / 2;
  const imageGap = Math.max(Spacing.two, sideInset - previewWidth - scaledImageInset);
  const itemPitch = imageWidth + imageGap;
  const hasMultipleImages = images.length > 1;

  function updateActiveIndex(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / itemPitch);
    setActiveIndex(Math.min(Math.max(index, 0), images.length - 1));
  }

  if (images.length === 0) return null;

  return (
    <View
      testID="product-image-carousel"
      style={styles.container}
      onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)}
    >
      <Animated.ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: sideInset }}
        snapToInterval={itemPitch || undefined}
        decelerationRate="fast"
        disableIntervalMomentum
        scrollEnabled={hasMultipleImages}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={
          hasMultipleImages && imageWidth > 0
            ? Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: Platform.OS !== 'web',
                listener: updateActiveIndex,
              })
            : undefined
        }
      >
        {imageWidth > 0 &&
          images.map((image, index) => {
            const inputRange = [
              (index - 1) * itemPitch,
              index * itemPitch,
              (index + 1) * itemPitch,
            ];
            const previewStyle = hasMultipleImages && {
              opacity: scrollX.interpolate({
                inputRange,
                outputRange: [PREVIEW_OPACITY, 1, PREVIEW_OPACITY],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  scale: scrollX.interpolate({
                    inputRange,
                    outputRange: [PREVIEW_SCALE, 1, PREVIEW_SCALE],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            };

            return (
              <Animated.View
                key={`${image}-${index}`}
                style={[
                  styles.image,
                  { width: imageWidth },
                  index < images.length - 1 && { marginRight: imageGap },
                  previewStyle,
                ]}
              >
                <Image
                  source={typeof image === 'string' ? { uri: image } : image}
                  style={styles.imageContent}
                  contentFit="cover"
                  accessible
                  accessibilityLabel={`Foto ${index + 1} de ${images.length}`}
                />
              </Animated.View>
            );
          })}
      </Animated.ScrollView>

      {hasMultipleImages && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? theme.text : theme.backgroundSelected,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}
