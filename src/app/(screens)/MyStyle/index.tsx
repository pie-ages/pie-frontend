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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontFamilies, Spacing } from '@/constants/Theme';
import { availableStyles, mockUserIdentifiedStyles } from '@/mocks/styleMocks';

export default function MyStyleScreen() {
  const primaryStyleId = mockUserIdentifiedStyles[0];
  const primaryStyleData = availableStyles.find((s) => s.id === primaryStyleId);

  const secondaryStyle1 = availableStyles.find((s) => s.id === mockUserIdentifiedStyles[1]);
  const secondaryStyle2 = availableStyles.find((s) => s.id === mockUserIdentifiedStyles[2]);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: primaryStyleData?.bgImageUrl }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.spacer} />

          <View style={styles.textArea}>
            <Text style={styles.baseText}>
              Seu estilo é <Text style={styles.highlightText}>{primaryStyleData?.label}</Text>
              {'\n'}por essência, com toques{'\n'}
              {secondaryStyle1 && (
                <Text style={styles.highlightText}>{secondaryStyle1.label}s</Text>
              )}
              {secondaryStyle2 && (
                <>
                  {' '}
                  e <Text style={styles.highlightText}>{secondaryStyle2.label}s</Text>
                </>
              )}
            </Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={() => {
                router.push('/(screens)/StyleSelection');
              }}
            >
              <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
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
