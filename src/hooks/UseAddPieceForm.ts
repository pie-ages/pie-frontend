import { useEffect, useRef, useState } from 'react';

import {
  analyzeWardrobeImage,
  createWardrobeItem,
  type CreateWardrobeItemPayload,
  type WardrobeImageAsset,
} from '@/api/wardrobe';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type AddPieceOperation = 'analyze' | 'submit' | null;

export function useAddPieceForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [style, setStyle] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState<WardrobeImageAsset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [operation, setOperation] = useState<AddPieceOperation>(null);
  const busyRef = useRef(false);
  const analysisRef = useRef<AbortController | null>(null);

  useEffect(() => () => analysisRef.current?.abort(), []);

  async function selectImage(value: WardrobeImageAsset) {
    if (busyRef.current && !analysisRef.current) return;
    analysisRef.current?.abort();
    const controller = new AbortController();
    analysisRef.current = controller;
    busyRef.current = true;
    setImage(value);
    setCategory('');
    setStyle('');
    setColor('');
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
      setCategory(result.category);
      setStyle(result.style);
      setColor(result.color);
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

  function validate(): string | null {
    if (!name.trim()) return 'Informe o nome da peça.';
    if (!category) return 'Selecione a categoria da peça.';
    if (!image) return 'Adicione uma imagem da peça.';
    if (image.mimeType && !ALLOWED_IMAGE_TYPES.has(image.mimeType)) {
      return 'Formato não suportado. Use JPEG, PNG ou WebP.';
    }
    if (image.fileSize && image.fileSize > MAX_IMAGE_SIZE_BYTES) {
      return 'A imagem deve ter no máximo 5 MB.';
    }
    return null;
  }

  async function submit() {
    if (busyRef.current) return false;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return false;
    }

    busyRef.current = true;
    setError(null);
    setOperation('submit');

    const payload: CreateWardrobeItemPayload = {
      name: name.trim(),
      category,
      style: style || null,
      color: color || null,
    };

    try {
      await createWardrobeItem(payload, image as WardrobeImageAsset);
      setSuccess(true);
      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível cadastrar a peça. Tente novamente.',
      );
      return false;
    } finally {
      setOperation(null);
      busyRef.current = false;
    }
  }

  return {
    name,
    category,
    style,
    color,
    image,
    error,
    success,
    analysisError,
    isAnalyzed,
    operation,
    selectImage,
    setName: (value: string) => {
      setName(value);
      setError(null);
    },
    setCategory: (value: string) => {
      setCategory(value);
      setError(null);
    },
    setStyle: (value: string) => {
      setStyle(value);
      setError(null);
    },
    setColor: (value: string) => {
      setColor(value);
      setError(null);
    },
    setImage: (value: WardrobeImageAsset | null) => {
      setImage(value);
      setError(null);
    },
    submit,
  };
}
