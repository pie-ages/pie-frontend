import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
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
  const [isClipboardActive, setIsClipboardActive] = useState(false);

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
        onPress={() => setIsClipboardActive((current) => !current)}
        style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}
        hitSlop={8}
      >
        {isClipboardActive ? (
          <MaterialCommunityIcons name="clipboard-check" size={22} color={BrandColors.primary} />
        ) : (
          <Feather name="clipboard" size={22} color={theme.text} />
        )}
      </Pressable>
    </View>
  );
}
