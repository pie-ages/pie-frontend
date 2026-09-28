import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { LookFocusCarousel } from '@/components/LookFocusCarousel';
import { LookFocusInfo } from '@/components/LookFocusInfo';
import { LookFocusPagination } from '@/components/LookFocusPagination';
import { LooksGrid } from '@/components/LooksGrid';
import { LooksViewModeToggle } from '@/components/LooksViewModeToggle';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { BottomTabInset, Colors, Spacing } from '@/constants/Theme';
import { useLookFocusNavigation } from '@/hooks/UseLookFocusNavigation';
import { useLooksCollection } from '@/hooks/UseLooksCollection';
import { MOCK_INITIAL_LOOK_ID } from '@/mocks/looks';
import type { LooksViewMode } from '@/types/look';

export default function LooksScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const params = useLocalSearchParams<{ lookId?: string; viewMode?: string }>();
  const [carouselAreaHeight, setCarouselAreaHeight] = useState(0);
  const [viewMode, setViewMode] = useState<LooksViewMode>(
    params.viewMode === 'grid' ? 'grid' : 'focus',
  );
  const [contentOpacity] = useState(() => new Animated.Value(1));
  const { status, looks, retry } = useLooksCollection();
  const { activeIndex, activeLook, goTo } = useLookFocusNavigation(
    looks,
    params.lookId ?? MOCK_INITIAL_LOOK_ID,
  );

  useEffect(() => {
    contentOpacity.setValue(0);
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [viewMode, contentOpacity]);

  const focusBottomPadding = insets.bottom + BottomTabInset + Spacing.two;

  const handleChangeViewMode = (mode: LooksViewMode) => {
    setViewMode(mode);
    router.setParams({ viewMode: mode, lookId: activeLook?.id ?? undefined });
  };

  const handleLookPress = (id: string) => {
    const index = looks.findIndex((look) => look.id === id);
    if (index >= 0) goTo(index);
    setViewMode('focus');
    router.setParams({ viewMode: 'focus', lookId: id });
  };

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top },
        Platform.OS === 'web' && { maxHeight: windowHeight, overflow: 'hidden' },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ScreenToolBar
            title="Meus Looks"
            actions={[
              {
                icon: 'plus',
                accessibilityLabel: 'Criar look',
                onPress: () => router.push('/screens/CreateLook'),
              },
            ]}
          />
          <LooksViewModeToggle value={viewMode} onChange={handleChangeViewMode} />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <LoadingState text="Carregando looks..." />}
          {status === 'error' && (
            <ErrorState
              title="Não foi possível carregar os looks"
              subtitle="Verifique sua conexão e tente novamente."
              onRetry={retry}
            />
          )}
          {status === 'empty' && (
            <EmptyState
              icon={<Ionicons name="sparkles-outline" size={32} color={Colors.icon} />}
              title="Você ainda não tem looks"
              subtitle="Monte seu primeiro look para vê-lo aqui."
            />
          )}
          {status === 'success' && (
            <Animated.View style={[styles.modeContainer, { opacity: contentOpacity }]}>
              {viewMode === 'focus' && (
                <View style={[styles.focusContent, { paddingBottom: focusBottomPadding }]}>
                  <View
                    style={styles.focusCarousel}
                    onLayout={(event) => setCarouselAreaHeight(event.nativeEvent.layout.height)}
                  >
                    <LookFocusCarousel
                      looks={looks}
                      activeIndex={activeIndex}
                      onChangeIndex={goTo}
                      maxHeight={carouselAreaHeight}
                    />
                  </View>
                  {activeLook && (
                    <View style={styles.focusFooter}>
                      <LookFocusInfo look={activeLook} />
                      <LookFocusPagination count={looks.length} activeIndex={activeIndex} />
                    </View>
                  )}
                </View>
              )}
              {viewMode === 'grid' && (
                <LooksGrid
                  looks={looks}
                  onLookPress={handleLookPress}
                  contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
                />
              )}
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    minHeight: 0,
    width: '100%',
  },
  header: {
    gap: 12,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  modeContainer: {
    flex: 1,
    minHeight: 0,
  },
  focusContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
  },
  focusCarousel: {
    flex: 1,
    justifyContent: 'center',
  },
  focusFooter: {
    gap: Spacing.two,
  },
});
