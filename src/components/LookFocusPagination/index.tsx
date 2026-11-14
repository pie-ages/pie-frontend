import { View } from 'react-native';
import Animated, { LinearTransition, ReduceMotion } from 'react-native-reanimated';

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
        <Animated.View
          key={`dot-${index}`}
          layout={LinearTransition.duration(220).reduceMotion(ReduceMotion.System)}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}
