import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ProductHeader } from '@/components/ProductHeader';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductSizeSelector } from '@/components/ProductSizeSelector';
import { ThemedText } from '@/components/ThemedText';
import { useProductDetails } from '@/hooks/use-product-details';
import { useTheme } from '@/hooks/UseTheme';

import { styles } from './styles';

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
