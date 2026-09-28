import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { LookPiecePreview } from '@/components/LookPiecePreview';
import { BottomTabInset, Colors } from '@/constants/Theme';
import { useLookForm } from '@/hooks/UseLookForm';
import { MOCK_CLOSET_PIECES } from '@/mocks/looks';
import type { LookPiece } from '@/types/Look';

const CATEGORIES: LookPiece['category'][] = ['Parte de cima', 'Parte de baixo', 'Calçados'];

export default function LooksScreen() {
  const form = useLookForm();
  const [isSelecting, setIsSelecting] = useState(false);
  const busy = form.operation !== null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{form.savedLook ? 'Look salvo' : 'Criar Look'}</Text>
          <Text style={styles.description}>
            Selecione peças do seu closet para montar seu look.
          </Text>
          {form.savedLook ? (
            <View style={styles.section}>
              <Text style={styles.subtitle}>{form.savedLook.name}</Text>
              <Text accessibilityLiveRegion="polite" style={styles.description}>
                Look salvo temporariamente. Ao sair desta tela ou reiniciar o aplicativo, ele será
                perdido.
              </Text>
              {form.savedLook.items.map((piece) => (
                <LookPiecePreview key={piece.id} piece={piece} />
              ))}
              <AuthButton title="Editar look" onPress={form.editSavedLook} />
              <AuthButton title="Criar outro look" variant="secondary" onPress={form.newLook} />
            </View>
          ) : (
            <>
              <View style={styles.composition}>
                {form.items.map((piece) => (
                  <View key={piece.id} style={styles.piece}>
                    <LookPiecePreview piece={piece} />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={'Remover ' + piece.name}
                      disabled={busy}
                      onPress={() => form.togglePiece(piece)}
                      style={styles.remove}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={24}
                        color={Colors.brand.primary}
                      />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Adicionar peças ao look"
                  disabled={busy}
                  onPress={() => setIsSelecting(true)}
                  style={[styles.add, !form.items.length && styles.empty]}
                >
                  <Ionicons name="add-circle-outline" size={32} color={Colors.icon} />
                  <Text style={styles.description}>
                    {form.items.length ? 'Adicionar peças' : 'Seu look começa aqui'}
                  </Text>
                  {!form.items.length && (
                    <Text style={styles.description}>Toque para escolher peças do closet</Text>
                  )}
                </Pressable>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Nome do look</Text>
                <TextInput
                  accessibilityLabel="Nome do look"
                  value={form.name}
                  onChangeText={form.updateName}
                  editable={!busy}
                  maxLength={60}
                  placeholder="Ex.: Look casual"
                  placeholderTextColor={Colors.icon}
                  style={styles.input}
                />
                <Text style={styles.subtitle}>Imagem do look</Text>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={32} color={Colors.icon} />
                  <Text style={styles.description}>A composição acima é a prévia do seu look.</Text>
                  <Text style={styles.description}>Foto disponível em uma próxima versão.</Text>
                </View>
                {form.error && (
                  <Text
                    accessibilityRole="alert"
                    accessibilityLiveRegion="polite"
                    style={styles.error}
                  >
                    {form.error}
                  </Text>
                )}
                <AuthButton
                  title="Salvar look"
                  onPress={form.saveLook}
                  isLoading={form.operation === 'save'}
                  disabled={busy}
                />
                <AuthButton
                  title="Sugerir look"
                  variant="secondary"
                  onPress={form.requestSuggestion}
                  isLoading={form.operation === 'suggest'}
                  disabled={busy}
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={isSelecting}
        animationType="slide"
        onRequestClose={() => setIsSelecting(false)}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.title}>Selecionar peças</Text>
            <Text style={styles.description}>
              Toque para selecionar ou remover. {form.items.length} selecionada(s).
            </Text>
            {CATEGORIES.map((category) => (
              <View key={category} style={styles.section}>
                <Text style={styles.subtitle}>{category}</Text>
                <View style={styles.grid}>
                  {MOCK_CLOSET_PIECES.filter((piece) => piece.category === category).map(
                    (piece) => {
                      const selected = form.items.some((item) => item.id === piece.id);
                      return (
                        <Pressable
                          key={piece.id}
                          accessibilityRole="checkbox"
                          accessibilityLabel={piece.name}
                          accessibilityState={{ checked: selected }}
                          onPress={() => form.togglePiece(piece)}
                          style={[styles.choice, selected && styles.selected]}
                        >
                          <LookPiecePreview piece={piece} />
                          <Text style={styles.selectionLabel}>
                            {selected ? '✓ Selecionada' : 'Selecionar'}
                          </Text>
                        </Pressable>
                      );
                    },
                  )}
                </View>
              </View>
            ))}
            <AuthButton title="Concluir seleção" onPress={() => setIsSelecting(false)} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={form.suggestion !== null}
        animationType="slide"
        onRequestClose={form.dismissSuggestion}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.title}>Sugestão de look</Text>
            <Text style={styles.description}>
              Ao aceitar, estas peças substituem a composição atual. Você poderá editar antes de
              salvar.
            </Text>
            {form.suggestion?.map((piece) => (
              <LookPiecePreview key={piece.id} piece={piece} />
            ))}
            <AuthButton title="Usar esta composição" onPress={form.acceptSuggestion} />
            <AuthButton
              title="Manter meu look"
              variant="secondary"
              onPress={form.dismissSuggestion}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: BottomTabInset + 40,
    gap: 16,
  },
  modalContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 20,
    gap: 20,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.light.text },
  subtitle: { fontSize: 16, fontWeight: '600', color: Colors.light.text },
  description: { fontSize: 14, color: Colors.light.textSecondary, lineHeight: 21 },
  section: { gap: 14 },
  composition: { gap: 12 },
  piece: {
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: 40,
  },
  remove: { position: 'absolute', right: 0, top: 0, padding: 12, minWidth: 48, minHeight: 48 },
  add: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  empty: { minHeight: 220 },
  input: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
    padding: 14,
    color: Colors.light.text,
    fontSize: 16,
  },
  imagePlaceholder: {
    padding: 20,
    gap: 8,
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 12,
  },
  error: { color: Colors.brand.primary, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  choice: {
    flexGrow: 1,
    flexBasis: '45%',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 8,
  },
  selected: { borderColor: Colors.brand.primary, backgroundColor: Colors.brand.tertiary },
  selectionLabel: {
    textAlign: 'center',
    color: Colors.brand.primary,
    fontWeight: '600',
    padding: 8,
  },
});
