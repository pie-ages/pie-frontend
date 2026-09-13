import { FlatList, StyleSheet } from 'react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import type { Product } from '@/types/Product';

type StorefrontProductGridProps = {
  products: Product[];
  onProductPress: (productId: string) => void;
  contentBottomInset: number;
};

export function StorefrontProductGrid({
  products,
  onProductPress,
  contentBottomInset,
}: StorefrontProductGridProps) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <StorefrontProductCard product={item} onPress={() => onProductPress(item.id)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingTop: 0,
  },
  row: {
    gap: 12,
  },
});
