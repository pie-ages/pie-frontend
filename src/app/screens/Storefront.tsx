import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
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
import { useTaxonomy } from '@/hooks/UseTaxonomy';

export default function StorefrontScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [isSheetVisible, setSheetVisible] = useState(false);
  const { filterGroups } = useTaxonomy();
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
    catalogParams,
  } = useStorefrontFilters();
  const { status, products, retry } = useStorefrontCatalog(catalogParams);

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

  const isLoading = status === 'loading' || isSearchPending;

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top },
        Platform.OS === 'web' && { maxHeight: windowHeight, overflow: 'hidden' },
      ]}
    >
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
            groups={filterGroups}
            selectedIds={appliedFilterIds}
            onToggle={toggleAppliedFilter}
            onOpenSheet={handleOpenSheet}
          />
        </View>

        <View style={styles.body}>
          {isLoading && <StorefrontLoadingState />}
          {!isLoading && status === 'error' && <StorefrontErrorState onRetry={retry} />}
          {!isLoading && status === 'empty' && <StorefrontEmptyState />}
          {!isLoading && status === 'success' && (
            <StorefrontProductGrid
              products={products}
              onProductPress={handleStoreFrontPress}
              contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
            />
          )}
        </View>
      </View>

      <StorefrontFilterSheet
        visible={isSheetVisible}
        groups={filterGroups}
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
    minHeight: 0,
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
    minHeight: 0,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
});
