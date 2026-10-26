import type { ProductPublicDetail } from '@/schemas/productSchema';
import type { CreateWardrobeItemPayload, WardrobeImageAsset } from '@/services/wardrobe';

const WARDROBE_STYLES = ['romantico', 'classico', 'casual', 'criativo', 'dramatico', 'refinado'];
const FALLBACK_CATEGORY = 'Outros';
const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

const FILE_EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
};

export class MissingProductImageError extends Error {
  constructor() {
    super('Este produto não tem imagem para ser adicionado ao closet.');
    this.name = 'MissingProductImageError';
  }
}

type WardrobeProductSource = Pick<
  ProductPublicDetail,
  'id' | 'name' | 'category' | 'color' | 'styles' | 'imageUrl'
>;

function normalizeStyle(styles: string[]): string | null {
  for (const style of styles) {
    const normalized = style.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
    if (WARDROBE_STYLES.includes(normalized)) return normalized;
  }
  return null;
}

function getMimeType(url: string): string {
  const extension = url.split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? 'image/jpeg';
}

export function buildWardrobeItemFromProduct(product: WardrobeProductSource): {
  payload: CreateWardrobeItemPayload;
  image: WardrobeImageAsset;
} {
  if (!product.imageUrl) throw new MissingProductImageError();

  const mimeType = getMimeType(product.imageUrl);

  return {
    payload: {
      productId: product.id,
      name: product.name,
      category: product.category?.trim() || FALLBACK_CATEGORY,
      style: normalizeStyle(product.styles),
      color: product.color?.trim() || null,
    },
    image: {
      uri: product.imageUrl,
      fileName: `product-${product.id}.${FILE_EXTENSION_BY_MIME[mimeType]}`,
      mimeType,
    },
  };
}
