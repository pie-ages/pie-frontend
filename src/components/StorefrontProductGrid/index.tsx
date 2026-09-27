import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import { StorefrontProductCard } from '@/components/StorefrontProductCard';
import type { CatalogItem } from '@/types/Product';

import { styles } from './styles';

type StorefrontProductGridProps = {
  products: CatalogItem[];
  onProductPress: (productId: string) => void;
  contentBottomInset: number;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  onRefresh: () => void;
  refreshing: boolean;
};

export function StorefrontProductGrid({
  products,
  onProductPress,
  contentBottomInset,
  onEndReached,
  isFetchingNextPage,
  onRefresh,
  refreshing,
}: StorefrontProductGridProps) {
  const scrollTop = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node =
      (scrollRef.current as any)?._nativeRef?.current ??
      (scrollRef.current as any)?._scrollViewRef?.current ??
      (scrollRef.current as any);
    if (!node?.addEventListener) return;
    const handleWheel = (e: WheelEvent) => {
      if (scrollTop.current <= 0 && e.deltaY < 0) onRefresh();
    };
    node.addEventListener('wheel', handleWheel);
    return () => node.removeEventListener('wheel', handleWheel);
  }, [onRefresh]);

  if (Platform.OS === 'web') {
    const rows: CatalogItem[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
    return (
      <ScrollView
        ref={scrollRef}
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
        onScroll={({ nativeEvent }) => {
          scrollTop.current = nativeEvent.contentOffset.y;
          const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
          if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 200) {
            onEndReached();
          }
        }}
        scrollEventThrottle={200}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {refreshing && (
          <View style={styles.refreshIndicator}>
            <ActivityIndicator />
          </View>
        )}
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
        {isFetchingNextPage && (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        )}
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
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
