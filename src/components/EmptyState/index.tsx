import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './styles';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}
