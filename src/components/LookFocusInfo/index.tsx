import { Text } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import type { Look } from '@/types/Look';

import { styles } from './styles';

type LookFocusInfoProps = {
  look: Look;
};

export function LookFocusInfo({ look }: LookFocusInfoProps) {
  const subtitle = [look.style, look.occasion].filter(Boolean).join(' · ');

  return (
    <Animated.View
      key={look.id}
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      style={styles.container}
    >
      <Text style={styles.name} numberOfLines={1}>
        {look.name}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
}
