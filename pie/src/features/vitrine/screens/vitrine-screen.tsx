import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VitrineEmptyState } from '@/features/vitrine/components/vitrine-empty-state';
import { VitrineErrorState } from '@/features/vitrine/components/vitrine-error-state';
import { VitrineFilterChips } from '@/features/vitrine/components/vitrine-filter-chips';
import { VitrineHeader } from '@/features/vitrine/components/vitrine-header';
import { VitrineLoadingState } from '@/features/vitrine/components/vitrine-loading-state';
import { VitrineProductGrid } from '@/features/vitrine/components/vitrine-product-grid';
import { VitrineSearchBar } from '@/features/vitrine/components/vitrine-search-bar';
import { useVitrineCatalog } from '@/features/vitrine/hooks/use-vitrine-catalog';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export function VitrineScreen() {
  const insets = useSafeAreaInsets();
  const { status, products, retry } = useVitrineCatalog();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <VitrineHeader />
          <VitrineSearchBar />
          <VitrineFilterChips />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <VitrineLoadingState />}
          {status === 'error' && <VitrineErrorState onRetry={retry} />}
          {status === 'empty' && <VitrineEmptyState />}
          {status === 'success' && (
            <VitrineProductGrid
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
