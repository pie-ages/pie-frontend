import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchPreferences, updateFavoriteColors } from '@/api/preferences';
import type { ColorimetryPreferences } from '@/types/colorimetry';

export type ColorimetryStatus = 'loading' | 'success' | 'error';

export function useColorimetryPreferences() {
  const [preferences, setPreferences] = useState<ColorimetryPreferences | null>(null);
  const [status, setStatus] = useState<ColorimetryStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    fetchPreferences()
      .then((data) => {
        if (!isActive) return;
        setPreferences(data);
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

  const saveFavoriteColors = useCallback(async (colors: string[]): Promise<boolean> => {
    if (savingRef.current) return false;
    savingRef.current = true;
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
      savingRef.current = false;
      setIsSaving(false);
    }
  }, []);

  return { preferences, status, retry, isSaving, saveError, saveFavoriteColors };
}
