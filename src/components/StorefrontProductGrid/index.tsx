import { FlatList, Platform, ScrollView, View } from 'react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import type { CatalogItem } from '@/types/product';

import { styles } from './styles';

type StorefrontProductGridProps = {
  products: CatalogItem[];
  onProductPress: (productId: string) => void;
  contentBottomInset: number;
};

export function StorefrontProductGrid({
  products,
  onProductPress,
  contentBottomInset,
}: StorefrontProductGridProps) {
  if (Platform.OS === 'web') {
    const rows: CatalogItem[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
    return (
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { flexDirection: 'row' }]}>
            {row.map((item) => (
              <StorefrontProductCard
                key={item.id}
                product={item}
                onPress={() => onProductPress(item.id)}
              />
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </ScrollView>
    );
  }

  const data: (CatalogItem | null)[] = products.length % 2 !== 0 ? [...products, null] : products;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?.id ?? `placeholder-${index}`}
      numColumns={2}
      style={styles.list}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) =>
        item ? (
          <StorefrontProductCard product={item} onPress={() => onProductPress(item.id)} />
        ) : (
          <View style={{ flex: 1 }} />
        )
      }
    />
  );
}
