import { Image } from 'expo-image';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useLayoutScale } from '@/hooks/UseLayoutScale';
import type { StyleQuizOption } from '@/types/StyleQuiz';

import { createStyles } from './styles';

type StyleQuizOptionCardProps = {
  option: StyleQuizOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
};

export function StyleQuizOptionCard({
  option,
  index,
  isSelected,
  onSelect,
}: StyleQuizOptionCardProps) {
  const { s } = useLayoutScale();
  const styles = useMemo(() => createStyles(s), [s]);
  const badgeLabel = `Look ${String.fromCharCode(65 + index)}`;

  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={[badgeLabel, option.label, option.description].filter(Boolean).join(', ')}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof option.imageUrl === 'string' ? { uri: option.imageUrl } : option.imageUrl}
          style={styles.image}
          contentFit="cover"
        />

        <View style={[styles.badge, index === 0 ? styles.badgePrimary : styles.badgeSecondary]}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {badgeLabel}
          </Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label} numberOfLines={2} allowFontScaling={false}>
          {option.label}
        </Text>
        {option.description ? (
          <Text style={styles.description} numberOfLines={2} allowFontScaling={false}>
            {option.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
