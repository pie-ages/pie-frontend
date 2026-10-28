import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { BrandColors } from '@/constants/Theme';

import { styles } from './styles';

type StorefrontNoticeProps = {
  message: string;
};

export function StorefrontNotice({ message }: StorefrontNoticeProps) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Feather name="check-circle" size={18} color={BrandColors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}
