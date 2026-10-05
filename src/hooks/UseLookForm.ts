import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { lookFormSchema, type LookFormData } from '@/schemas/lookSchema';
import {
  createLook,
  fetchLookSuggestion,
  uploadLookImage,
  type LookImageAsset,
} from '@/services/looks';
import { MAX_LOOK_PIECES, type WardrobePiece } from '@/types/Look';

export function useLookForm() {
  const [suggestion, setSuggestion] = useState<WardrobePiece[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<'save' | 'suggest' | null>(null);
  const busyRef = useRef(false);
  const createdLookId = useRef<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<LookFormData>({
    resolver: zodResolver(lookFormSchema),
    defaultValues: { title: '', occasion: '', items: [] },
  });
  const items = useWatch({ control, name: 'items' });

  function setItems(next: WardrobePiece[]) {
    setValue('items', next);
    clearErrors('items');
  }

  function togglePiece(piece: WardrobePiece) {
    if (busyRef.current) return;
    setError(null);
    const current = getValues('items');
    if (current.some((item) => item.id === piece.id)) {
      setItems(current.filter((item) => item.id !== piece.id));
    } else if (current.length < MAX_LOOK_PIECES) {
      setItems([...current, piece]);
    }
  }

  async function requestSuggestion() {
    if (busyRef.current) return;
    busyRef.current = true;
    setError(null);
    setOperation('suggest');
    try {
      const result = await fetchLookSuggestion();
      setSuggestion(result.slice(0, MAX_LOOK_PIECES));
    } catch {
      setError('Não foi possível gerar uma sugestão. Tente novamente.');
    } finally {
      setOperation(null);
      busyRef.current = false;
    }
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    setItems(suggestion.slice(0, MAX_LOOK_PIECES));
    setSuggestion(null);
    setError(null);
  }

  async function saveLook(image: LookImageAsset | null, onSuccess: () => void) {
    if (busyRef.current) return;

    await handleSubmit(async ({ title, occasion, items: pieces }) => {
      busyRef.current = true;
      setError(null);
      setOperation('save');
      try {
        let lookId = createdLookId.current;
        if (!lookId) {
          const look = await createLook({
            title,
            occasion: occasion || undefined,
            wardrobeItemIds: pieces
              .map((item) => item.wardrobeItemId)
              .filter((id): id is string => Boolean(id)),
            productIds: pieces
              .filter((item) => !item.wardrobeItemId && item.productId)
              .map((item) => item.productId as string),
          });
          lookId = look.id;
          createdLookId.current = lookId;
        }
        if (image) {
          await uploadLookImage(lookId, image);
        }
        onSuccess();
      } catch (cause) {
        const message = createdLookId.current
          ? 'O look foi criado, mas não foi possível enviar a foto.'
          : 'Não foi possível criar o look.';
        const detail = cause instanceof Error ? cause.message : 'Tente novamente.';
        setError(`${message} ${detail}`);
      } finally {
        setOperation(null);
        busyRef.current = false;
      }
    })();
  }

  return {
    control,
    items,
    suggestion,
    error: error ?? errors.items?.message ?? null,
    operation,
    togglePiece,
    requestSuggestion,
    acceptSuggestion,
    dismissSuggestion: () => setSuggestion(null),
    saveLook,
  };
}
