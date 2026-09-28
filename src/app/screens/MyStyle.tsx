import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { Spacing, StyleTextColors } from '@/constants/Theme';
import { useUserStyle } from '@/hooks/UseUserStyle';
import { STYLE_BACKGROUNDS, STYLE_DESCRIPTIONS, STYLE_LABELS } from '@/types/Style';

export default function MyStyleScreen() {
  const insets = useSafeAreaInsets();
  const { styles: userStyles } = useUserStyle();
  const style = userStyles[0];

  if (!style) return null;

  const textColors = StyleTextColors[style];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.four, backgroundColor: STYLE_BACKGROUNDS[style] },
      ]}
    >
      <Text style={[styles.title, { color: textColors.base }]}>
        Seu estilo é{' '}
        <Text style={[styles.highlight, { color: textColors.highlight }]}>
          {STYLE_LABELS[style]}
        </Text>
      </Text>

      <Text style={[styles.description, { color: textColors.base }]}>
        {STYLE_DESCRIPTIONS[style]}
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.three,
  },
  button: {
    marginTop: Spacing.two,
  },
});
