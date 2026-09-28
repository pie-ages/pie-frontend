import { useRef, useState } from 'react';

import { createLook, fetchLookSuggestion, uploadLookImage, type LookImageAsset } from '@/api/looks';
import { MAX_LOOK_PIECES, type WardrobePiece } from '@/types/look';

export function useLookForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<WardrobePiece[]>([]);
  const [suggestion, setSuggestion] = useState<WardrobePiece[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<'save' | 'suggest' | null>(null);
  const busyRef = useRef(false);
  const createdLookId = useRef<string | null>(null);

  function togglePiece(piece: WardrobePiece) {
    if (busyRef.current) return;
    setError(null);
    setItems((current) => {
      const exists = current.some((item) => item.id === piece.id);
      if (exists) return current.filter((item) => item.id !== piece.id);
      if (current.length >= MAX_LOOK_PIECES) return current;
      return [...current, piece];
    });
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
    if (!items.length) {
      setError('Adicione pelo menos uma peça ao look.');
      return;
    }
    if (!name.trim()) {
      setError('Informe o nome do look.');
      return;
    }
    busyRef.current = true;
    setError(null);
    setOperation('save');
    try {
      let lookId = createdLookId.current;
      if (!lookId) {
        const look = await createLook({
          title: name.trim(),
          description: description.trim(),
          wardrobeItemIds: items
            .map((item) => item.wardrobeItemId)
            .filter((id): id is string => Boolean(id)),
          productIds: items
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
    } catch {
      setError('Não foi possível salvar o look. Tente novamente.');
    } finally {
      setOperation(null);
      busyRef.current = false;
    }
  }

  return {
    name,
    description,
    items,
    suggestion,
    error,
    operation,
    updateName: (value: string) => {
      setName(value);
      setError(null);
    },
    updateDescription: setDescription,
    togglePiece,
    requestSuggestion,
    acceptSuggestion,
    dismissSuggestion: () => setSuggestion(null),
    saveLook,
  };
}
