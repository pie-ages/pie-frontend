import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ProductHeader } from '@/components/ProductHeader';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductSizeSelector } from '@/components/ProductSizeSelector';
import { ThemedText } from '@/components/ThemedText';
import { BrandColors, Spacing } from '@/constants/Theme';
import { useProductDetails } from '@/hooks/use-product-details';
import { useTheme } from '@/hooks/UseTheme';
import { useWishlist } from '@/hooks/UseWishlist';
import type { CatalogItem, ProductPublicDetail } from '@/types/product';

function toWishlistItem(detail: ProductPublicDetail): CatalogItem {
  return {
    id: detail.id,
    name: detail.name,
    category: detail.category,
    color: detail.color,
    price: detail.price,
    imageUrl: detail.imageUrl,
    purchaseUrl: detail.purchaseUrl,
    companyName: detail.companyName,
    status: detail.available ? 'PUBLISHED' : 'PAUSED',
    styles: detail.styles,
    sizes: detail.sizes,
    materials: detail.materials,
  };
}

export default function ProductDetailsScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return <ProductDetails id={productId} />;
}

function ProductDetails({ id }: { id?: string }) {
  const router = useRouter();
  const theme = useTheme();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loadedProductId, setLoadedProductId] = useState<string | undefined>(undefined);
  const { product, isLoading, error } = useProductDetails(id);
  const { toggle, isInWishlist } = useWishlist();

  if (product && product.id !== loadedProductId) {
    setLoadedProductId(product.id);
    setSelectedSize(product.sizes[0] ?? null);
  }

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  async function handlePurchase() {
    if (!product) return;
    await WebBrowser.openBrowserAsync(product.purchaseUrl);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <ProductHeader title="" onClose={handleClose} />
        <View style={styles.centered}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            {error ?? 'Não foi possível carregar este produto.'}
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ProductHeader
        title={product.name}
        onClose={handleClose}
        isWishlisted={isInWishlist(product.id)}
        onToggleWishlist={() => toggle(toWishlistItem(product))}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <ProductImageCarousel images={product.images.map((img) => img.url)} />
        </View>

        <View style={styles.sectionsWrapper}>
          <View style={styles.descriptionSection}>
            <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
              Descrição
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="text"
              style={styles.descriptionText}
              allowFontScaling={false}
            >
              {product.description}
            </ThemedText>
          </View>

          <View style={styles.sizeSection}>
            <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
              Tamanho
            </ThemedText>
            <ProductSizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />
          </View>

          <View style={styles.row}>
            <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
              Preço
            </ThemedText>
            <ThemedText type="default" style={styles.priceValue} allowFontScaling={false}>
              {formattedPrice}
            </ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
              Loja
            </ThemedText>
            <Pressable onPress={handlePurchase}>
              <ThemedText type="small" style={styles.storeValue} allowFontScaling={false}>
                {product.companyName ?? ''}
              </ThemedText>
            </Pressable>
          </View>

          {!product.available && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              Este produto não está mais disponível para compra.
            </ThemedText>
          )}
        </View>
      </ScrollView>

      {product.available && (
        <View style={styles.footer}>
          <ProductActionButton title="Já tenho! Adicionar ao closet" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.half,
    paddingBottom: Spacing.six,
  },
  imageWrapper: {
    marginBottom: 44,
  },
  sectionsWrapper: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  descriptionSection: {
    gap: Spacing.one,
  },
  sizeSection: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 17,
    lineHeight: 17,
  },
  descriptionText: {
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '400',
  },
  priceValue: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '700',
  },
  storeValue: {
    color: BrandColors.primary,
    fontSize: 17,
    lineHeight: 17,
    fontWeight: '700',
  },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
  },
});
