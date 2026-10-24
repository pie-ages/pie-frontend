import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

type ProfileSectionCardProps = {
  title?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function ProfileSectionCard({ title, style, children }: ProfileSectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <ThemedText type="smallBold" style={styles.title}>
          {title}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}
