import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ThemedText } from '@/components/ThemedText';
import { Spacing, StyleBackgrounds } from '@/constants/Theme';
import { useUserStyle } from '@/hooks/UseUserStyle';
import { STYLE_LABELS } from '@/types/Style';

export default function MyStyleScreen() {
  const insets = useSafeAreaInsets();
  const { style } = useUserStyle();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: StyleBackgrounds[style] },
      ]}
    >
      <ThemedText type="small">Seu estilo é</ThemedText>
      <ThemedText type="title">{STYLE_LABELS[style]}</ThemedText>

      <ProductActionButton
        title="Alterar estilo"
        style={styles.button}
        onPress={() => router.push('/screens/StyleSelection')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  button: {
    marginTop: Spacing.four,
  },
});
