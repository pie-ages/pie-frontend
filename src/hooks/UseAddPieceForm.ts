import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  ALLOWED_IMAGE_TYPES,
  addPieceSchema,
  type AddPieceFormData,
  type AddPieceFormInput,
} from '@/schemas/wardrobeSchema';
import {
  analyzeWardrobeImage,
  createWardrobeItem,
  type WardrobeImageAsset,
} from '@/services/wardrobe';

type AddPieceOperation = 'analyze' | 'submit' | null;

const ANALYZED_FIELDS = ['category', 'style', 'color'] as const;

export function useAddPieceForm() {
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [operation, setOperation] = useState<AddPieceOperation>(null);
  const busyRef = useRef(false);
  const analysisRef = useRef<AbortController | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<AddPieceFormInput, unknown, AddPieceFormData>({
    resolver: zodResolver(addPieceSchema),
    defaultValues: { name: '', category: '', style: '', color: '', image: null },
  });
  const image = useWatch({ control, name: 'image' });

  useEffect(() => () => analysisRef.current?.abort(), []);

  async function selectImage(value: WardrobeImageAsset) {
    if (busyRef.current && !analysisRef.current) return;
    analysisRef.current?.abort();
    const controller = new AbortController();
    analysisRef.current = controller;
    busyRef.current = true;
    setValue('image', value);
    clearErrors('image');
    ANALYZED_FIELDS.forEach((field) => setValue(field, ''));
    setError(null);
    setAnalysisError(null);
    setIsAnalyzed(false);
    setOperation('analyze');

    try {
      if (value.mimeType && !ALLOWED_IMAGE_TYPES.has(value.mimeType)) {
        throw new Error('Formato não suportado. Envie uma foto JPEG, PNG ou WebP.');
      }
      if (value.fileSize && value.fileSize > 3_932_160) {
        throw new Error('A foto deve ter no máximo 3,75 MB para análise. Envie outra foto.');
      }
      const result = await analyzeWardrobeImage(value, controller.signal);
      if (controller.signal.aborted) return;
      ANALYZED_FIELDS.forEach((field) => setValue(field, result[field]));
      clearErrors([...ANALYZED_FIELDS]);
      setIsAnalyzed(true);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setAnalysisError(
        requestError instanceof Error ? requestError.message : 'Não foi possível analisar a peça.',
      );
    } finally {
      if (!controller.signal.aborted && analysisRef.current === controller) {
        analysisRef.current = null;
        busyRef.current = false;
        setOperation(null);
      }
    }
  }

  async function submit(): Promise<boolean> {
    if (busyRef.current) return false;
    let saved = false;

    await handleSubmit(async ({ name, category, style, color, image: pieceImage }) => {
      busyRef.current = true;
      setError(null);
      setOperation('submit');

      try {
        await createWardrobeItem(
          { name, category, style: style || null, color: color || null },
          pieceImage,
        );
        setSuccess(true);
        saved = true;
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Não foi possível cadastrar a peça. Tente novamente.',
        );
      } finally {
        setOperation(null);
        busyRef.current = false;
      }
    })();

    return saved;
  }

  return {
    control,
    errors,
    image,
    error,
    success,
    analysisError,
    isAnalyzed,
    operation,
    selectImage,
    submit,
  };
}
