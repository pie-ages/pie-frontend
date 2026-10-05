import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { StorefrontFilterChips } from '@/components/StorefrontFilterChips';
import { StorefrontFilterSheet } from '@/components/StorefrontFilterSheet';
import { StorefrontProductGrid } from '@/components/StorefrontProductGrid';
import { StorefrontSearchBar } from '@/components/StorefrontSearchBar';
import { BottomTabInset, Colors, Spacing } from '@/constants/Theme';
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
  const { status, products, retry, loadNextPage, isFetchingNextPage, refresh, refreshing } =
    useStorefrontCatalog(catalogParams);

  const handleStoreFrontPress = (productId: string) => {
    try {
      router.push({
        pathname: '/ProductDetails',
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
            <ScreenToolBar
              title="Vitrine"
              actions={[
                {
                  icon: 'clipboard-text-outline',
                  iconSet: 'material-community',
                  onPress: () => router.push('/Wishlist'),
                  accessibilityLabel: 'Wishlist',
                },
              ]}
            />
          </View>
          <StorefrontSearchBar
            value={searchInput}
            onChangeText={setSearchInput}
            onClear={clearSearch}
          />
          <StorefrontFilterChips
            groups={filterGroups}
            selectedIds={appliedFilterIds}
            onToggle={toggleAppliedFilter}
            onOpenSheet={handleOpenSheet}
          />
        </View>

        <View style={styles.body}>
          {isLoading && <LoadingState text="Carregando produtos..." />}
          {!isLoading && status === 'error' && (
            <ErrorState
              title="Não foi possível carregar a storefront"
              subtitle="Verifique sua conexão e tente novamente."
              onRetry={retry}
            />
          )}
          {!isLoading && status === 'empty' && (
            <EmptyState
              icon={<Feather name="shopping-bag" size={32} color={Colors.iconMuted} />}
              title="Nenhum produto encontrado"
              subtitle="Tente ajustar os filtros ou volte mais tarde."
            />
          )}
          {!isLoading && status === 'success' && (
            <StorefrontProductGrid
              products={products}
              onProductPress={handleStoreFrontPress}
              contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
              onEndReached={loadNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onRefresh={refresh}
              refreshing={refreshing}
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
    gap: 12,
    paddingBottom: 12,
  },
  paddedHeader: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
});
