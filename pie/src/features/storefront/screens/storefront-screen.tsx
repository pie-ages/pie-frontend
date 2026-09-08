import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StorefrontEmptyState } from '@/features/storefront/components/storefront-empty-state';
import { StorefrontErrorState } from '@/features/storefront/components/storefront-error-state';
import { StorefrontFilterChips } from '@/features/storefront/components/storefront-filter-chips';
import { StorefrontHeader } from '@/features/storefront/components/storefront-header';
import { StorefrontLoadingState } from '@/features/storefront/components/storefront-loading-state';
import { StorefrontProductGrid } from '@/features/storefront/components/storefront-product-grid';
import { StorefrontSearchBar } from '@/features/storefront/components/storefront-search-bar';
import { useStorefrontCatalog } from '@/features/storefront/hooks/use-storefront-catalog';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export function StorefrontScreen() {
  const insets = useSafeAreaInsets();
  const { status, products, retry } = useStorefrontCatalog();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <StorefrontHeader />
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
