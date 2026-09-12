import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StorefrontEmptyState } from '@/components/StorefrontEmptyState';
import { StorefrontErrorState } from '@/components/StorefrontErrorState';
import { StorefrontFilterChips } from '@/components/StorefrontFilterChips';
import { StorefrontLoadingState } from '@/components/StorefrontLoadingState';
import { StorefrontProductGrid } from '@/components/StorefrontProductGrid';
import { StorefrontSearchBar } from '@/components/StorefrontSearchBar';
import { StorefrontToolBar } from '@/components/StorefrontToolBar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/Theme';
import { useStorefrontCatalog } from '@/hooks/UseStorefrontCatalog';

export default function StorefrontScreen() {
  const insets = useSafeAreaInsets();
  const { status, products, retry } = useStorefrontCatalog();

  const handleStoreFrontPress = (productId: string) => {
    try {
      router.push({
        pathname: '/screens/ProductDetails',
        params: { productId },
      });
    } catch (error) {
      console.error('Erro ao navegar para detalhes do produto:', error);
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <StorefrontToolBar />
          <StorefrontSearchBar />
          <StorefrontFilterChips />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <StorefrontLoadingState />}
          {status === 'error' && <StorefrontErrorState onRetry={retry} />}
          {status === 'empty' && <StorefrontEmptyState />}
          {status === 'success' && (
            <StorefrontProductGrid
              products={products}
              onProductPress={handleStoreFrontPress}
              contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  header: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  body: {
    flex: 1,
  },
});
