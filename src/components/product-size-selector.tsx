import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors } from '@/constants/theme';

type Size = {
  label: string;
  available: boolean;
};

type ProductSizeSelectorProps = {
  sizes: Size[];
  selectedSize: string | null;
  onSelectSize: (label: string) => void;
};

export function ProductSizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: ProductSizeSelectorProps) {
  return (
    <View style={styles.container}>
      {sizes.map((size) => {
        const isSelected = size.label === selectedSize;

        return (
          <Pressable
            key={size.label}
            disabled={!size.available}
            onPress={() => onSelectSize(size.label)}
            style={[
              styles.circle,
              isSelected && styles.circleSelected,
              !size.available && styles.circleUnavailable,
            ]}
          >
            <Text
              allowFontScaling={false}
              style={[
                styles.label,
                isSelected && styles.labelSelected,
                !size.available && styles.labelUnavailable,
              ]}
            >
              {size.label}
            </Text>

            {!size.available && (
              <View style={styles.strikeContainer} pointerEvents="none">
                <View style={styles.strikeLine} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
  },
  circle: {
    width: 32,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  circleSelected: {
    backgroundColor: BrandColors.primary,
  },
  circleUnavailable: {
    backgroundColor: `${BrandColors.disabled}29`,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  labelUnavailable: {
    color: '#000000',
  },
  strikeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikeLine: {
    width: 2,
    height: 26,
    borderRadius: 1,
    backgroundColor: '#1A1A1A',
    transform: [{ rotate: '55deg' }],
  },
});
