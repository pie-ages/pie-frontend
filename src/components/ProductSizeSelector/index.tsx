import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

type ProductSizeSelectorProps = {
  sizes: string[];
  selectedSize: string | null;
  onSelectSize: (size: string | null) => void;
};

export function ProductSizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: ProductSizeSelectorProps) {
  return (
    <View style={styles.container}>
      {sizes.map((size) => {
        const isSelected = size === selectedSize;

        return (
          <Pressable
            key={size}
            onPress={() => onSelectSize(isSelected ? null : size)}
            style={[styles.circle, isSelected && styles.circleSelected]}
          >
            <Text
              allowFontScaling={false}
              style={[styles.label, isSelected && styles.labelSelected]}
            >
              {size === 'Único' ? 'U' : size}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
