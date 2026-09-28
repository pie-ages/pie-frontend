import { View } from 'react-native';

import { styles } from './styles';

type LookFocusPaginationProps = {
  count: number;
  activeIndex: number;
};

export function LookFocusPagination({ count, activeIndex }: LookFocusPaginationProps) {
  if (count <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`dot-${index}`}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}
