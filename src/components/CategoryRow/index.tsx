import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';

import { ClothingCard } from '@/components/ClothingCard';
import type { WardrobePiece } from '@/types/Look';
import type { WardrobeRow } from '@/utils/wardrobe-rows';

import { styles } from './styles';

interface CategoryRowProps {
  data: WardrobeRow;
  onEndReached: (rowId: string) => void;
  onRetry: (rowId: string) => void;
  onRemoveItem?: (item: WardrobePiece) => void;
}

export function CategoryRow({ data, onEndReached, onRetry, onRemoveItem }: CategoryRowProps) {
  const footer =
    data.status === 'loadingMore' ? (
      <View style={styles.footer}>
        <ActivityIndicator color="#000" accessibilityLabel={`Carregando mais ${data.title}`} />
      </View>
    ) : data.status === 'error' ? (
      <View style={styles.footer}>
        <Text style={styles.footerText}>Não foi possível carregar.</Text>
        <Pressable
          onPress={() => onRetry(data.id)}
          accessibilityRole="button"
          accessibilityLabel={`Tentar carregar mais ${data.title} novamente`}
          hitSlop={8}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      </View>
    ) : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      <View style={styles.rackLine} />

      <FlatList
        data={data.items}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <ClothingCard item={item} onRemove={onRemoveItem} />}
        onEndReached={() => onEndReached(data.id)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={footer}
      />
    </View>
  );
}
