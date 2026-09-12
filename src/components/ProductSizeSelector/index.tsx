import { Pressable, Text, View } from 'react-native';

import type { Size } from '@/types/Product';

import { styles } from './styles';

type ProductSizeSelectorProps = {
  sizes: Size[];
  selectedSize: string | null;
  onSelectSize: (label: string | null) => void;
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
            onPress={() => onSelectSize(isSelected ? null : size.label)}
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
