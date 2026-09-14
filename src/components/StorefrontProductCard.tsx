import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors, Colors } from '@/constants/Theme';
import { useWishlist } from '@/hooks/UseWishlist';
import type { Product } from '@/types/Product';
import { formatPrice } from '@/utils/FormatPrice';

type StorefrontProductCardProps = {
  product: Product;
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

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButtonActive: {
    backgroundColor: BrandColors.primary,
  },
  wishlistButtonPressed: {
    opacity: 0.7,
  },
  storeLogo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  info: {
    paddingTop: 10,
    gap: 4,
    backgroundColor: '#F3F3F3',
    paddingBottom: 10,
  },
  name: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  color: {
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#3C3C43',
    opacity: 0.6,
  },
  price: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#3C3C43',
    opacity: 0.6,
  },
});
