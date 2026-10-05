import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { StyleOptionGrid } from '@/components/StyleOptionGrid';
import { Colors, Spacing } from '@/constants/Theme';
import { useStyleSelection } from '@/hooks/UseStyleSelection';

export default function StyleSelectionScreen() {
  const { styleOptions, selectedIds, toggle, confirm } = useStyleSelection();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenToolBar title={'Caso\nvocê queira\npersonalizar seu estilo'} showProfile={false} />
        <Text style={styles.subtitle}>
          Escolha um estilo para começar. Você pode ajustar os detalhes depois.
        </Text>

        <View style={styles.grid}>
          <StyleOptionGrid options={styleOptions} selectedIds={selectedIds} onToggle={toggle} />
        </View>
      </View>

      <View style={styles.footer}>
        <ProductActionButton title="Continuar" onPress={confirm} />
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
