import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatPrice } from '@/features/vitrine/utils/format-price';
import type { Product } from '@/features/vitrine/types/product';

type VitrineProductCardProps = {
  product: Product;
};

export function VitrineProductCard({ product }: VitrineProductCardProps) {
  function handlePress() {
    Linking.openURL(product.purchaseUrl).catch(() => {
      // Falha silenciosa: sem tratamento de erro de navegação externa nesta task.
    });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Feather name="image" size={28} color="#B0B4BA" />
          </View>
        )}

        <Image source={{ uri: product.store.logoUrl }} style={styles.storeLogo} contentFit="cover" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#F0F0F3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 8,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
  },
});
