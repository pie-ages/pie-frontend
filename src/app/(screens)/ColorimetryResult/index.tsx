import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/AuthButton';
import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ColorimetryConsentModal } from '@/components/ColorimetryConsentModal';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing } from '@/constants/Theme';
import { useColorimetryPreferences } from '@/hooks/UseColorimetryPreferences';

const MAX_COLORS = 4;

export default function ColorimetryResultScreen() {
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isConsentVisible, setIsConsentVisible] = useState(false);
  const capturingRef = useRef(false);
  const openCameraOnDismissRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const { preferences, status, errorMessage, retry, isSaving, saveError, saveFavoriteColors } =
    useColorimetryPreferences(photo, 4000);

  const [colorOverrides, setColorOverrides] = useState<Record<number, string | null>>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const hasChanges = Object.keys(colorOverrides).length > 0;

  const favoriteColors: (string | null)[] = preferences
    ? Array.from(
        {
          length: Math.max(
            MAX_COLORS,
            preferences.favoriteColors.length,
            ...Object.keys(colorOverrides).map((index) => Number(index) + 1),
          ),
        },
        (_, index) =>
          Object.prototype.hasOwnProperty.call(colorOverrides, index)
            ? colorOverrides[index]
            : (preferences.favoriteColors[index] ?? null),
      )
    : [];

  const selectedFavoriteColors = favoriteColors.filter((color): color is string => color !== null);

  function handleSelectFavorite(color: string) {
    if (activeSlot === null || isSaving) return;

    const normalizedColor = color.toUpperCase();

    const isDuplicate = favoriteColors.some(
      (favorite, index) => index !== activeSlot && favorite?.toUpperCase() === normalizedColor,
    );

    if (isDuplicate) {
      setFavoriteError('Essa cor já está nas suas favoritas.');
      setActiveSlot(null);
      return;
    }

    setFavoriteError(null);
    setColorOverrides((previous) => ({
      ...previous,
      [activeSlot]: normalizedColor,
    }));
    setActiveSlot(null);
  }

  function handleRemoveFavorite(index: number) {
    if (favoriteColors[index] == null || isSaving) return;

    setFavoriteError(null);
    setColorOverrides((previous) => ({
      ...previous,
      [index]: null,
    }));
    setActiveSlot(null);
  }

  async function handleEnter() {
    if (isSaving) return;
    if (selectedFavoriteColors.length > MAX_COLORS) {
      setFavoriteError(
        `Você pode escolher no máximo ${MAX_COLORS} cores favoritas. Remova as cores excedentes para continuar.`,
      );
      return;
    }
    if (hasChanges) {
      const success = await saveFavoriteColors(selectedFavoriteColors);
      if (!success) return;
    }
    router.replace('/Storefront');
  }

  function handleTakePhoto() {
    if (!hasConsented) {
      setIsConsentVisible(true);
      return;
    }
    void openCamera();
  }

  function handleAcceptConsent() {
    setHasConsented(true);
    setIsConsentVisible(false);
    if (Platform.OS === 'ios') {
      openCameraOnDismissRef.current = true;
    } else {
      void openCamera();
    }
  }

  function handleConsentDismiss() {
    if (!openCameraOnDismissRef.current) return;
    openCameraOnDismissRef.current = false;
    void openCamera();
  }

  async function openCamera() {
    if (capturingRef.current) return;
    capturingRef.current = true;
    setIsCapturing(true);
    setCameraError(null);

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!mountedRef.current) return;
      if (!permission.granted) {
        setCameraError('Permita o acesso à câmera para tirar sua foto.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!mountedRef.current || result.canceled) return;
      retry();
      setPhoto(result.assets[0]);
    } catch {
      if (mountedRef.current) {
        setCameraError('Não foi possível abrir a câmera. Tente novamente.');
      }
    } finally {
      capturingRef.current = false;
      if (mountedRef.current) setIsCapturing(false);
    }
  }

  function handleRedoColorimetry() {
    if (isSaving) return;
    setPhoto(null);
    setColorOverrides({});
    setActiveSlot(null);
    setFavoriteError(null);
    setCameraError(null);
  }

  if (photo === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.captureContent}>
          <ThemedText type="title" style={styles.title}>
            {'E por fim...\nAs cores que\ncombinam com você'}
          </ThemedText>
          <View style={styles.cameraPlaceholder}>
            <Feather name="camera" size={64} color={Colors.brand.primary} />
          </View>
          <ThemedText style={styles.instructions} themeColor="textSecondary">
            Tire uma foto de frente, em um local bem iluminado e com o rosto visível.
          </ThemedText>
          {cameraError && (
            <ThemedText accessibilityRole="alert" style={styles.instructions}>
              {cameraError}
            </ThemedText>
          )}
          <View style={styles.footer}>
            <AuthButton
              title="Tirar foto"
              onPress={handleTakePhoto}
              isLoading={isCapturing}
              accessibilityRole="button"
              accessibilityLabel="Tirar foto para iniciar a colorimetria"
            />
          </View>
        </ScrollView>
        <ColorimetryConsentModal
          visible={isConsentVisible}
          onAccept={handleAcceptConsent}
          onClose={() => setIsConsentVisible(false)}
          onDismiss={handleConsentDismiss}
        />
      </SafeAreaView>
    );
  }

  if (status === 'loading') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.photo}
          accessibilityLabel="Foto capturada"
        />
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <ThemedText accessibilityLiveRegion="polite">Preparando sua paleta de cores...</ThemedText>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ThemedText themeColor="textSecondary" style={styles.instructions}>
          {errorMessage ?? 'Não foi possível carregar sua colorimetria.'}
        </ThemedText>
        <Pressable onPress={retry} hitSlop={8} style={styles.retryButton}>
          <Text style={styles.redoLink}>Tentar novamente</Text>
        </Pressable>
        <Pressable onPress={handleRedoColorimetry} hitSlop={8} accessibilityRole="button">
          <Text style={styles.redoLink}>Tirar outra foto</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.resultContent}>
        <ThemedText type="title" style={styles.title}>
          {'Resultado\nda colorimetria\nfeito utilizando IA'}
        </ThemedText>

        {preferences!.season && (
          <ThemedText type="smallBold" style={styles.seasonLabel}>
            Sua estação: {preferences!.season.label}
          </ThemedText>
        )}

        <View style={styles.rows}>
          <ColorimetryColorRow
            title="Suas cores de destaque"
            colors={preferences!.highlightColors}
            caption={preferences!.season?.highlightCaption}
          />

          <ColorimetryColorRow
            title="Cores a evitar perto do rosto"
            colors={preferences!.avoidColors}
            caption={preferences!.season?.avoidCaption}
          />

          <ColorimetryColorRow
            title="Escolha suas Cores Favoritas"
            colors={favoriteColors}
            disabled={isSaving}
            onSlotRemove={handleRemoveFavorite}
            onSlotPress={(index) => {
              setFavoriteError(null);
              setActiveSlot(index);
            }}
          />
        </View>

        {favoriteError && (
          <ThemedText accessibilityRole="alert" style={styles.saveError} themeColor="textSecondary">
            {favoriteError}
          </ThemedText>
        )}

        {saveError && (
          <ThemedText style={styles.saveError} themeColor="textSecondary">
            {saveError}
          </ThemedText>
        )}

        <View style={styles.footer}>
          <AuthButton title="Continuar" onPress={handleEnter} isLoading={isSaving} />

          <Pressable
            onPress={handleRedoColorimetry}
            disabled={isSaving}
            accessibilityRole="button"
            hitSlop={8}
          >
            <Text style={styles.redoLink}>Refazer colorimetria</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ColorPickerModal
        visible={activeSlot !== null && !isSaving}
        selectedColor={activeSlot !== null ? (favoriteColors[activeSlot] ?? undefined) : undefined}
        onSelect={handleSelectFavorite}
        onClose={() => setActiveSlot(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  captureContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  resultContent: {
    flexGrow: 1,
    paddingBottom: Spacing.four,
  },
  cameraPlaceholder: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.tertiary,
    borderRadius: 16,
  },
  instructions: {
    textAlign: 'center',
  },
  photo: {
    width: 160,
    height: 200,
    borderRadius: 16,
  },
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
  seasonLabel: {
    paddingBottom: Spacing.three,
    color: Colors.brand.primary,
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
