import { Feather } from '@expo/vector-icons';
import { Text } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, ReduceMotion } from 'react-native-reanimated';

import { BrandColors } from '@/constants/Theme';

import { styles } from './styles';

type StorefrontNoticeProps = {
  message: string;
};

export function StorefrontNotice({ message }: StorefrontNoticeProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(240).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
      style={styles.container}
      accessibilityLiveRegion="polite"
    >
      <Feather name="check-circle" size={18} color={BrandColors.primary} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}
