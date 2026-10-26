import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ProductHeader } from '@/components/ProductHeader';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductSizeSelector } from '@/components/ProductSizeSelector';
import { ThemedText } from '@/components/ThemedText';
import { BrandColors, Colors, Spacing } from '@/constants/Theme';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAddToWardrobe } from '@/hooks/UseAddToWardrobe';
import { useProductDetails } from '@/hooks/UseProductDetails';
import { useTheme } from '@/hooks/UseTheme';
import type { CatalogItem, ProductPublicDetail } from '@/schemas/productSchema';
import { isHttpUrl } from '@/utils/external-url';

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
  const { product, isLoading, error } = useProductDetails(id);
  const { toggle, isInWishlist } = useWishlist();
  const wardrobe = useAddToWardrobe(product);
  const [storeError, setStoreError] = useState<string | null>(null);

  function handleClose() {
    if (router.canGoBack()) {
      router.back();
    }
  }

  async function handleAddToWardrobe() {
    if (!product) return;

    const added = await wardrobe.add();
    if (!added) return;

    router.dismissTo({
      pathname: '/Storefront',
      params: { notice: `"${product.name}" foi adicionada ao seu closet!` },
    });
  }

  async function handleOpenStore() {
    if (!isHttpUrl(product?.purchaseUrl)) return;

    setStoreError(null);
    try {
      await WebBrowser.openBrowserAsync(product.purchaseUrl);
    } catch {
      setStoreError('Não foi possível abrir a loja parceira. Tente novamente.');
    }
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

  const canOpenStore = product.available && isHttpUrl(product.purchaseUrl);
  const storeName = product.companyName ?? 'parceira';

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
          <ProductImageCarousel images={product.imageUrl ? [product.imageUrl] : []} />
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

          {product.sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
                Tamanho
              </ThemedText>
              <ProductSizeSelector sizes={product.sizes} />
            </View>
          )}

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
            <ThemedText type="small" style={styles.storeValue} allowFontScaling={false}>
              {product.companyName ?? ''}
            </ThemedText>
          </View>

          {!product.available && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              Este produto não está mais disponível para compra.
            </ThemedText>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {(wardrobe.error ?? storeError) && (
          <ThemedText
            accessibilityRole="alert"
            type="small"
            style={[styles.feedback, styles.errorText]}
          >
            {wardrobe.error ?? storeError}
          </ThemedText>
        )}

        <ProductActionButton
          title={
            wardrobe.isInWardrobe
              ? 'Esta peça já está no seu closet'
              : 'Já tenho! Adicionar ao closet'
          }
          iconName={wardrobe.isInWardrobe ? 'check' : 'plus'}
          variant={wardrobe.isInWardrobe ? 'done' : 'primary'}
          isLoading={wardrobe.isChecking || wardrobe.isAdding}
          disabled={wardrobe.isInWardrobe}
          onPress={() => void handleAddToWardrobe()}
        />

        {canOpenStore && (
          <>
            <ProductActionButton
              title={`Comprar na loja ${storeName}`}
              iconName="external-link"
              variant="outline"
              onPress={() => void handleOpenStore()}
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.storeHint}>
              Você será direcionado para o site da loja parceira.
            </ThemedText>
          </>
        )}
      </View>
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
  feedback: {
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
  },
  storeHint: {
    textAlign: 'center',
  },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    paddingTop: Spacing.two,
  },
});
