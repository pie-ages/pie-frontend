import { Text, View } from 'react-native';

import { styles } from './styles';

type ProductSizeSelectorProps = {
  sizes: string[];
};

export function ProductSizeSelector({ sizes }: ProductSizeSelectorProps) {
  return (
    <View style={styles.container}>
      {sizes.map((size) => (
        <View key={size} style={styles.circle}>
          <Text allowFontScaling={false} style={styles.label}>
            {size === 'Único' ? 'U' : size}
          </Text>
        </View>
      ))}
    </View>
  );
}
