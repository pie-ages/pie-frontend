import { Image } from 'expo-image';
import { useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProductImageCarouselProps = {
  images: (string | number)[];
};

const IMAGE_WIDTH_RATIO = 206 / 393;
const IMAGE_GAP = Spacing.five;

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const imageWidth = carouselWidth * IMAGE_WIDTH_RATIO;
  const itemPitch = imageWidth + IMAGE_GAP;
  const sideInset = Math.max((carouselWidth - imageWidth) / 2, 0);

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!itemPitch) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / itemPitch);
    setActiveIndex(index);
  }

  return (
    <View style={styles.container} onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal: sideInset }}
        snapToInterval={itemPitch || undefined}
        decelerationRate="fast"
        scrollEnabled={images.length > 1}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {images.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            source={typeof image === 'string' ? { uri: image } : image}
            style={[
              styles.image,
              { width: imageWidth || undefined },
              index < images.length - 1 && { marginRight: IMAGE_GAP },
            ]}
            contentFit="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex ? theme.text : theme.backgroundSelected,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
