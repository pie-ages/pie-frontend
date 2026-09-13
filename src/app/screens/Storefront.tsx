import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StorefrontEmptyState } from '@/components/StorefrontEmptyState';
import { StorefrontErrorState } from '@/components/StorefrontErrorState';
import { StorefrontFilterChips } from '@/components/StorefrontFilterChips';
import { StorefrontFilterSheet } from '@/components/StorefrontFilterSheet';
import { StorefrontLoadingState } from '@/components/StorefrontLoadingState';
import { StorefrontProductGrid } from '@/components/StorefrontProductGrid';
import { StorefrontSearchBar } from '@/components/StorefrontSearchBar';
import { StorefrontToolBar } from '@/components/StorefrontToolBar';
import { BottomTabInset, Spacing } from '@/constants/Theme';
import { useStorefrontCatalog } from '@/hooks/UseStorefrontCatalog';
import { useStorefrontFilters } from '@/hooks/UseStorefrontFilters';
import { MOCK_FILTER_GROUPS } from '@/mocks/products';

export default function StorefrontScreen() {
  const insets = useSafeAreaInsets();
  const { status, products, retry } = useStorefrontCatalog();
  const [isSheetVisible, setSheetVisible] = useState(false);
  const {
    searchInput,
    setSearchInput,
    isSearchPending,
    appliedFilterIds,
    pendingFiltersByGroup,
    openSheetDraft,
    togglePendingFilter,
    toggleAppliedFilter,
    applyPendingFilters,
    clearAllFilters,
    clearSearch,
    filterProducts,
  } = useStorefrontFilters();

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

  const handleOpenSheet = () => {
    openSheetDraft();
    setSheetVisible(true);
  };

  const handleApplySheet = () => {
    applyPendingFilters();
    setSheetVisible(false);
  };

  const visibleProducts = useMemo(() => filterProducts(products), [filterProducts, products]);
  const hasNoResults = status === 'success' && visibleProducts.length === 0;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.paddedHeader}>
            <StorefrontToolBar />
            <StorefrontSearchBar
              value={searchInput}
              onChangeText={setSearchInput}
              onClear={clearSearch}
            />
          </View>
          <StorefrontFilterChips
            groups={MOCK_FILTER_GROUPS}
            selectedIds={appliedFilterIds}
            onToggle={toggleAppliedFilter}
            onOpenSheet={handleOpenSheet}
          />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <StorefrontLoadingState />}
          {status === 'error' && <StorefrontErrorState onRetry={retry} />}
          {status === 'empty' && <StorefrontEmptyState />}
          {isSearchPending && status === 'success' && <StorefrontLoadingState />}
          {!isSearchPending && hasNoResults && <StorefrontEmptyState />}
          {!isSearchPending && status === 'success' && !hasNoResults && (
            <StorefrontProductGrid
              products={visibleProducts}
              onProductPress={handleStoreFrontPress}
              contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
            />
          )}
        </View>
      </View>

      <StorefrontFilterSheet
        visible={isSheetVisible}
        groups={MOCK_FILTER_GROUPS}
        pendingFiltersByGroup={pendingFiltersByGroup}
        onTogglePending={togglePendingFilter}
        onApply={handleApplySheet}
        onClear={clearAllFilters}
        onClose={() => setSheetVisible(false)}
      />
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
  },
  header: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  paddedHeader: {
    gap: 16,
    paddingHorizontal: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
