import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandColors, Colors } from '@/constants/Theme';
import { useWishlist } from '@/hooks/UseWishlist';
import { styles } from '@/styles/WishlistScreen';
import type { Product } from '@/types/product';
import { formatPrice } from '@/utils/FormatPrice';

export default function WishlistScreen() {
  const router = useRouter();
  const { items, remove } = useWishlist();

  function handleClose() {
    if (router.canGoBack()) router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton} hitSlop={8}>
          <Feather name="x" size={24} color={BrandColors.primary} />
        </Pressable>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.headerSpacer} />
      </View>

      {items.length === 0 ? (
        <EmptyState onExplore={handleClose} />
      ) : (
        <FlatList
          data={items.length % 2 !== 0 ? [...items, null] : items}
          numColumns={2}
          keyExtractor={(item, index) => item?.id ?? `placeholder-${index}`}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            item ? (
              <WishlistCard product={item} onRemove={() => remove(item.id)} />
            ) : (
              <View style={styles.cardPlaceholder} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={40}
          color={BrandColors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>Sua lista de desejos está vazia</Text>
      <Text style={styles.emptySubtitle}>
        Toque no ícone de prancheta nas peças da Vitrine para salvar seus itens favoritos aqui!
      </Text>
      <Pressable
        onPress={onExplore}
        style={({ pressed }) => [styles.exploreButton, pressed && styles.exploreButtonPressed]}
      >
        <Text style={styles.exploreButtonText}>Explorar Vitrine</Text>
      </Pressable>
    </View>
  );
}

function WishlistCard({ product, onRemove }: { product: Product; onRemove: () => void }) {
  async function handleViewInStore() {
    await WebBrowser.openBrowserAsync(product.purchaseUrl);
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardImageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.cardImage} contentFit="cover" />
        ) : (
          <View style={styles.cardImageFallback}>
            <Feather name="image" size={28} color={Colors.iconMuted} />
          </View>
        )}

        {!product.isAvailable && <View style={styles.unavailableOverlay} />}

        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
          hitSlop={4}
        >
          <Feather name="x" size={14} color={Colors.light.text} />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">
          {product.name}
        </Text>
        {product.color ? <Text style={styles.cardColor}>{product.color}</Text> : null}
        <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>

        {product.isAvailable ? (
          <Pressable
            onPress={handleViewInStore}
            style={({ pressed }) => [styles.storeButton, pressed && styles.storeButtonPressed]}
          >
            <Text style={styles.storeButtonText}>Ver na Loja</Text>
          </Pressable>
        ) : (
          <Text style={styles.unavailableLabel}>Indisponível</Text>
        )}
      </View>
    </View>
  );
}
