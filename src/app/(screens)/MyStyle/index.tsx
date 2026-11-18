import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StatusBar,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QUIZ_STYLE_IMAGES } from '@/constants/PersonalStyleImages';
import { Colors, FontFamilies, Spacing } from '@/constants/Theme';
import { useUserStyle } from '@/contexts/UserStyleContext';
import { IDENTIFIED_STYLE_INFO } from '@/types/IdentifiedStyle';

export default function MyStyleScreen() {
  const { identifiedStyle, identifiedTouches } = useUserStyle();
  const styleLabel = identifiedStyle ? IDENTIFIED_STYLE_INFO[identifiedStyle].label : null;
  const background = identifiedStyle ? QUIZ_STYLE_IMAGES[identifiedStyle] : undefined;

  const touchLabels = identifiedTouches.map((style) => IDENTIFIED_STYLE_INFO[style].label);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={background ? { uri: background } : undefined}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.spacer} />

          <Animated.View
            entering={FadeInDown.duration(500).delay(100).reduceMotion(ReduceMotion.System)}
            style={styles.textArea}
          >
            <Text style={styles.baseText}>
              {styleLabel ? (
                <>
                  Seu estilo é <Text style={styles.highlightText}>{styleLabel}</Text>
                  {' por essência'}
                  {touchLabels.length > 0 ? (
                    <>
                      {', com toques de '}
                      <Text style={styles.highlightText}>{touchLabels.join(' e ')}</Text>
                    </>
                  ) : (
                    '.'
                  )}
                </>
              ) : (
                'Personalize seus estilos'
              )}
            </Text>
          </Animated.View>

          <View style={styles.spacer} />

          <Animated.View
            entering={FadeInUp.duration(450).delay(280).reduceMotion(ReduceMotion.System)}
            style={styles.footer}
          >
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={() => {
                router.push('/(screens)/StyleSelection');
              }}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
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
  spacer: {
    flex: 1,
  },
  textArea: {
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: FontFamilies.jakartaBold,
    fontSize: 28,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  highlightText: {
    color: Colors.brand.secondary,
    textShadowColor: 'rgba(203, 167, 144, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
