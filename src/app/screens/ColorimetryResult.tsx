import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { MOCK_COLORIMETRY_PREFERENCES } from '@/mocks/colorimetry';

const EMPTY_FAVORITE_COLOR = '#999999';

export default function ColorimetryResultScreen() {
  const { highlightColors, avoidColors } = MOCK_COLORIMETRY_PREFERENCES;

  const [favoriteColors, setFavoriteColors] = useState<string[]>(
    MOCK_COLORIMETRY_PREFERENCES.favoriteColors,
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const pickerColors = Array.from(new Set([...highlightColors, ...avoidColors]));

  function handleSelectFavorite(color: string) {
    if (activeSlot === null) return;

    setFavoriteColors((prev) => prev.map((c, i) => (i === activeSlot ? color : c)));
    setActiveSlot(null);
  }

  function handleEnter() {}

  function handleRedoColorimetry() {}

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          Resultado da colorimetria feito utilizando IA
        </ThemedText>

        <View style={styles.rows}>
          <ColorimetryColorRow
            title="Suas cores de destaque"
            colors={highlightColors}
            caption="Tons terrosos e quentes valorizam sua pele."
          />

          <ColorimetryColorRow
            title="Cores a evitar perto do rosto"
            colors={avoidColors}
            caption="Tons de baixo contraste com o seu tom de pele"
          />

          <ColorimetryColorRow
            title="Escolha suas Cores Favoritas"
            colors={favoriteColors}
            emptyColor={EMPTY_FAVORITE_COLOR}
            onSlotPress={setActiveSlot}
          />
        </View>

        <View style={styles.footer}>
          <AuthButton title="Entrar" onPress={handleEnter} />

          <Pressable onPress={handleRedoColorimetry} hitSlop={8}>
            <Text style={styles.redoLink}>Refazer colorimetria</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ColorPickerModal
        visible={activeSlot !== null}
        colors={pickerColors}
        selectedColor={activeSlot !== null ? favoriteColors[activeSlot] : undefined}
        onSelect={handleSelectFavorite}
        onClose={() => setActiveSlot(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    marginTop: Spacing.four,
    color: '#292524',
  },
  rows: {
    gap: Spacing.three,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  redoLink: {
    color: Colors.brand.primary,
    fontSize: 14,
  },
});
