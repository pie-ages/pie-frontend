import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LookFocusCarousel } from '@/components/LookFocusCarousel';
import { LookFocusInfo } from '@/components/LookFocusInfo';
import { LooksEmptyState } from '@/components/LooksEmptyState';
import { LooksErrorState } from '@/components/LooksErrorState';
import { LooksLoadingState } from '@/components/LooksLoadingState';
import { LooksToolBar } from '@/components/LooksToolBar';
import { LooksViewModeToggle } from '@/components/LooksViewModeToggle';
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

  const focusBottomPadding = insets.bottom + BottomTabInset + Spacing.three;
  // Altura livre para os cards depois do título, para a tela não precisar de scroll vertical.
  const maxCardHeight =
    focusAreaHeight - Spacing.three - focusBottomPadding - infoHeight - Spacing.three;

  // Preserva o look visualizado na rota para a futura integração com o Grid Mode.
  const handleChangeViewMode = (mode: LooksViewMode) => {
    setViewMode(mode);
    router.setParams({ viewMode: mode, lookId: activeLook?.id });
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <LooksToolBar />
        <LooksViewModeToggle value={viewMode} onChange={handleChangeViewMode} />
      </View>

      <View style={styles.body}>
        {status === 'loading' && <LooksLoadingState />}
        {status === 'error' && <LooksErrorState onRetry={retry} />}
        {status === 'empty' && <LooksEmptyState />}
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
              <View onLayout={(event) => setInfoHeight(event.nativeEvent.layout.height)}>
                <LookFocusInfo look={activeLook} />
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
    paddingTop: 8,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
  },
  focusContent: {
    flex: 1,
    gap: Spacing.three,
    paddingTop: Spacing.three,
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
