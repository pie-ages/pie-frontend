import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

import type { WardrobePiece } from '@/types/Look';

import { styles } from './styles';

interface ClothingCardProps {
  item: WardrobePiece;
}

export function ClothingCard({ item }: ClothingCardProps) {
  const [isLoading, setIsLoading] = useState(Boolean(item.imageUrl));
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.hangerHook} />

      <View style={styles.imageContainer}>
        {isLoading && !hasError && <ActivityIndicator style={styles.loader} color="#000" />}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        ) : null}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );
}
