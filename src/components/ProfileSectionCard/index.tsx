import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { SectionActionButton, type SectionAction } from '@/components/SectionActionButton';
import { ThemedText } from '@/components/ThemedText';

import { styles } from './styles';

export type ProfileSectionAction = SectionAction;

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

          {action && <SectionActionButton {...action} />}
        </View>
      ) : null}
      {children}
    </View>
  );
}
