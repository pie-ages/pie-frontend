import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/FormatPrice';

import { styles, CARD_WIDTH } from './styles';

export { CARD_WIDTH };

type StorefrontProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function StorefrontProductCard({ product, onPress }: StorefrontProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Feather name="image" size={28} color="#B0B4BA" />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        {product.color ? <Text style={styles.color}>{product.color}</Text> : null}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}
