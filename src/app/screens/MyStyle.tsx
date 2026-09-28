import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { Spacing, StyleBackgrounds, StyleTextColors } from '@/constants/Theme';
import { useUserStyle } from '@/hooks/UseUserStyle';
import { STYLE_LABELS } from '@/types/Style';

export default function MyStyleScreen() {
  const insets = useSafeAreaInsets();
  const { styles: userStyles } = useUserStyle();
  const style = userStyles[0];
  const textColors = StyleTextColors[style];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.four, backgroundColor: StyleBackgrounds[style] },
      ]}
    >
      <Text style={[styles.title, { color: textColors.base }]}>
        Seu estilo é{' '}
        <Text style={[styles.highlight, { color: textColors.highlight }]}>
          {STYLE_LABELS[style]}
        </Text>
      </Text>

      <ProductActionButton
        title="Continuar"
        style={styles.button}
        onPress={() => router.push('/screens/StyleSelection')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: Spacing.five,
  },
  highlight: {
    fontWeight: '800',
  },
  button: {
    marginTop: Spacing.two,
  },
});
