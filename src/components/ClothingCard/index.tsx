import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native';

import type { WardrobePiece } from '@/types/Look';

import { styles } from './styles';

interface ClothingCardProps {
  item: WardrobePiece;
  onRemove?: (item: WardrobePiece) => void;
}

export function ClothingCard({ item, onRemove }: ClothingCardProps) {
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

      {onRemove ? (
        <Pressable
          onPress={() => onRemove(item)}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.name} do closet`}
          hitSlop={8}
          style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
        >
          <Feather name="x" size={14} color="#661414" />
        </Pressable>
      ) : null}

      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );
}
