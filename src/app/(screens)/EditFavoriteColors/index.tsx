import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ProductActionButton } from '@/components/ProductActionButton';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useEditFavoriteColors } from '@/hooks/UseEditFavoriteColors';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

export default function EditFavoriteColorsScreen() {
  const { slots, isLoading, isSaving, error, sessionExpired, selectColor, removeColor, save } =
    useEditFavoriteColors();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  useSessionExpiredRedirect(sessionExpired);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenToolBar
          title={'Editar\nsuas cores favoritas'}
          showProfile={false}
          actions={[{ icon: 'x', accessibilityLabel: 'Fechar', onPress: () => router.back() }]}
        />
        <Text style={styles.subtitle}>Toque em uma cor para trocá-la ou no + para adicionar.</Text>

        <ColorimetryColorRow
          title="Cores favoritas"
          colors={slots}
          disabled={isLoading || isSaving}
          onSlotPress={setActiveSlot}
          onSlotRemove={removeColor}
        />

        {error && (
          <ThemedText accessibilityRole="alert" themeColor="textSecondary">
            {error}
          </ThemedText>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <ProductActionButton
          title="Salvar"
          onPress={save}
          isLoading={isLoading || isSaving}
          disabled={isLoading || isSaving}
        />
      </View>

      <ColorPickerModal
        visible={activeSlot !== null && !isSaving}
        selectedColor={activeSlot !== null ? (slots[activeSlot] ?? undefined) : undefined}
        onSelect={(color) => {
          if (activeSlot !== null) selectColor(activeSlot, color);
          setActiveSlot(null);
        }}
        onClose={() => setActiveSlot(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  footer: {
    padding: Spacing.four,
  },
});
