import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { LookCard } from '@/components/LookCard';
import { Colors } from '@/constants/Theme';
import type { Look } from '@/types/Look';

import { styles } from './styles';

type LooksGridProps = {
  looks: Look[];
  onLookPress: (id: string) => void;
  contentBottomInset: number;
  loadingMore: boolean;
  pageError: boolean;
  onLoadMore: (retry?: boolean) => void;
};

export function LooksGrid({
  looks,
  onLookPress,
  contentBottomInset,
  loadingMore,
  pageError,
  onLoadMore,
}: LooksGridProps) {
  const footer = loadingMore ? (
    <ActivityIndicator color={Colors.brand.primary} style={styles.footer} />
  ) : pageError ? (
    <Pressable accessibilityRole="button" onPress={() => onLoadMore(true)} style={styles.footer}>
      <Text style={styles.retryText}>Não foi possível carregar mais looks. Tentar novamente</Text>
    </Pressable>
  ) : null;

  if (Platform.OS === 'web') {
    const rows: Look[][] = [];
    for (let i = 0; i < looks.length; i += 2) {
      rows.push(looks.slice(i, i + 2));
    }
    return (
      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
        scrollEventThrottle={16}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 250
          ) {
            onLoadMore();
          }
        }}
      >
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={[styles.row, { flexDirection: 'row' }]}>
            {row.map((look) => (
              <LookCard key={look.id} look={look} onPress={onLookPress} />
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
        {footer}
      </ScrollView>
    );
  }

  const data: (Look | null)[] = looks.length % 2 !== 0 ? [...looks, null] : looks;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item?.id ?? `placeholder-${index}`}
      numColumns={2}
      style={styles.list}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      onEndReached={() => onLoadMore()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={footer}
      renderItem={({ item }) =>
        item ? <LookCard look={item} onPress={onLookPress} /> : <View style={{ flex: 1 }} />
      }
    />
  );
}
