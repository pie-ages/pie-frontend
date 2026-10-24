import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { useWardrobe } from '@/hooks/UseWardrobe';
import type { LookImageAsset } from '@/services/looks';
import { MAX_LOOK_PIECES } from '@/types/Look';

export default function CreateLookScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const form = useLookForm();
  const wardrobe = useWardrobe();
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [isChoosingQuantity, setIsChoosingQuantity] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState<LookImageAsset | null>(null);

  const busy = form.operation !== null;
  const selectedIds = form.items.map((item) => item.id);
  const canSuggest = form.pieceCount === null || !form.isComplete;
  const [areaWidth, setAreaWidth] = useState(0);
  const [areaHeight, setAreaHeight] = useState(0);
  const gap = Spacing.two;
  const padding = Spacing.three;
  const rowCount = form.pieceCount === 4 ? 2 : (form.pieceCount ?? 3);
  const contentWidth = areaWidth ? areaWidth - padding * 2 : windowWidth - padding * 2;
  const widthCap =
    form.pieceCount === 4
      ? (Math.min(contentWidth, 380) - gap) / 2
      : Math.min(windowWidth * 0.6, 240);
  const maxSlotHeight = areaHeight
    ? (areaHeight - padding * 2 - gap * (rowCount - 1)) / rowCount
    : widthCap / LOOK_PIECE_ASPECT_RATIO;
  const slotHeight = Math.max(Math.min(widthCap / LOOK_PIECE_ASPECT_RATIO, maxSlotHeight), 0);
  const slotWidth = slotHeight * LOOK_PIECE_ASPECT_RATIO;
  const emptyAddHeight = slotHeight * 3 + gap * 2;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/Looks');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType });
    }
  };

  const handleConfirmSave = () => {
    form.saveLook(image, () => {
      setIsSaving(false);
      setSaved(true);
    });
  };

  const chooseQuantity = (count: number) => {
    const applyQuantity = () => {
      form.choosePieceCount(count);
      setIsChoosingQuantity(false);
      if (pendingSuggestion) {
        setPendingSuggestion(false);
        form.requestSuggestion(count);
      }
    };

    if (form.slots.slice(count).some(Boolean)) {
      Alert.alert(
        'Alterar quantidade de peças?',
        'As peças que não couberem na nova quantidade serão removidas do look.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Alterar', style: 'destructive', onPress: applyQuantity },
        ],
      );
      return;
    }
    applyQuantity();
  };

  const suggestPieces = () => {
    if (form.pieceCount === null) {
      setPendingSuggestion(true);
      setIsChoosingQuantity(true);
      return;
    }
    form.requestSuggestion();
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
          <Text style={styles.subtitle}>
            {form.pieceCount === null
              ? 'Selecione peças do seu closet para montar seu look.'
              : `Escolha ${form.pieceCount} ${form.pieceCount === 1 ? 'peça' : 'peças'} para o look.`}
          </Text>
          {form.pieceCount !== null ? (
            <Pressable
              onPress={() => setIsChoosingQuantity(true)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={`Alterar quantidade de peças, atualmente ${form.pieceCount}`}
              style={({ pressed }) => [styles.quantityButton, pressed && styles.pressed]}
            >
              <Text style={styles.quantityText}>
                {form.pieceCount} {form.pieceCount === 1 ? 'peça' : 'peças'} · Alterar
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={8}
            style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
          >
            <Feather name="x" size={20} color={Colors.light.text} />
          </Pressable>
          <Pressable
            onPress={() => setIsSaving(true)}
            disabled={!form.isComplete || busy}
            accessibilityRole="button"
            accessibilityLabel="Salvar look"
            accessibilityState={{ disabled: !form.isComplete || busy }}
            hitSlop={6}
            style={({ pressed }) => [
              styles.saveIcon,
              (!form.isComplete || busy) && styles.saveIconDisabled,
              pressed && form.isComplete && !busy && styles.pressed,
            ]}
          >
            <Feather
              name="check"
              size={22}
              color={form.isComplete && !busy ? Colors.white : Colors.iconMuted}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={[styles.composition, form.pieceCount === 4 && styles.compositionGrid]}
        onLayout={(event) => {
          setAreaWidth(event.nativeEvent.layout.width);
          setAreaHeight(event.nativeEvent.layout.height);
        }}
      >
        {form.pieceCount === null ? (
          <Pressable
            onPress={() => setIsChoosingQuantity(true)}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel="Escolher quantidade de peças"
            style={({ pressed }) => [
              styles.addSlot,
              { width: slotWidth, height: emptyAddHeight },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.addCircle}>
              <Feather name="plus" size={24} color={Colors.icon} />
            </View>
          </Pressable>
        ) : (
          form.slots.map((piece, index) => (
            <View
              key={piece?.id ?? `empty-${index}`}
              style={[styles.slot, { width: slotWidth, height: slotHeight }]}
            >
              {piece ? (
                <>
                  {piece.imageUrl ? (
                    <Image
                      source={{ uri: piece.imageUrl }}
                      style={styles.slotImage}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.slotFallback}>
                      <Feather name="image" size={28} color={Colors.iconMuted} />
                    </View>
                  )}
                  <Pressable
                    onPress={() => form.removePieceAt(index)}
                    disabled={busy}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${piece.name}`}
                    hitSlop={6}
                    style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
                  >
                    <Feather name="trash-2" size={14} color={Colors.white} />
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => setPickingSlot(index)}
                  disabled={busy}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar peça ${index + 1}`}
                  style={({ pressed }) => [
                    styles.addSlot,
                    StyleSheet.absoluteFill,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.addCircle}>
                    <Feather name="plus" size={24} color={Colors.icon} />
                  </View>
                </Pressable>
              )}
            </View>
          ))
        )}
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + Spacing.two, Spacing.four) },
        ]}
      >
        {form.error && !isSaving ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {form.error}
          </Text>
        ) : null}
        {canSuggest ? (
          <AuthButton
            title={form.pieceCount ? 'Sugerir peças com IA' : 'Sugerir look com IA'}
            variant="secondary"
            onPress={suggestPieces}
            isLoading={form.operation === 'suggest'}
            disabled={busy}
          />
        ) : null}
      </View>

      <WardrobePickerModal
        visible={pickingSlot !== null}
        pieces={wardrobe.pieces}
        status={wardrobe.status}
        onRetry={wardrobe.retry}
        selectedIds={selectedIds}
        onSelect={(piece) => {
          if (pickingSlot === null) return;
          form.assignPiece(pickingSlot, piece);
          setPickingSlot(null);
        }}
        onClose={() => setPickingSlot(null)}
      />

      <Modal
        visible={isChoosingQuantity}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setIsChoosingQuantity(false);
          setPendingSuggestion(false);
        }}
      >
        <View style={styles.quantityBackdrop}>
          <View style={styles.quantityCard}>
            <Text style={styles.quantityTitle}>Quantas peças terá o look?</Text>
            <View style={styles.quantityOptions}>
              {Array.from({ length: MAX_LOOK_PIECES }, (_, index) => index + 1).map((count) => (
                <Pressable
                  key={count}
                  onPress={() => chooseQuantity(count)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: form.pieceCount === count }}
                  style={({ pressed }) => [
                    styles.quantityOption,
                    form.pieceCount === count && styles.quantityOptionSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.quantityOptionText,
                      form.pieceCount === count && styles.quantityOptionTextSelected,
                    ]}
                  >
                    {count} {count === 1 ? 'peça' : 'peças'}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => {
                setIsChoosingQuantity(false);
                setPendingSuggestion(false);
              }}
              accessibilityRole="button"
              style={styles.quantityCancel}
            >
              <Text style={styles.quantityCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <SaveLookSheet
        visible={isSaving}
        control={form.control}
        imageUri={image?.uri ?? null}
        error={form.error}
        saving={form.operation === 'save'}
        onPickImage={pickImage}
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
                Ao aceitar, estas peças preencherão os espaços vazios do look.
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

      <Modal visible={saved} transparent animationType="fade" onRequestClose={goBack}>
        <View style={styles.successBackdrop}>
          <View style={styles.successCard}>
            <View style={styles.successCircle}>
              <Feather name="check" size={32} color={Colors.white} />
            </View>
            <Text style={styles.successTitle}>Look salvo!</Text>
            <Text style={styles.successMessage}>Seu look foi criado com sucesso.</Text>
            <AuthButton title="Ver meus looks" onPress={goBack} />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  quantityButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
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
  saveIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  saveIconDisabled: {
    backgroundColor: Colors.light.backgroundElement,
  },
  composition: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  compositionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  slot: {
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
  slotFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.backgroundElement,
  },
  error: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  remove: {
    position: 'absolute',
    top: 8,
    left: 8,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  quantityBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  quantityCard: {
    width: '100%',
    maxWidth: 360,
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: 24,
    backgroundColor: Colors.white,
  },
  quantityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
  },
  quantityOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  quantityOption: {
    minWidth: '44%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundElement,
  },
  quantityOptionSelected: {
    backgroundColor: Colors.brand.primary,
  },
  quantityOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  quantityOptionTextSelected: {
    color: Colors.white,
  },
  quantityCancel: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  quantityCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  suggestionContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  suggestionCell: {
    width: '40%',
    alignSelf: 'center',
  },
  successBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  successCard: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: 24,
    backgroundColor: Colors.white,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    paddingBottom: Spacing.one,
  },
});
