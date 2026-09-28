import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { Spacing } from '@/constants/Theme';
import { useUserStyle } from '@/hooks/UseUserStyle';
import { IDENTIFIED_STYLE_INFO } from '@/types/IdentifiedStyle';

export default function MyStyleScreen() {
  const insets = useSafeAreaInsets();
  const { identifiedStyle } = useUserStyle();

  if (!identifiedStyle) return null;

  const info = IDENTIFIED_STYLE_INFO[identifiedStyle];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.four, backgroundColor: info.background },
      ]}
    >
      <Text style={[styles.title, { color: '#24312E' }]}>
        Seu estilo é <Text style={[styles.highlight, { color: info.highlight }]}>{info.label}</Text>
      </Text>

      <Text style={[styles.description, { color: '#24312E' }]}>{info.description}</Text>

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
