import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryRow from '@/components/CategoryRow';
import { ScreenToolBar } from '@/components/ScreenToolBar';
import { Spacing } from '@/constants/Theme';
import { useWardrobeRows } from '@/hooks/UseWardrobeRows';

export default function ClosetScreen() {
  const { status, rows, retry, loadMore, retryRow } = useWardrobeRows();

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.statusText}>A carregar o seu guarda-roupa...</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.statusText}>Ocorreu um erro ao carregar as peças.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.7}
          onPress={() => void retry()}
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ScreenToolBar
          title="Closet"
          actions={[{ icon: 'plus', accessibilityLabel: 'Adicionar peça' }]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, status === 'empty' && styles.emptyContent]}
      >
        {status === 'empty' ? (
          <View style={styles.centerContainer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
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
