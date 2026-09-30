import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';

import type { WardrobeRow } from '@/utils/wardrobe-rows';

import ClothingCard from './ClothingCard';

interface CategoryRowProps {
  data: WardrobeRow;
  onEndReached: (rowId: string) => void;
  onRetry: (rowId: string) => void;
}

export default function CategoryRow({ data, onEndReached, onRetry }: CategoryRowProps) {
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
    marginBottom: 4,
  },
  rackLine: {
    height: 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
    position: 'absolute',
    top: 30,
    zIndex: -1,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  footer: {
    width: 110,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
  },
  retryText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
