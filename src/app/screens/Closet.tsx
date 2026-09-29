import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchWardrobeItems } from '@/api/wardrobe';
import CategoryRow from '@/components/CategoryRow';
import type { ClosetData } from '@/mocks/closetMocks';

export default function ClosetScreen() {
  const [data, setData] = useState<ClosetData | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'empty'>('loading');

  const loadData = useCallback(() => {
    let isActive = true;
    setStatus('loading');

    fetchWardrobeItems()
      .then((items) => {
        if (!isActive) return;
        const grouped = new Map<string, ClosetData['rows'][number]>();
        items.forEach((item) => {
          const category = item.category || 'Outros';
          const current = grouped.get(category) ?? {
            id: category,
            title: category,
            items: [],
            hasNext: false,
          };
          current.items.push({
            id: item.id,
            name: item.name || 'Peça',
            imageUrl: item.imageUrl ?? '',
          });
          grouped.set(category, current);
        });
        const rows = [...grouped.values()];
        setData({ rows });
        setStatus(rows.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        if (isActive) setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(loadData);

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
        <TouchableOpacity onPress={loadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Closet</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => router.push('/screens/AddPieceScreen')}
            accessibilityRole="button"
            accessibilityLabel="Adicionar peça"
          >
            <Feather name="plus" size={22} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
            <Feather name="user" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {status === 'empty' ? (
          <View style={styles.centerContainer}>
            <Text style={styles.statusText}>O seu guarda-roupa está vazio.</Text>
          </View>
        ) : (
          data?.rows.map((row) => <CategoryRow key={row.id} data={row} />)
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  iconText: {
    fontSize: 18,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
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
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#5A2A2A',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
