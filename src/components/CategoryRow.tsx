import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { CategoryRowData } from '@/mocks/closetMocks';

import ClothingCard from './ClothingCard';

interface CategoryRowProps {
  data: CategoryRowData;
}

export default function CategoryRow({ data }: CategoryRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.title}</Text>

      <View style={styles.rackLine} />

      {data.items.length > 0 ? (
        <FlatList
          data={data.items}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <ClothingCard item={item} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma peça nesta categoria.</Text>
        </View>
      )}
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
  emptyContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
