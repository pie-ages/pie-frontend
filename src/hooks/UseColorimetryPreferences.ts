import { useCallback, useEffect, useState } from 'react';

import { fetchPreferences, updateFavoriteColors } from '@/api/preferences';
import type { ColorimetryPreferences } from '@/types/colorimetry';

export type ColorimetryStatus = 'loading' | 'success' | 'error';

const EMPTY_FAVORITE_COLOR = '#999999';
const FAVORITE_SLOTS = 4;

function normalizeFavorites(colors: string[]): string[] {
  if (colors.length === 0) return Array(FAVORITE_SLOTS).fill(EMPTY_FAVORITE_COLOR);
  return colors;
}

export function useColorimetryPreferences() {
  const [preferences, setPreferences] = useState<ColorimetryPreferences | null>(null);
  const [status, setStatus] = useState<ColorimetryStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    fetchPreferences()
      .then((data) => {
        if (!isActive) return;
        setPreferences({
          ...data,
          favoriteColors: normalizeFavorites(data.favoriteColors),
        });
        setStatus('success');
      })
      .catch(() => {
        if (isActive) setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((v) => v + 1);
  }, []);

  const saveFavoriteColors = useCallback(
    async (colors: string[]): Promise<boolean> => {
      if (isSaving) return false;
      setIsSaving(true);
      setSaveError(null);

      try {
        const updated = await updateFavoriteColors(colors);
        if (updated) {
          setPreferences(updated);
        } else {
          setPreferences((prev) => (prev ? { ...prev, favoriteColors: colors } : prev));
        }
        return true;
      } catch {
        setSaveError('Não foi possível salvar. Tente novamente.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving],
  );

  return { preferences, status, retry, isSaving, saveError, saveFavoriteColors };
}
