import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';

import { ClothingCard } from '@/components/ClothingCard';
import type { WardrobeRow } from '@/utils/wardrobe-rows';

import { styles } from './styles';

interface CategoryRowProps {
  data: WardrobeRow;
  onEndReached: (rowId: string) => void;
  onRetry: (rowId: string) => void;
}

export function CategoryRow({ data, onEndReached, onRetry }: CategoryRowProps) {
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
    ) : null;

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
        renderItem={({ item }) => <ClothingCard item={item} />}
        onEndReached={() => onEndReached(data.id)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={footer}
      />
    </View>
  );
}
