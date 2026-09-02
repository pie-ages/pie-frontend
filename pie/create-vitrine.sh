#!/bin/bash
set -e

mkdir -p src/features/vitrine/components
mkdir -p src/features/vitrine/hooks
mkdir -p src/features/vitrine/mocks
mkdir -p src/features/vitrine/screens
mkdir -p src/features/vitrine/types
mkdir -p src/features/vitrine/utils

cat > "src/features/vitrine/types/product.ts" << 'FILE_EOF'
export type Store = {
  name: string;
  logoUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  /** `null` representa um produto sem imagem cadastrada. */
  imageUrl: string | null;
  purchaseUrl: string;
  store: Store;
};

export type FilterOption = {
  id: string;
  label: string;
};
FILE_EOF

cat > "src/features/vitrine/mocks/products.ts" << 'FILE_EOF'
import type { FilterOption, Product } from '@/features/vitrine/types/product';

/**
 * Dados mockados usados para montar o layout da vitrine sem depender do
 * backend. A integração real com a API de listagem acontece na task
 * PIE-45 (Integrar vitrine com a API de listagem e scroll infinito).
 */
export const MOCK_FILTERS: FilterOption[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'romantico', label: 'Romântico' },
  { id: 'criativo', label: 'Criativo' },
  { id: 'casual', label: 'Casual' },
  { id: 'classico', label: 'Clássico' },
  { id: 'minimalista', label: 'Minimalista' },
  { id: 'elegante', label: 'Elegante' },
];

const LOJA_PIE: Product['store'] = {
  name: 'Loja Piê',
  logoUrl: 'https://placehold.co/64x64/6E263D/FFFFFF.png?text=P',
};

const LOJA_VERDE: Product['store'] = {
  name: 'Verde Studio',
  logoUrl: 'https://placehold.co/64x64/2F6E4E/FFFFFF.png?text=V',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul',
    store: LOJA_PIE,
  },
  {
    id: '2',
    name: 'Vestido Verde',
    price: 199.0,
    imageUrl: 'https://picsum.photos/seed/pie-vestido-verde/400/500',
    purchaseUrl: 'https://example.com/produtos/vestido-verde',
    store: LOJA_VERDE,
  },
  {
    id: '3',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul-2/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-2',
    store: LOJA_PIE,
  },
  {
    id: '4',
    name: 'Camiseta azul',
    price: 199.9,
    imageUrl: 'https://picsum.photos/seed/pie-camiseta-azul-3/400/500',
    purchaseUrl: 'https://example.com/produtos/camiseta-azul-3',
    store: LOJA_PIE,
  },
  {
    id: '5',
    name: 'Conjunto alfaiataria blazer e calça off-white para eventos',
    price: 459.5,
    imageUrl: null,
    purchaseUrl: 'https://example.com/produtos/conjunto-alfaiataria',
    store: LOJA_VERDE,
  },
  {
    id: '6',
    name: 'Bolsa de couro',
    price: 349.0,
    imageUrl: 'https://picsum.photos/seed/pie-bolsa-couro/400/500',
    purchaseUrl: 'https://example.com/produtos/bolsa-couro',
    store: LOJA_PIE,
  },
];
FILE_EOF

cat > "src/features/vitrine/utils/format-price.ts" << 'FILE_EOF'
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}
FILE_EOF

cat > "src/features/vitrine/hooks/use-vitrine-catalog.ts" << 'FILE_EOF'
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { MOCK_PRODUCTS } from '@/features/vitrine/mocks/products';
import type { Product } from '@/features/vitrine/types/product';

export type VitrineStatus = 'loading' | 'success' | 'error' | 'empty';

const FORCEABLE_STATUSES = ['loading', 'error', 'empty'] as const;
type ForceableStatus = (typeof FORCEABLE_STATUSES)[number];

/**
 * Permite forçar um estado específico via query param para que carregando,
 * erro e vazio possam ser navegados e revisados sem depender de timing ou
 * do backend, ex.: `/vitrine?status=loading`, `/vitrine?status=error`,
 * `/vitrine?status=empty`. Sem o param, a tela simula uma busca com sucesso.
 */
function resolveForcedStatus(value: string | string[] | undefined): ForceableStatus | null {
  const normalized = Array.isArray(value) ? value[0] : value;
  return (FORCEABLE_STATUSES as readonly string[]).includes(normalized ?? '')
    ? (normalized as ForceableStatus)
    : null;
}

function fetchMockProducts(forcedStatus: ForceableStatus | null): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    // Mantém o estado de carregamento indefinidamente para revisão.
    if (forcedStatus === 'loading') {
      return;
    }

    setTimeout(() => {
      if (forcedStatus === 'error') {
        reject(new Error('Não foi possível carregar a vitrine.'));
        return;
      }

      resolve(forcedStatus === 'empty' ? [] : MOCK_PRODUCTS);
    }, 600);
  });
}

export function useVitrineCatalog() {
  const { status: statusParam } = useLocalSearchParams<{ status?: string }>();
  const forcedStatus = resolveForcedStatus(statusParam);

  const [status, setStatus] = useState<VitrineStatus>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(() => {
    setStatus('loading');

    fetchMockProducts(forcedStatus)
      .then((result) => {
        setProducts(result);
        setStatus(result.length === 0 ? 'empty' : 'success');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [forcedStatus]);

  useEffect(() => {
    load();
  }, [load, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { status, products, retry };
}
FILE_EOF

cat > "src/features/vitrine/components/vitrine-search-bar.tsx" << 'FILE_EOF'
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const PLACEHOLDER_COLOR = '#8C8C8C';
const ICON_COLOR = '#6B6B6B';

export function VitrineSearchBar() {
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color={ICON_COLOR} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Procure por produtos ou lojas"
        placeholderTextColor={PLACEHOLDER_COLOR}
        returnKeyType="search"
        autoCorrect={false}
      />

      <Feather name="mic" size={18} color={ICON_COLOR} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F3',
    paddingHorizontal: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1F1F1F',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-filter-chips.tsx" << 'FILE_EOF'
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { MOCK_FILTERS } from '@/features/vitrine/mocks/products';

type VitrineFilterChipsProps = {
  onSelect?: (filterId: string) => void;
};

export function VitrineFilterChips({ onSelect }: VitrineFilterChipsProps) {
  const [selectedId, setSelectedId] = useState(MOCK_FILTERS[0].id);

  function handleSelect(filterId: string) {
    setSelectedId(filterId);
    onSelect?.(filterId);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {MOCK_FILTERS.map((filter) => {
        const isSelected = filter.id === selectedId;

        return (
          <Pressable
            key={filter.id}
            onPress={() => handleSelect(filter.id)}
            style={({ pressed }) => [
              styles.chip,
              isSelected ? styles.chipSelected : styles.chipDefault,
              pressed && styles.chipPressed,
            ]}>
            <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelDefault]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDefault: {
    backgroundColor: '#F3EBEE',
  },
  chipSelected: {
    backgroundColor: '#6E263D',
  },
  chipPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelDefault: {
    color: '#6E263D',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-product-card.tsx" << 'FILE_EOF'
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatPrice } from '@/features/vitrine/utils/format-price';
import type { Product } from '@/features/vitrine/types/product';

type VitrineProductCardProps = {
  product: Product;
};

export function VitrineProductCard({ product }: VitrineProductCardProps) {
  function handlePress() {
    Linking.openURL(product.purchaseUrl).catch(() => {
      // Falha silenciosa: sem tratamento de erro de navegação externa nesta task.
    });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.imageContainer}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Feather name="image" size={28} color="#B0B4BA" />
          </View>
        )}

        <Image source={{ uri: product.store.logoUrl }} style={styles.storeLogo} contentFit="cover" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#F0F0F3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeLogo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  info: {
    paddingTop: 8,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-loading-state.tsx" << 'FILE_EOF'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export function VitrineLoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6E263D" />
      <Text style={styles.text}>Carregando produtos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 64,
  },
  text: {
    fontSize: 14,
    color: '#60646C',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-error-state.tsx" << 'FILE_EOF'
import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type VitrineErrorStateProps = {
  onRetry: () => void;
};

export function VitrineErrorState({ onRetry }: VitrineErrorStateProps) {
  return (
    <View style={styles.container}>
      <Feather name="alert-circle" size={32} color="#B3261E" />
      <Text style={styles.title}>Não foi possível carregar a vitrine</Text>
      <Text style={styles.subtitle}>Verifique sua conexão e tente novamente.</Text>

      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6E263D',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-empty-state.tsx" << 'FILE_EOF'
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

export function VitrineEmptyState() {
  return (
    <View style={styles.container}>
      <Feather name="shopping-bag" size={32} color="#B0B4BA" />
      <Text style={styles.title}>Nenhum produto encontrado</Text>
      <Text style={styles.subtitle}>Tente ajustar os filtros ou volte mais tarde.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#60646C',
    textAlign: 'center',
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-product-grid.tsx" << 'FILE_EOF'
import { FlatList, StyleSheet } from 'react-native';

import { VitrineProductCard } from '@/features/vitrine/components/vitrine-product-card';
import type { Product } from '@/features/vitrine/types/product';

type VitrineProductGridProps = {
  products: Product[];
  contentBottomInset: number;
};

export function VitrineProductGrid({ products, contentBottomInset }: VitrineProductGridProps) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, { paddingBottom: contentBottomInset }]}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <VitrineProductCard product={item} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingTop: 16,
  },
  row: {
    gap: 12,
  },
});
FILE_EOF

cat > "src/features/vitrine/components/vitrine-header.tsx" << 'FILE_EOF'
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from 'react-native';

export function VitrineHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vitrine</Text>

      <View style={styles.actions}>
        <View style={styles.iconButton}>
          <Feather name="clipboard" size={18} color="#1F1F1F" />
        </View>

        <View style={[styles.iconButton, styles.profileButton]}>
          <Feather name="user" size={18} color="#6E263D" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F3',
  },
  profileButton: {
    backgroundColor: '#F3EBEE',
  },
});
FILE_EOF

cat > "src/features/vitrine/screens/vitrine-screen.tsx" << 'FILE_EOF'
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VitrineEmptyState } from '@/features/vitrine/components/vitrine-empty-state';
import { VitrineErrorState } from '@/features/vitrine/components/vitrine-error-state';
import { VitrineFilterChips } from '@/features/vitrine/components/vitrine-filter-chips';
import { VitrineHeader } from '@/features/vitrine/components/vitrine-header';
import { VitrineLoadingState } from '@/features/vitrine/components/vitrine-loading-state';
import { VitrineProductGrid } from '@/features/vitrine/components/vitrine-product-grid';
import { VitrineSearchBar } from '@/features/vitrine/components/vitrine-search-bar';
import { useVitrineCatalog } from '@/features/vitrine/hooks/use-vitrine-catalog';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export function VitrineScreen() {
  const insets = useSafeAreaInsets();
  const { status, products, retry } = useVitrineCatalog();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <VitrineHeader />
          <VitrineSearchBar />
          <VitrineFilterChips />
        </View>

        <View style={styles.body}>
          {status === 'loading' && <VitrineLoadingState />}
          {status === 'error' && <VitrineErrorState onRetry={retry} />}
          {status === 'empty' && <VitrineEmptyState />}
          {status === 'success' && (
            <VitrineProductGrid
              products={products}
              contentBottomInset={insets.bottom + BottomTabInset + Spacing.three}
            />
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
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  header: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  body: {
    flex: 1,
  },
});
FILE_EOF

cat > "src/app/vitrine.tsx" << 'FILE_EOF'
import { VitrineScreen } from '@/features/vitrine/screens/vitrine-screen';

export default function Vitrine() {
  return <VitrineScreen />;
}
FILE_EOF

echo "Todos os arquivos da vitrine foram criados com sucesso!"