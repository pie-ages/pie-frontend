import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductActionButton } from '@/components/ProductActionButton';
import { Spacing } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStyle } from '@/contexts/UserStyleContext';
import { getIdentifiedStyle, StyleSessionError } from '@/services/style';
import { IDENTIFIED_STYLE_INFO } from '@/types/IdentifiedStyle';

export default function MyStyleScreen() {
  const insets = useSafeAreaInsets();
  const { identifiedStyle, setIdentifiedStyle } = useUserStyle();
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let active = true;

    getIdentifiedStyle()
      .then((style) => {
        if (!active) return;
        if (style) setIdentifiedStyle(style);
        else {
          setIdentifiedStyle(null);
          router.replace('/StyleQuiz');
        }
      })
      .catch(async (error: unknown) => {
        if (!active) return;
        if (error instanceof StyleSessionError) {
          await signOut();
          router.replace('/Login');
          return;
        }
        setLoadError(
          error instanceof Error ? error.message : 'Não foi possível carregar seu estilo.',
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadCount, setIdentifiedStyle, signOut]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text>{loadError}</Text>
        <ProductActionButton
          title="Tentar novamente"
          onPress={() => {
            setLoadError(null);
            setIsLoading(true);
            setReloadCount((count) => count + 1);
          }}
        />
      </View>
    );
  }

  if (!identifiedStyle) return null;

  const info = IDENTIFIED_STYLE_INFO[identifiedStyle];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom + Spacing.four, backgroundColor: info.background },
      ]}
    >
      <Text style={[styles.title, { color: '#24312E' }]}>
        Seu estilo é <Text style={[styles.highlight, { color: info.highlight }]}>{info.label}</Text>
      </Text>

      <Text style={[styles.description, { color: '#24312E' }]}>{info.description}</Text>

      <ProductActionButton
        title="Continuar"
        style={styles.button}
        onPress={() => router.push('/StyleSelection')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.four },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: Spacing.five,
  },
  highlight: {
    fontWeight: '800',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.three,
  },
  button: {
    marginTop: Spacing.two,
  },
});
