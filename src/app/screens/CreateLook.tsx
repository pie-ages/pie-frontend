import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { LookPieceCard } from '@/components/LookPieceCard';
import { LOOK_PIECE_ASPECT_RATIO } from '@/components/LookPiecesStack/styles';
import { SaveLookSheet } from '@/components/SaveLookSheet';
import { WardrobePickerModal } from '@/components/WardrobePickerModal';
import { Colors, Spacing } from '@/constants/Theme';
import { useLookForm } from '@/hooks/UseLookForm';
import { MOCK_WARDROBE_PIECES } from '@/mocks/wardrobe';
import { MAX_LOOK_PIECES } from '@/types/look';

export default function CreateLookScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const form = useLookForm();
  const [isPicking, setIsPicking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const busy = form.operation !== null;
  const selectedIds = form.items.map((item) => item.id);
  const canAddMore = form.items.length < MAX_LOOK_PIECES;
  const slotWidth = Math.min(windowWidth * 0.67, 300);
  const pieceHeight = slotWidth / LOOK_PIECE_ASPECT_RATIO;
  const emptyAddHeight = pieceHeight * 3 + Spacing.two * 2;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Looks');
    }
  };

  const handleConfirmSave = () => {
    form.saveLook(() => {
      setIsSaving(false);
      goBack();
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        Platform.OS === 'web' && { maxHeight: windowHeight, overflow: 'hidden' },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Criar Look</Text>
          <Text style={styles.subtitle}>Selecione peças do seu closet para montar seu look.</Text>
        </View>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={8}
          style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
        >
          <Feather name="x" size={20} color={Colors.light.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.compositionScroll}
        contentContainerStyle={styles.compositionContent}
        showsVerticalScrollIndicator={false}
      >
        {form.items.map((piece) => (
          <View key={piece.id} style={[styles.slot, { width: slotWidth }]}>
            <Image source={{ uri: piece.imageUrl! }} style={styles.slotImage} contentFit="cover" />
            <Pressable
              onPress={() => form.togglePiece(piece)}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${piece.name}`}
              hitSlop={6}
              style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
            >
              <Feather name="x" size={14} color={Colors.white} />
            </Pressable>
          </View>
        ))}

        {canAddMore ? (
          <Pressable
            onPress={() => setIsPicking(true)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Adicionar peça ao look"
            style={({ pressed }) => [
              styles.addSlot,
              form.items.length === 0
                ? { width: slotWidth, height: emptyAddHeight }
                : { width: slotWidth, aspectRatio: LOOK_PIECE_ASPECT_RATIO },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.addCircle}>
              <Feather name="plus" size={24} color={Colors.icon} />
            </View>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {form.items.length > 0 ? (
          <AuthButton
            title="Salvar Look"
            onPress={() => setIsSaving(true)}
            isLoading={form.operation === 'save'}
            disabled={busy}
          />
        ) : null}
        {canAddMore ? (
          <AuthButton
            title={form.items.length ? 'Sugerir peças com IA' : 'Sugerir look com IA'}
            variant="secondary"
            onPress={form.requestSuggestion}
            isLoading={form.operation === 'suggest'}
            disabled={busy}
          />
        ) : null}
      </View>

      <WardrobePickerModal
        visible={isPicking}
        pieces={MOCK_WARDROBE_PIECES}
        selectedIds={selectedIds}
        onToggle={form.togglePiece}
        onClose={() => setIsPicking(false)}
      />

      <SaveLookSheet
        visible={isSaving}
        name={form.name}
        description={form.description}
        error={form.error}
        saving={form.operation === 'save'}
        onChangeName={form.updateName}
        onChangeDescription={form.updateDescription}
        onCancel={() => setIsSaving(false)}
        onConfirm={handleConfirmSave}
      />

      <Modal
        visible={form.suggestion !== null}
        animationType="slide"
        onRequestClose={form.dismissSuggestion}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Sugestão de look</Text>
              <Text style={styles.subtitle}>
                Ao aceitar, estas peças substituem a composição atual.
              </Text>
            </View>
            <Pressable
              onPress={form.dismissSuggestion}
              accessibilityRole="button"
              accessibilityLabel="Fechar sugestão"
              hitSlop={8}
              style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
            >
              <Feather name="x" size={20} color={Colors.light.text} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.suggestionContent}
            showsVerticalScrollIndicator={false}
          >
            {form.suggestion?.map((piece) => (
              <View key={piece.id} style={styles.suggestionCell}>
                <LookPieceCard piece={piece} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <AuthButton title="Usar esta composição" onPress={form.acceptSuggestion} />
            <AuthButton
              title="Manter meu look"
              variant="secondary"
              onPress={form.dismissSuggestion}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundElement,
  },
  closePressed: {
    opacity: 0.7,
  },
  compositionScroll: {
    flex: 1,
    minHeight: 0,
  },
  compositionContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  slot: {
    aspectRatio: LOOK_PIECE_ASPECT_RATIO,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.backgroundSelected,
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  remove: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  addSlot: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.placeholder,
  },
  addCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  pressed: {
    opacity: 0.85,
  },
  footer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  suggestionContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  suggestionCell: {
    width: '40%',
    alignSelf: 'center',
  },
});
