import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { BrandColors } from '@/constants/Theme';
import { useTheme } from '@/hooks/UseTheme';

import { styles } from './styles';

type ProductHeaderProps = {
  title: string;
  onClose: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
};

export function ProductHeader({
  title,
  onClose,
  isWishlisted = false,
  onToggleWishlist,
}: ProductHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
        <Feather name="x" size={30} color={BrandColors.primary} />
      </Pressable>

      <ThemedText
        type="smallBold"
        style={[styles.title, styles.titleText]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {title}
      </ThemedText>

      <Pressable
        onPress={onToggleWishlist}
        style={[
          styles.iconButton,
          { backgroundColor: isWishlisted ? BrandColors.primary : theme.backgroundElement },
        ]}
        hitSlop={8}
      >
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={22}
          color={isWishlisted ? '#FFFFFF' : theme.text}
        />
      </Pressable>
    </View>
  );
}
