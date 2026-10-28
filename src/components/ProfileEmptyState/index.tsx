import { Text } from 'react-native';

import { styles } from './styles';

type ProfileEmptyStateProps = {
  title: string;
};

export function ProfileEmptyState({ title }: ProfileEmptyStateProps) {
  return <Text style={styles.text}>{title}</Text>;
}
