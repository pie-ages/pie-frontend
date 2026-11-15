import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { ScrollView, View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryRow } from '@/components/CategoryRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { BottomTabInset, Colors, Spacing } from '@/constants/Theme';
import { useWardrobeRows } from '@/hooks/UseWardrobeRows';
import type { WardrobePiece } from '@/types/Look';
import { confirmAction, showMessage } from '@/utils/confirm';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { status, rows, retry, loadMore, retryRow, removeItem } = useWardrobeRows();
  const isFirstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      void retry();
    }, [retry]),
  );

  async function handleRemoveItem(item: WardrobePiece) {
    const confirmed = await confirmAction({
      title: 'Remover do closet',
      message: `Deseja remover "${item.name}" do seu closet?`,
      confirmLabel: 'Remover',
    });
    if (!confirmed) return;

    try {
      await removeItem(item.id);
    } catch {
      showMessage('Não foi possível remover', 'Não foi possível remover a peça. Tente novamente.');
    }
  }

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
            title="Closet"
            actions={[
              {
                icon: 'plus',
                accessibilityLabel: 'Adicionar peça',
                onPress: () => router.push('/AddPiece'),
              },
            ]}
          />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <LoadingState text="Carregando seu closet..." />}
          {status === 'error' && (
            <ErrorState
              title="Não foi possível carregar o seu closet"
              subtitle="Verifique sua conexão e tente novamente."
              onRetry={() => void retry()}
            />
          )}
          {status === 'empty' && (
            <EmptyState
              icon={
                <MaterialCommunityIcons
                  name="wardrobe-outline"
                  size={36}
                  color={Colors.brand.primary}
                />
              }
              title="Seu closet está vazio"
              subtitle="Adicione suas peças favoritas para organizar seu guarda-roupa e montar looks."
              actionLabel="Adicionar peça"
              onAction={() => router.push('/AddPiece')}
            />
          )}
          {status === 'success' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: insets.bottom + BottomTabInset + Spacing.three },
              ]}
            >
              {rows.map((row) => (
                <CategoryRow
                  key={row.id}
                  data={row}
                  onEndReached={(rowId) => void loadMore(rowId)}
                  onRetry={(rowId) => void retryRow(rowId)}
                  onRemoveItem={(item) => void handleRemoveItem(item)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    minHeight: 0,
    width: '100%',
  },
  header: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  body: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingTop: 16,
  },
});
