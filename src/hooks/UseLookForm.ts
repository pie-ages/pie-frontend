import { useEffect, useRef, useState } from 'react';

import { MOCK_LOOK_SUGGESTIONS } from '@/mocks/wardrobe';
import { MAX_LOOK_PIECES, type LookDraft, type WardrobePiece } from '@/types/look';

export function useLookForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<WardrobePiece[]>([]);
  const [suggestion, setSuggestion] = useState<WardrobePiece[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<'save' | 'suggest' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionIndex = useRef(0);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function togglePiece(piece: WardrobePiece) {
    if (operation !== null) return;
    setError(null);
    setItems((current) => {
      const exists = current.some((item) => item.id === piece.id);
      if (exists) return current.filter((item) => item.id !== piece.id);
      if (current.length >= MAX_LOOK_PIECES) return current;
      return [...current, piece];
    });
  }

  function simulate(kind: 'save' | 'suggest', action: () => void) {
    if (operation !== null) return;
    setError(null);
    setOperation(kind);
    timer.current = setTimeout(() => {
      try {
        action();
      } catch {
        setError('Não foi possível concluir. Tente novamente.');
      } finally {
        timer.current = null;
        setOperation(null);
      }
    }, 600);
  }

  function requestSuggestion() {
    simulate('suggest', () => {
      const next = MOCK_LOOK_SUGGESTIONS[suggestionIndex.current % MOCK_LOOK_SUGGESTIONS.length];
      suggestionIndex.current += 1;
      setSuggestion(next.slice(0, MAX_LOOK_PIECES));
    });
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    setItems([...suggestion]);
    setSuggestion(null);
    setError(null);
  }

  function saveLook(onSuccess: (draft: LookDraft) => void) {
    if (!items.length) {
      setError('Adicione pelo menos uma peça ao look.');
      return;
    }
    if (!name.trim()) {
      setError('Informe o nome do look.');
      return;
    }
    const draft: LookDraft = {
      name: name.trim(),
      description: description.trim(),
      items: [...items],
    };
    simulate('save', () => onSuccess(draft));
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
