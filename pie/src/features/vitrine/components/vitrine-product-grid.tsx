import { FlatList, StyleSheet } from 'react-native';

import { VitrineProductCard } from '@/features/vitrine/components/vitrine-product-card';
import type { Product } from '@/features/vitrine/types/product';

type VitrineProductGridProps = {
  products: Product[];
  contentBottomInset: number;
};

export function VitrineProductGrid({ products, contentBottomInset }: VitrineProductGridProps) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <VitrineProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingTop: 16,
  },
  row: {
    gap: 12,
  },
});
