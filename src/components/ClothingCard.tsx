import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

import { ClothingItem } from '@/mocks/closetMocks';

interface ClothingCardProps {
  item: ClothingItem;
}

export default function ClothingCard({ item }: ClothingCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.hangerHook} />

      <View style={styles.imageContainer}>
        {isLoading && !hasError && <ActivityIndicator style={styles.loader} color="#000" />}
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    marginRight: 16,
    alignItems: 'center',
  },
  hangerHook: {
    width: 2,
    height: 12,
    backgroundColor: '#E5E7EB',
  },
  imageContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  loader: {
    position: 'absolute',
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
});
