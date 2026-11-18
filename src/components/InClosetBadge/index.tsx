import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { BrandColors } from '@/constants/Theme';

import { styles } from './styles';

type InClosetBadgeProps = {
  style?: StyleProp<ViewStyle>;
};

export function InClosetBadge({ style }: InClosetBadgeProps) {
  return (
    <View
      style={[styles.badge, style]}
      accessible
      accessibilityRole="text"
      accessibilityLabel="Esta peça já está no seu closet"
    >
      <MaterialCommunityIcons name="wardrobe-outline" size={14} color={BrandColors.primary} />
    </View>
  );
}
