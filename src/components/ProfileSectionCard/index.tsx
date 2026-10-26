import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Theme';

import { styles } from './styles';

export type ProfileSectionAction = {
  label: string;
  icon: string;
  onPress: () => void;
};

type ProfileSectionCardProps = {
  title?: string;
  action?: ProfileSectionAction;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function ProfileSectionCard({ title, action, style, children }: ProfileSectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.title}>
            {title}
          </ThemedText>

          {action && (
            <Pressable
              onPress={action.onPress}
              style={styles.action}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Feather name={action.icon as never} size={18} color={Colors.brand.primary} />
            </Pressable>
          )}
        </View>
      ) : null}
      {children}
    </View>
  );
}
