import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import Reanimated, { FadeInDown, FadeInUp, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PERSONAL_STYLE_IMAGES } from '@/constants/PersonalStyleImages';
import { Colors, FontFamilies, Spacing } from '@/constants/Theme';
import { useEditFavoriteStyles } from '@/hooks/UseEditFavoriteStyles';
import { useSessionExpiredRedirect } from '@/hooks/UseSessionExpiredRedirect';

const FadeImage = ({ uri, isActive }: { uri: string; isActive: boolean }) => {
  const [fadeAnim] = useState(() => new Animated.Value(isActive ? 1 : 0));
  const [scaleAnim] = useState(() => new Animated.Value(isActive ? 1 : 1.05));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isActive ? 1 : 1.05,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, fadeAnim, scaleAnim]);

  return (
    <Animated.Image
      source={{ uri }}
      style={[
        { position: 'absolute', width: '100%', height: '100%' },
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      resizeMode="cover"
    />
  );
};

export default function StyleSelectionScreen() {
  const {
    styleOptions,
    selectedIds,
    toggle,
    isLoading,
    isSaving,
    canSave,
    hasLoadError,
    retryLoad,
    error,
    sessionExpired,
    save,
  } = useEditFavoriteStyles(() => router.push('/(screens)/ColorimetryResult'));
  const [previewStyle, setPreviewStyle] = useState<string | null>(null);
  const activeBgStyleId =
    previewStyle && selectedIds.has(previewStyle)
      ? previewStyle
      : selectedIds.values().next().value;

  useSessionExpiredRedirect(sessionExpired);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <View style={styles.container}>
      {Object.entries(PERSONAL_STYLE_IMAGES).map(([id, uri]) => (
        <FadeImage key={id} uri={uri} isActive={id === (activeBgStyleId ?? 'CASUAL')} />
      ))}

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <Reanimated.View
          entering={FadeInDown.duration(380).reduceMotion(ReduceMotion.System)}
          style={styles.headerArea}
        >
          <Text style={styles.headerTitle}>Caso você queira personalizar seu estilo</Text>
          <Text style={styles.headerSubtitle}>
            Escolha um estilo para começar. {'\n'}Você pode ajustar os detalhes depois.
          </Text>
        </Reanimated.View>

        <Reanimated.View
          entering={FadeInDown.duration(420).delay(100).reduceMotion(ReduceMotion.System)}
          style={styles.gridContainer}
        >
          {styleOptions.map((style) => {
            const isSelected = selectedIds.has(style.id);

            return (
              <TouchableOpacity
                key={style.id}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                disabled={isLoading || isSaving}
                onPress={() => {
                  toggle(style.id);
                  setPreviewStyle(style.id);
                }}
                style={[
                  styles.styleButton,
                  isSelected ? styles.styleButtonActive : styles.styleButtonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.styleButtonText,
                    isSelected ? styles.styleButtonTextActive : styles.styleButtonTextInactive,
                  ]}
                >
                  {style.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Reanimated.View>

        <Reanimated.View
          entering={FadeInUp.duration(380).delay(180).reduceMotion(ReduceMotion.System)}
          style={styles.footer}
        >
          {error && (
            <Text accessibilityRole="alert" style={styles.headerSubtitle}>
              {error}
            </Text>
          )}
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            accessibilityRole="button"
            disabled={!canSave && !hasLoadError}
            onPress={hasLoadError ? retryLoad : save}
          >
            <Text style={styles.continueButtonText}>
              {hasLoadError ? 'Tentar novamente' : isSaving ? 'Salvando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </Reanimated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerArea: {
    paddingHorizontal: Spacing.four,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  headerTitle: {
    fontFamily: FontFamilies.jakartaBold,
    fontSize: Spacing.five,
    color: Colors.white,
    lineHeight: 38,
    marginBottom: 12,
  },
  headerSubtitle: {
    fontFamily: FontFamilies.interRegular,
    fontSize: Spacing.three,
    color: Colors.brand.tertiary,
    lineHeight: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
  },
  styleButton: {
    width: '30%',
    height: 86,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  styleButtonActive: {
    backgroundColor: Colors.brand.primary,
  },
  styleButtonInactive: {
    backgroundColor: Colors.brand.tertiary,
  },
  styleButtonText: {
    fontFamily: FontFamilies.interBold,
    fontSize: 14,
    textAlign: 'center',
  },
  styleButtonTextActive: {
    color: Colors.white,
  },
  styleButtonTextInactive: {
    color: Colors.light.text,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.four,
  },
  continueButton: {
    height: 56,
    backgroundColor: Colors.brand.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: FontFamilies.jakartaBold,
    color: Colors.white,
    fontSize: Spacing.three,
  },
});
