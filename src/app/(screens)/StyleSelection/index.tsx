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
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontFamilies, Spacing } from '@/constants/Theme';
import { availableStyles, mockUserIdentifiedStyles, StyleType } from '@/mocks/styleMocks';

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
          transform: [{ scale: scaleAnim as any }],
        },
      ]}
      resizeMode="cover"
    />
  );
};

export default function StyleSelectionScreen() {
  const [selectedStyleIds, setSelectedStyleIds] = useState<StyleType[]>(mockUserIdentifiedStyles);

  const [activeBgStyleId, setActiveBgStyleId] = useState<StyleType>(
    mockUserIdentifiedStyles[0] || 'classic',
  );

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, []);

  const handleToggleStyle = (styleId: StyleType) => {
    setSelectedStyleIds((prev) => {
      const isAlreadySelected = prev.includes(styleId);

      if (isAlreadySelected) {
        if (prev.length === 1) return prev;

        const updatedList = prev.filter((id) => id !== styleId);

        if (activeBgStyleId === styleId && updatedList.length > 0) {
          setActiveBgStyleId(updatedList[updatedList.length - 1]);
        }

        return updatedList;
      } else {
        setActiveBgStyleId(styleId);
        return [...prev, styleId];
      }
    });
  };

  return (
    <View style={styles.container}>
      {availableStyles.map((style) => (
        <FadeImage key={style.id} uri={style.bgImageUrl} isActive={style.id === activeBgStyleId} />
      ))}

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerArea}>
          <Text style={styles.headerTitle}>Caso você queira personalizar seu estilo</Text>
          <Text style={styles.headerSubtitle}>
            Escolha um estilo para começar. {'\n'}Você pode ajustar os detalhes depois.
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {availableStyles.map((style) => {
            const isSelected = selectedStyleIds.includes(style.id);

            return (
              <TouchableOpacity
                key={style.id}
                activeOpacity={0.8}
                onPress={() => handleToggleStyle(style.id)}
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
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.replace('/ColorimetryResult')}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
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
