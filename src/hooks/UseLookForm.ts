import { useEffect, useRef, useState } from 'react';

import { MOCK_LOOK_SUGGESTIONS } from '@/mocks/looks';
import { toggleLookPiece, validateLook, type LookDraft, type LookPiece } from '@/types/Look';

export function useLookForm() {
  const [name, setName] = useState('');
  const [items, setItems] = useState<LookPiece[]>([]);
  const [suggestion, setSuggestion] = useState<LookPiece[] | null>(null);
  const [savedLook, setSavedLook] = useState<LookDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<'suggest' | 'save' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionIndex = useRef(0);

  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  function updateName(value: string) {
    setName(value);
    setError(null);
  }

  function togglePiece(piece: LookPiece) {
    if (timer.current !== null) return;
    setItems((current) => toggleLookPiece(current, piece));
    setError(null);
  }

  function simulateOperation(kind: 'suggest' | 'save', action: () => void) {
    if (timer.current !== null) return;
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
    simulateOperation('suggest', () => {
      setSuggestion(MOCK_LOOK_SUGGESTIONS[suggestionIndex.current % MOCK_LOOK_SUGGESTIONS.length]);
      suggestionIndex.current += 1;
    });
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    setItems([...suggestion]);
    setSuggestion(null);
    setError(null);
  }

  function saveLook() {
    const draft = { name: name.trim(), items: [...items] };
    const validationError = validateLook(draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    simulateOperation('save', () => setSavedLook(draft));
  }

  function newLook() {
    setName('');
    setItems([]);
    setSuggestion(null);
    setSavedLook(null);
    setError(null);
  }

  return {
    name,
    items,
    suggestion,
    savedLook,
    error,
    operation,
    updateName,
    togglePiece,
    requestSuggestion,
    acceptSuggestion,
    saveLook,
    newLook,
    dismissSuggestion: () => setSuggestion(null),
    editSavedLook: () => setSavedLook(null),
  };
}
