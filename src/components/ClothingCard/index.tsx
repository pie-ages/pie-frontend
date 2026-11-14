import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, View, Text, Image, ActivityIndicator, Pressable } from 'react-native';

import type { WardrobePiece } from '@/types/Look';

import { styles } from './styles';

interface ClothingCardProps {
  item: WardrobePiece;
  onRemove?: (item: WardrobePiece) => void;
}

export function ClothingCard({ item, onRemove }: ClothingCardProps) {
  const [isLoading, setIsLoading] = useState(Boolean(item.imageUrl));
  const [hasError, setHasError] = useState(false);
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.hangerHook} />

      <View style={styles.imageContainer}>
        {isLoading && !hasError && <ActivityIndicator style={styles.loader} color="#661414" />}
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
    </Animated.View>
  );
}
