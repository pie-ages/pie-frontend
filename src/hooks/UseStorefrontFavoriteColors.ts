import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { fetchPreferences } from '@/services/preferences';

const NO_FAVORITE_COLORS: readonly string[] = [];

export function useStorefrontFavoriteColors(): readonly string[] {
  const { isAuthenticated, userId } = useAuth();
  const [favorites, setFavorites] = useState<{
    userId: string | null;
    colors: readonly string[];
  } | null>(null);
  const enabled = isAuthenticated && Platform.OS !== 'web';

  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        setFavorites(null);
        return;
      }

      const controller = new AbortController();
      fetchPreferences(controller.signal)
        .then(({ favoriteColors }) => {
          if (!controller.signal.aborted) setFavorites({ userId, colors: favoriteColors });
        })
        .catch(() => {
          if (!controller.signal.aborted) setFavorites(null);
        });

      return () => controller.abort();
    }, [enabled, userId]),
  );

  return enabled && favorites?.userId === userId ? favorites.colors : NO_FAVORITE_COLORS;
}
