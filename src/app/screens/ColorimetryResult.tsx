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

const FAVORITE_SLOTS = 4;

export default function ColorimetryResultScreen() {
  const { preferences, status, retry, isSaving, saveError, saveFavoriteColors } =
    useColorimetryPreferences();

  const [colorOverrides, setColorOverrides] = useState<Record<number, string>>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const hasChanges = Object.keys(colorOverrides).length > 0;

  const favoriteColors = preferences
    ? Array.from(
        { length: Math.max(FAVORITE_SLOTS, preferences.favoriteColors.length) },
        (_, i) => colorOverrides[i] ?? preferences.favoriteColors[i] ?? null,
      )
    : [];

  const pickerColors = preferences
    ? Array.from(
        new Set([
          ...preferences.highlightColors,
          ...preferences.avoidColors,
          ...preferences.favoriteColors,
        ]),
      )
    : [];

  function handleSelectFavorite(color: string) {
    if (activeSlot === null || isSaving) return;
    setSaved(false);
    setColorOverrides((prev) => ({ ...prev, [activeSlot]: color }));
    setActiveSlot(null);
  }

  async function handleEnter() {
    if (isSaving) return;
    if (!hasChanges) {
      router.replace('/(tabs)/Storefront');
      return;
    }
    const success = await saveFavoriteColors(
      favoriteColors.filter((color): color is string => color !== null),
    );
    if (success) {
      setColorOverrides({});
      setSaved(true);
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
          disabled={isSaving}
          onSlotPress={setActiveSlot}
        />
      </View>

      {saveError && (
        <ThemedText style={styles.saveError} themeColor="textSecondary">
          {saveError}
        </ThemedText>
      )}
      {saved && (
        <ThemedText style={styles.saveError} themeColor="textSecondary">
          Cores favoritas salvas com sucesso.
        </ThemedText>
      )}

      <View style={styles.footer}>
        <AuthButton
          title={hasChanges ? 'Salvar favoritas' : 'Entrar'}
          onPress={handleEnter}
          isLoading={isSaving}
        />

        <Pressable onPress={handleRedoColorimetry} hitSlop={8}>
          <Text style={styles.redoLink}>Refazer colorimetria</Text>
        </Pressable>
      </View>

      <ColorPickerModal
        visible={activeSlot !== null && !isSaving}
        colors={pickerColors}
        selectedColor={activeSlot !== null ? (favoriteColors[activeSlot] ?? undefined) : undefined}
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
