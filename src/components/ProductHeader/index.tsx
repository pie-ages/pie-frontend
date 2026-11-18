import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { BrandColors } from '@/constants/Theme';
import { useTheme } from '@/hooks/UseTheme';

import { styles } from './styles';

type ProductHeaderProps = {
  title: string;
  onClose: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  isWishlistPending?: boolean;
  isWishlistDisabled?: boolean;
};

export function ProductHeader({
  title,
  onClose,
  isWishlisted = false,
  onToggleWishlist,
  isWishlistPending = false,
  isWishlistDisabled = false,
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
        disabled={isWishlistDisabled || isWishlistPending || !onToggleWishlist}
        accessibilityRole="button"
        accessibilityLabel={`${isWishlisted ? 'Remover' : 'Adicionar'} ${title} ${isWishlisted ? 'da' : 'à'} Wishlist`}
        accessibilityState={{ busy: isWishlistPending }}
        style={[
          styles.iconButton,
          { backgroundColor: isWishlisted ? BrandColors.primary : theme.backgroundElement },
        ]}
        hitSlop={8}
      >
        {isWishlistPending ? (
          <ActivityIndicator size="small" color={isWishlisted ? '#FFFFFF' : BrandColors.primary} />
        ) : (
          <MaterialCommunityIcons
            name="heart"
            size={22}
            color={isWishlisted ? '#FFFFFF' : theme.text}
          />
        )}
      </Pressable>
    </View>
  );
}
