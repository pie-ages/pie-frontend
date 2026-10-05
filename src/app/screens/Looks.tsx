import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { uploadLookImage } from '@/api/looks';
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
import type { LooksViewMode } from '@/types/Look';

export default function LooksScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const params = useLocalSearchParams<{ lookId?: string; viewMode?: string }>();
  const [carouselAreaHeight, setCarouselAreaHeight] = useState(0);
  const [viewMode, setViewMode] = useState<LooksViewMode>(
    params.viewMode === 'grid' ? 'grid' : 'focus',
  );
  const [contentOpacity] = useState(() => new Animated.Value(1));
  const {
    status,
    looks,
    retry,
    refresh,
    hasNext,
    loadingMore,
    pageError,
    loadMore,
    updateLookPhoto,
  } = useLooksCollection();
  const { activeIndex, activeLook, goTo } = useLookFocusNavigation(looks, params.lookId);
  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    if (viewMode === 'focus' && hasNext && activeIndex === looks.length - 1 && !pageError) {
      void loadMore();
    }
  }, [activeIndex, hasNext, loadMore, looks.length, pageError, viewMode]);

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

  const handleAddPhoto = async (lookId: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    try {
      const result = await uploadLookImage(lookId, {
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
      updateLookPhoto(lookId, result.photoUrl);
    } catch {
      // upload silently fails; user can retry by pressing the button again
    }
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
                      onAddPhoto={handleAddPhoto}
                      maxHeight={carouselAreaHeight}
                    />
                  </View>
                  {activeLook && (
                    <View style={styles.focusFooter}>
                      <LookFocusInfo look={activeLook} />
                      <LookFocusPagination count={looks.length} activeIndex={activeIndex} />
                      {loadingMore && <ActivityIndicator color={Colors.brand.primary} />}
                      {pageError && (
                        <Pressable onPress={() => loadMore(true)} accessibilityRole="button">
                          <Text style={styles.retryText}>Tentar carregar mais looks</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              )}
              {viewMode === 'grid' && (
                <LooksGrid
                  looks={looks}
                  onLookPress={handleLookPress}
                  contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
                  loadingMore={loadingMore}
                  pageError={pageError}
                  onLoadMore={loadMore}
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
    minHeight: 0,
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
  },
  focusCarousel: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
  },
  focusFooter: {
    gap: Spacing.two,
  },
  retryText: {
    color: Colors.brand.primary,
    textAlign: 'center',
  },
});
