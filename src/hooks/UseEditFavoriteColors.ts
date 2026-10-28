import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { isSessionExpiredError } from '@/services/client';
import { fetchPreferences, updateFavoriteColors } from '@/services/preferences';

export const MAX_FAVORITE_COLORS = 4;

const LOAD_ERROR = 'Não foi possível carregar suas cores favoritas.';
const SAVE_ERROR = 'Não foi possível salvar suas cores favoritas. Tente novamente.';

export function useEditFavoriteColors() {
  const [slots, setSlots] = useState<(string | null)[]>(Array(MAX_FAVORITE_COLORS).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchPreferences(controller.signal)
      .then(({ favoriteColors }) => {
        if (controller.signal.aborted) return;
        setSlots(
          Array.from(
            { length: Math.max(MAX_FAVORITE_COLORS, favoriteColors.length) },
            (_, index) => favoriteColors[index] ?? null,
          ),
        );
      })
      .catch((loadError: unknown) => {
        if (controller.signal.aborted) return;
        if (isSessionExpiredError(loadError)) setSessionExpired(true);
        else setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const selectColor = useCallback(
    (index: number, color: string) => {
      const normalizedColor = color.toUpperCase();
      const isDuplicate = slots.some(
        (slot, slotIndex) => slotIndex !== index && slot?.toUpperCase() === normalizedColor,
      );

      if (isDuplicate) {
        setError('Essa cor já está nas suas favoritas.');
        return;
      }

      setError(null);
      setSlots((previous) =>
        previous.map((slot, slotIndex) => (slotIndex === index ? normalizedColor : slot)),
      );
    },
    [slots],
  );

  const removeColor = useCallback((index: number) => {
    setError(null);
    setSlots((previous) => previous.map((slot, slotIndex) => (slotIndex === index ? null : slot)));
  }, []);

  const colors = slots.filter((slot): slot is string => slot !== null);
  const canSave = !isLoading && !isSaving;

  const save = useCallback(async () => {
    if (!canSave) return;
    if (colors.length > MAX_FAVORITE_COLORS) {
      setError(
        `Você pode escolher no máximo ${MAX_FAVORITE_COLORS} cores favoritas. Remova as cores excedentes para salvar.`,
      );
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await updateFavoriteColors(colors);
      router.back();
    } catch (saveError) {
      if (isSessionExpiredError(saveError)) setSessionExpired(true);
      else setError(SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  }, [canSave, colors]);

  return { slots, isLoading, isSaving, error, sessionExpired, selectColor, removeColor, save };
}
