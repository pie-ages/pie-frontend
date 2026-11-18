import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { InClosetBadge } from '@/components/InClosetBadge';
import { StoreLogo } from '@/components/StoreLogo';
import { Colors } from '@/constants/Theme';
import { useWishlist } from '@/contexts/WishlistContext';
import type { CatalogItem } from '@/schemas/productSchema';
import { formatColor } from '@/utils/format-color';
import { formatPrice } from '@/utils/format-price';

import { styles, CARD_WIDTH } from './styles';

export { CARD_WIDTH };

type StorefrontProductCardProps = {
  product: CatalogItem;
  onPress: () => void;
  isInCloset?: boolean;
};

export function StorefrontProductCard({
  product,
  onPress,
  isInCloset = false,
}: StorefrontProductCardProps) {
  const { toggle, isInWishlist, isPending, canChange } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const pending = isPending(product.id);

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

        {product.companyName || product.companyPhotoUrl ? (
          <StoreLogo
            companyName={product.companyName}
            logoUrl={product.companyPhotoUrl}
            style={styles.storeLogo}
          />
        ) : null}
        {isInCloset && <InClosetBadge style={styles.inClosetBadge} />}

        <Pressable
          onPress={() => toggle(product)}
          disabled={!canChange || pending}
          accessibilityRole="button"
          accessibilityLabel={`${wishlisted ? 'Remover' : 'Adicionar'} ${product.name} ${wishlisted ? 'da' : 'à'} Wishlist`}
          accessibilityState={{ disabled: !canChange || pending, busy: pending }}
          style={({ pressed }) => [
            styles.wishlistButton,
            wishlisted && styles.wishlistButtonActive,
            pressed && styles.wishlistButtonPressed,
          ]}
          hitSlop={4}
        >
          {pending ? (
            <ActivityIndicator
              size="small"
              color={wishlisted ? Colors.white : Colors.brand.primary}
            />
          ) : (
            <MaterialCommunityIcons
              name="heart"
              size={18}
              color={wishlisted ? Colors.white : Colors.icon}
            />
          )}
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        {product.color ? <Text style={styles.color}>{formatColor(product.color)}</Text> : null}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}
