import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useColorimetryPreferences } from '@/hooks/UseColorimetryPreferences';

const EMPTY_FAVORITE_COLOR = '#999999';

export default function ColorimetryResultScreen() {
  const { preferences, status, retry, isSaving, saveError, saveFavoriteColors } =
    useColorimetryPreferences();

  const [colorOverrides, setColorOverrides] = useState<Record<number, string>>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const favoriteColors = preferences
    ? preferences.favoriteColors.map((c, i) => colorOverrides[i] ?? c)
    : [];

  const pickerColors = preferences
    ? Array.from(new Set([...preferences.highlightColors, ...preferences.avoidColors]))
    : [];

  function handleSelectFavorite(color: string) {
    if (activeSlot === null) return;
    setColorOverrides((prev) => ({ ...prev, [activeSlot]: color }));
    setActiveSlot(null);
  }

  async function handleEnter() {
    const success = await saveFavoriteColors(favoriteColors);
    if (success) {
      router.replace('/(tabs)/Storefront');
    }
  }

  function handleRedoColorimetry() {}

  if (status === 'loading') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText themeColor="textSecondary">
          Não foi possível carregar sua colorimetria.
        </ThemedText>
        <Pressable onPress={retry} hitSlop={8} style={styles.retryButton}>
          <Text style={styles.redoLink}>Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedText type="title" style={styles.title}>
        Resultado da colorimetria feito utilizando IA
      </ThemedText>

      <View style={styles.rows}>
        <ColorimetryColorRow
          title="Suas cores de destaque"
          colors={preferences!.highlightColors}
          caption="Tons terrosos e quentes valorizam sua pele."
        />

        <ColorimetryColorRow
          title="Cores a evitar perto do rosto"
          colors={preferences!.avoidColors}
          caption="Tons de baixo contraste com o seu tom de pele"
        />

        <ColorimetryColorRow
          title="Escolha suas Cores Favoritas"
          colors={favoriteColors}
          emptyColor={EMPTY_FAVORITE_COLOR}
          onSlotPress={setActiveSlot}
        />
      </View>

      {saveError && (
        <ThemedText style={styles.saveError} themeColor="textSecondary">
          {saveError}
        </ThemedText>
      )}

      <View style={styles.footer}>
        <AuthButton title="Entrar" onPress={handleEnter} isLoading={isSaving} />

        <Pressable onPress={handleRedoColorimetry} hitSlop={8}>
          <Text style={styles.redoLink}>Refazer colorimetria</Text>
        </Pressable>
      </View>

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
    paddingHorizontal: Spacing.two,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  title: {
    paddingTop: Spacing.fortyFour,
    paddingBottom: Spacing.five,
    color: '#292524',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.43,
    lineHeight: 40,
  },
  rows: {
    gap: Spacing.three,
  },
  saveError: {
    marginTop: Spacing.two,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.five,
  },
  retryButton: {
    paddingVertical: Spacing.two,
  },
  redoLink: {
    color: Colors.brand.primary,
    fontSize: 14,
  },
});
