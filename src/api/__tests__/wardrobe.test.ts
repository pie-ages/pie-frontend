import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Platform } from 'react-native';

import { apiUploadAuth } from '@/api/client';
import { analyzeWardrobeImage } from '@/api/wardrobe';

jest.mock('react-native', () => ({ Platform: { OS: 'web' } }));
jest.mock('@/api/client', () => ({ apiGetAuth: jest.fn(), apiUploadAuth: jest.fn() }));
jest.mock('@/utils/wardrobe-rows', () => ({ groupWardrobePieces: jest.fn() }));

const upload = jest.mocked(apiUploadAuth);
const image = { uri: 'blob:photo', fileName: 'dress.png', mimeType: 'image/png' };
const palette = { category: 'vestido', style: 'romantico', color: 'verde' };
const fetchMock = jest.fn<typeof fetch>();
const originalFetch = globalThis.fetch;

describe('wardrobe image upload', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    Platform.OS = 'web';
    upload.mockResolvedValue(palette);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('uploads the web image with authentication and an abort signal', async () => {
    const blob = new Blob(['photo'], { type: 'image/png' });
    fetchMock.mockResolvedValue({ ok: true, blob: async () => blob } as Response);
    const controller = new AbortController();
    expect(await analyzeWardrobeImage(image, controller.signal)).toEqual(palette);
    expect(fetchMock).toHaveBeenCalledWith(image.uri, { signal: controller.signal });
    const [path, formData, signal] = upload.mock.calls[0];
    expect(path).toBe('/api/users/me/wardrobe/items/analyze');
    expect(signal).toBe(controller.signal);
    const file = formData.get('file') as File;
    expect(file.name).toBe('dress.png');
    expect(file.type).toBe('image/png');
    expect(file.size).toBe(blob.size);
  });

  it('passes a native file URI instead of fetching a local file as a blob', async () => {
    Platform.OS = 'android';
    const append = jest.spyOn(FormData.prototype, 'append');
    await analyzeWardrobeImage({ ...image, uri: 'file:///dress.png' });
    expect(append).toHaveBeenCalledWith('file', {
      uri: 'file:///dress.png',
      name: 'dress.png',
      type: 'image/png',
    } as unknown as Blob);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(upload).toHaveBeenCalledTimes(1);
  });

  it('does not call the backend when the selected image cannot be read', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response);
    await expect(analyzeWardrobeImage(image)).rejects.toThrow('Não foi possível ler');
    expect(upload).not.toHaveBeenCalled();
  });
});
