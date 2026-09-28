import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { LookFocusCarousel } from '@/components/LookFocusCarousel';
import { LookFocusInfo } from '@/components/LookFocusInfo';
import { LookFocusPagination } from '@/components/LookFocusPagination';
import { LooksViewModeToggle } from '@/components/LooksViewModeToggle';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { BottomTabInset, Colors, Spacing } from '@/constants/Theme';
import { useLookFocusNavigation } from '@/hooks/UseLookFocusNavigation';
import { useLooksCollection } from '@/hooks/UseLooksCollection';
import { MOCK_INITIAL_LOOK_ID } from '@/mocks/looks';
import type { LooksViewMode } from '@/types/look';

export default function LooksScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ lookId?: string; viewMode?: string }>();
  const [focusAreaHeight, setFocusAreaHeight] = useState(0);
  const [infoHeight, setInfoHeight] = useState(0);
  const [viewMode, setViewMode] = useState<LooksViewMode>(
    params.viewMode === 'grid' ? 'grid' : 'focus',
  );
  const { status, looks, retry } = useLooksCollection();
  const { activeIndex, activeLook, goTo } = useLookFocusNavigation(
    looks,
    params.lookId ?? MOCK_INITIAL_LOOK_ID,
  );

  const focusBottomPadding = insets.bottom + BottomTabInset + Spacing.six;
  const maxCardHeight =
    focusAreaHeight - Spacing.three - focusBottomPadding - infoHeight - Spacing.three;

  const handleChangeViewMode = (mode: LooksViewMode) => {
    setViewMode(mode);
    router.setParams({ viewMode: mode, lookId: activeLook?.id ?? undefined });
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ScreenToolBar
          title="Meus Looks"
          actions={[{ icon: 'plus', accessibilityLabel: 'Criar look' }]}
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
        {status === 'success' && viewMode === 'focus' && (
          <View
            style={[styles.focusContent, { paddingBottom: focusBottomPadding }]}
            onLayout={(event) => setFocusAreaHeight(event.nativeEvent.layout.height)}
          >
            <LookFocusCarousel
              looks={looks}
              activeIndex={activeIndex}
              onChangeIndex={goTo}
              maxHeight={maxCardHeight}
            />
            {activeLook && (
              <View
                style={styles.focusFooter}
                onLayout={(event) => setInfoHeight(event.nativeEvent.layout.height)}
              >
                <LookFocusInfo look={activeLook} />
                <LookFocusPagination count={looks.length} activeIndex={activeIndex} />
              </View>
            )}
          </View>
        )}
        {status === 'success' && viewMode === 'grid' && (
          <View style={styles.gridPlaceholder}>
            <Text style={styles.gridPlaceholderText}>O Grid Mode será construído em breve.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    gap: 12,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
  },
  focusContent: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  focusFooter: {
    gap: Spacing.two,
  },
  gridPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  gridPlaceholderText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
