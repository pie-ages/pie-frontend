import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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

import type { LookImageAsset } from '@/api/looks';
import { AuthButton } from '@/components/AuthButton';
import { LookPieceCard } from '@/components/LookPieceCard';
import { LOOK_PIECE_ASPECT_RATIO } from '@/components/LookPiecesStack/styles';
import { SaveLookSheet } from '@/components/SaveLookSheet';
import { WardrobePickerModal } from '@/components/WardrobePickerModal';
import { Colors, Spacing } from '@/constants/Theme';
import { useLookForm } from '@/hooks/UseLookForm';
import { useWardrobe } from '@/hooks/UseWardrobe';
import { MAX_LOOK_PIECES } from '@/types/Look';

export default function CreateLookScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const form = useLookForm();
  const wardrobe = useWardrobe();
  const [isPicking, setIsPicking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [image, setImage] = useState<LookImageAsset | null>(null);

  const busy = form.operation !== null;
  const selectedIds = form.items.map((item) => item.id);
  const canAddMore = form.items.length < MAX_LOOK_PIECES;
  const [areaHeight, setAreaHeight] = useState(0);
  const gap = Spacing.two;
  const padding = Spacing.three;
  const widthCap = Math.min(windowWidth * 0.67, 300);
  const heightByWidth = widthCap / LOOK_PIECE_ASPECT_RATIO;
  const heightToFitThree = areaHeight ? (areaHeight - padding * 2 - gap * 2) / 3 : heightByWidth;
  const slotHeight = Math.max(Math.min(heightByWidth, heightToFitThree), 0);
  const slotWidth = slotHeight * LOOK_PIECE_ASPECT_RATIO;
  const emptyAddHeight = slotHeight * 3 + gap * 2;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/Looks');
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

      <View
        style={styles.composition}
        onLayout={(event) => setAreaHeight(event.nativeEvent.layout.height)}
      >
        {form.items.map((piece) => (
          <View key={piece.id} style={[styles.slot, { width: slotWidth, height: slotHeight }]}>
            {piece.imageUrl ? (
              <Image source={{ uri: piece.imageUrl }} style={styles.slotImage} contentFit="cover" />
            ) : (
              <View style={styles.slotFallback}>
                <Feather name="image" size={28} color={Colors.iconMuted} />
              </View>
            )}
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
                : { width: slotWidth, height: slotHeight },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.addCircle}>
              <Feather name="plus" size={24} color={Colors.icon} />
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.footer}>
        {form.error && !isSaving ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {form.error}
          </Text>
        ) : null}
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
        pieces={wardrobe.pieces}
        status={wardrobe.status}
        onRetry={wardrobe.retry}
        selectedIds={selectedIds}
        onToggle={form.togglePiece}
        onClose={() => setIsPicking(false)}
      />

      <SaveLookSheet
        visible={isSaving}
        name={form.name}
        occasion={form.occasion}
        imageUri={image?.uri ?? null}
        error={form.error}
        saving={form.operation === 'save'}
        onChangeName={form.updateName}
        onChangeOccasion={form.updateOccasion}
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
  composition: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
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
