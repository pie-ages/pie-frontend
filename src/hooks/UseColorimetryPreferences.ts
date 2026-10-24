import { useCallback, useEffect, useRef, useState } from 'react';

import type { ColorimetryPreferences } from '@/schemas/colorimetrySchema';
import { ApiError } from '@/services/client';
import { analyzeColorimetry, updateFavoriteColors } from '@/services/preferences';
import type { WardrobeImageAsset } from '@/services/wardrobe';

export type ColorimetryStatus = 'loading' | 'success' | 'error';

export function useColorimetryPreferences(photo: WardrobeImageAsset | null, minimumLoadingMs = 0) {
  const [preferences, setPreferences] = useState<ColorimetryPreferences | null>(null);
  const [status, setStatus] = useState<ColorimetryStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!photo) return;

    let isActive = true;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    const delay = new Promise<void>((resolve) => {
      timer = setTimeout(resolve, minimumLoadingMs);
    });

    Promise.all([analyzeColorimetry(photo, controller.signal), delay])
      .then(([data]) => {
        if (!isActive) return;
        setPreferences(data);
        setStatus('success');
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setErrorMessage(error instanceof ApiError ? (error.serverMessage ?? null) : null);
        setStatus('error');
      });

    return () => {
      isActive = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [attempt, photo, minimumLoadingMs]);

  const retry = useCallback(() => {
    setSaveError(null);
    setErrorMessage(null);
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

  return { preferences, status, errorMessage, retry, isSaving, saveError, saveFavoriteColors };
}
