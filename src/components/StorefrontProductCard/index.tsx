import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/Theme';
import { useWishlist } from '@/hooks/UseWishlist';
import type { CatalogItem } from '@/types/product';
import { formatPrice } from '@/utils/FormatPrice';

import { styles, CARD_WIDTH } from './styles';

export { CARD_WIDTH };

type StorefrontProductCardProps = {
  product: CatalogItem;
  onPress: () => void;
};

export function StorefrontProductCard({ product, onPress }: StorefrontProductCardProps) {
  const { toggle, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

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

        <Pressable
          onPress={() => toggle(product)}
          style={({ pressed }) => [
            styles.wishlistButton,
            wishlisted && styles.wishlistButtonActive,
            pressed && styles.wishlistButtonPressed,
          ]}
          hitSlop={4}
        >
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={18}
            color={wishlisted ? Colors.white : Colors.icon}
          />
        </Pressable>
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
