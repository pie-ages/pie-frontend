import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryRow } from '@/components/CategoryRow';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { BottomTabInset, Spacing } from '@/constants/Theme';
import { useWardrobeRows } from '@/hooks/UseWardrobeRows';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { status, rows, retry, loadMore, retryRow } = useWardrobeRows();
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

  if (status === 'loading') {
    return (
      <View
        style={[styles.centerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.statusText}>A carregar o seu guarda-roupa...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View
        style={[styles.centerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <Text style={styles.statusText}>Ocorreu um erro ao carregar as peças.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.7}
          onPress={() => void retry()}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
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
                onPress: () => router.push('/screens/AddPieceScreen'),
              },
            ]}
          />
        </View>

        <View style={styles.body}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              status === 'empty' && styles.emptyContent,
              { paddingBottom: insets.bottom + BottomTabInset + Spacing.three },
            ]}
          >
            {status === 'empty' ? (
              <View style={styles.centerFlex}>
                <Text style={styles.statusText}>O seu guarda-roupa está vazio.</Text>
              </View>
            ) : (
              rows.map((row) => (
                <CategoryRow
                  key={row.id}
                  data={row}
                  onEndReached={(rowId) => void loadMore(rowId)}
                  onRetry={(rowId) => void retryRow(rowId)}
                />
              ))
            )}
          </ScrollView>
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
  emptyContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  centerFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#111827',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
