import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { StyleOptionGrid } from '@/components/StyleOptionGrid';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useEditFavoriteStyles } from '@/hooks/UseEditFavoriteStyles';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

export default function EditStylesScreen() {
  const {
    styleOptions,
    selectedIds,
    toggle,
    isLoading,
    isSaving,
    canSave,
    error,
    sessionExpired,
    save,
  } = useEditFavoriteStyles();

  useSessionExpiredRedirect(sessionExpired);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenToolBar
          title={'Editar\nseus estilos'}
          showProfile={false}
          actions={[{ icon: 'x', accessibilityLabel: 'Fechar', onPress: () => router.back() }]}
        />
        <Text style={styles.subtitle}>Escolha os estilos que combinam com você.</Text>

        <View style={styles.grid}>
          <StyleOptionGrid options={styleOptions} selectedIds={selectedIds} onToggle={toggle} />
        </View>
        {error && (
          <ThemedText accessibilityRole="alert" themeColor="textSecondary">
            {error}
          </ThemedText>
        )}
      </View>

      <View style={styles.footer}>
        <ProductActionButton
          title="Salvar"
          onPress={save}
          isLoading={isLoading || isSaving}
          disabled={!canSave}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  grid: {
    flex: 1,
    marginTop: Spacing.three,
  },
  footer: {
    padding: Spacing.four,
  },
});
