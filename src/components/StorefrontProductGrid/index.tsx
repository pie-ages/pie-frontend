import { FlatList } from 'react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import type { Product } from '@/types/product';

import { styles } from './styles';

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
      style={styles.list}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <StorefrontProductCard product={item} onPress={() => onProductPress(item.id)} />
      )}
    />
  );
}
