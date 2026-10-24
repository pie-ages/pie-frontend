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
  const [pieceCount, setPieceCount] = useState<number | null>(null);
  const [slots, setSlots] = useState<(WardrobePiece | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<'save' | 'suggest' | null>(null);
  const busyRef = useRef(false);
  const createdLookId = useRef<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LookFormData>({
    resolver: zodResolver(lookFormSchema),
    defaultValues: { title: '', occasion: '', items: [] },
  });
  const items = useWatch({ control, name: 'items' });

  function updateSlots(next: (WardrobePiece | null)[]) {
    setSlots(next);
    setValue(
      'items',
      next.filter((item): item is WardrobePiece => item !== null),
    );
    clearErrors('items');
  }

  function choosePieceCount(count: number) {
    if (busyRef.current || count < 1 || count > MAX_LOOK_PIECES) return;
    setPieceCount(count);
    updateSlots(Array.from({ length: count }, (_, index) => slots[index] ?? null));
    setError(null);
  }

  function assignPiece(index: number, piece: WardrobePiece) {
    if (
      busyRef.current ||
      index < 0 ||
      index >= slots.length ||
      slots.some((item, slotIndex) => slotIndex !== index && item?.id === piece.id)
    ) {
      return;
    }
    const next = [...slots];
    next[index] = piece;
    updateSlots(next);
    setError(null);
  }

  function removePieceAt(index: number) {
    if (busyRef.current) return;
    const next = [...slots];
    next[index] = null;
    updateSlots(next);
    setError(null);
  }

  async function requestSuggestion(size = slots.filter((slot) => slot === null).length) {
    if (size === null || size === undefined) return;
    if (busyRef.current || size < 1) return;
    busyRef.current = true;
    setError(null);
    setOperation('suggest');
    try {
      const result = await fetchLookSuggestion();
      const suggestions = result.slice(0, size);
      if (suggestions.length === 0) {
        setError('Não há peças disponíveis para sugerir. Adicione peças ao seu closet.');
        return;
      }
      setSuggestion(suggestions);
    } catch {
      setError('Não foi possível gerar uma sugestão. Tente novamente.');
    } finally {
      setOperation(null);
      busyRef.current = false;
    }
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    const next = [...slots];
    const selectedIds = new Set(next.flatMap((item) => (item ? [item.id] : [])));
    const suggestions = suggestion.filter((item) => !selectedIds.has(item.id));
    let suggestionIndex = 0;
    for (let index = 0; index < next.length && suggestionIndex < suggestions.length; index += 1) {
      if (next[index] === null) {
        next[index] = suggestions[suggestionIndex];
        suggestionIndex += 1;
      }
    }
    updateSlots(next);
    setSuggestion(null);
    setError(null);
  }

  async function saveLook(image: LookImageAsset | null, onSuccess: () => void) {
    if (busyRef.current || pieceCount === null || items.length !== pieceCount) return;

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
    slots,
    pieceCount,
    isComplete: pieceCount !== null && items.length === pieceCount,
    suggestion,
    error: error ?? errors.items?.message ?? null,
    operation,
    choosePieceCount,
    assignPiece,
    removePieceAt,
    requestSuggestion,
    acceptSuggestion,
    dismissSuggestion: () => setSuggestion(null),
    saveLook,
  };
}
