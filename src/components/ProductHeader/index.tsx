import Feather from '@expo/vector-icons/Feather';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { BrandColors } from '@/constants/Theme';
import { useTheme } from '@/hooks/UseTheme';

import { styles } from './styles';

type ProductHeaderProps = {
  title: string;
  onClose: () => void;
};

export function ProductHeader({ title, onClose }: ProductHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
        <Feather name="x" size={20} color={BrandColors.primary} />
      </Pressable>

      <ThemedText
        type="smallBold"
        style={[styles.title, styles.titleText]}
        numberOfLines={1}
        allowFontScaling={false}
      >
        {title}
      </ThemedText>

      <View style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}>
        <Feather name="clipboard" size={18} color={theme.text} />
      </View>
    </View>
  );
}
