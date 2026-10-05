import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchPreferences, updateFavoriteColors } from '@/services/preferences';
import type { ColorimetryPreferences } from '@/types/Colorimetry';

export type ColorimetryStatus = 'loading' | 'success' | 'error';

export function useColorimetryPreferences(enabled = true, minimumLoadingMs = 0) {
  const [preferences, setPreferences] = useState<ColorimetryPreferences | null>(null);
  const [status, setStatus] = useState<ColorimetryStatus>('loading');
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let isActive = true;
    let timer: ReturnType<typeof setTimeout>;
    const delay = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, minimumLoadingMs);
    });

    Promise.all([fetchPreferences(), delay])
      .then(([data]) => {
        if (!isActive) return;
        setPreferences(data);
        setStatus('success');
      })
      .catch(() => {
        if (isActive) setStatus('error');
      });

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [attempt, enabled, minimumLoadingMs]);

  const retry = useCallback(() => {
    setSaveError(null);
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
