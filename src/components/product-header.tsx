import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandColors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: 13,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.tertiary,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 17,
    lineHeight: 17,
  },
});
