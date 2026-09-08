import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/product-action-button';
import { ProductHeader } from '@/components/product-header';
import { ProductImageCarousel } from '@/components/product-image-carousel';
import { ProductSizeSelector } from '@/components/product-size-selector';
import { ThemedText } from '@/components/themed-text';
import { BrandColors, Spacing } from '@/constants/theme';
import { useProductDetails } from '@/features/auth/hooks/use-product-details';
import { useTheme } from '@/hooks/use-theme';

type ProductDetailsScreenProps = {
  id?: string;
};

export function ProductDetailsScreen({ id }: ProductDetailsScreenProps) {
  const router = useRouter();
  const theme = useTheme();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { product, isLoading, error } = useProductDetails(id);

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
      <ProductHeader title={product.name} onClose={handleClose} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <ProductImageCarousel images={product.images} />
        </View>

        <View style={styles.sectionsWrapper}>
          <View style={styles.descriptionSection}>
            <ThemedText type="smallBold" style={styles.sectionLabel} allowFontScaling={false}>
              Descrição
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
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
                {product.storeName}
              </ThemedText>
            </Pressable>
          </View>

          {!product.isAvailable && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              Este produto não está mais disponível para compra.
            </ThemedText>
          )}
        </View>
      </ScrollView>

      {product.isAvailable && (
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
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
  imageWrapper: {
    marginBottom: 48,
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
