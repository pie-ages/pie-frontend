import { beforeEach, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';

import LooksScreen from '@/app/(tabs)/Looks';
import type { LookFocusCarousel } from '@/components/LookFocusCarousel';
import { uploadLookImage } from '@/services/looks';
import type { Look } from '@/types/Look';

const mockUpdateLookPhoto = jest.fn();
let mockLooks: Look[];

jest.mock('expo-router', () => ({
  useFocusEffect: () => {},
  useLocalSearchParams: () => ({}),
}));
jest.mock('expo-image-picker', () => ({ launchImageLibraryAsync: jest.fn() }));
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: { View: jest.requireActual<typeof import('react-native')>('react-native').View },
  FadeIn: { duration: () => ({ reduceMotion: () => undefined }) },
  ReduceMotion: { System: 'system' },
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));
jest.mock('@/components/ScreenToolBar', () => ({ ScreenToolBar: () => null }));
jest.mock('@/components/LooksViewModeToggle', () => {
  const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
  return { LooksViewModeToggle: () => <Text>Seletor Grid/Foco</Text> };
});
jest.mock('@/components/LookFocusCarousel', () => {
  const { LookFlipCard } = jest.requireActual<typeof import('@/components/LookFlipCard')>(
    '@/components/LookFlipCard',
  );
  return {
    LookFocusCarousel: ({
      looks,
      onAddPhoto,
      uploadingPhotoFor,
    }: Parameters<typeof LookFocusCarousel>[0]) => (
      <LookFlipCard
        look={looks[0]}
        interactive
        onSelect={() => {}}
        onAddPhoto={onAddPhoto}
        isUploadingPhoto={uploadingPhotoFor === looks[0].id}
      />
    ),
  };
});
jest.mock('@/hooks/UseLooksCollection', () => ({
  useLooksCollection: () => ({
    status: mockLooks.length > 0 ? 'success' : 'empty',
    looks: mockLooks,
    updateLookPhoto: mockUpdateLookPhoto,
  }),
}));
jest.mock('@/services/looks', () => ({ uploadLookImage: jest.fn() }));

const mockPicker = jest.mocked(ImagePicker.launchImageLibraryAsync);
const mockUpload = jest.mocked(uploadLookImage);
const photoUrl = 'https://example.com/look.jpg';
const image = { uri: 'file:///look.jpg', width: 1200, height: 1800 };

beforeEach(() => {
  jest.clearAllMocks();
  mockLooks = [{ id: 'look-1', name: 'Look de verão', imageUrl: null, items: [] }];
  mockPicker.mockResolvedValue({ canceled: false, assets: [image] });
  mockUpload.mockResolvedValue({
    id: 'look-1',
    title: 'Look de verão',
    items: [],
    photoUrl,
    occasion: null,
  });
});

async function addPhoto() {
  await render(<LooksScreen />);
  await fireEvent.press(
    screen.getByRole('button', { name: 'Look de verão: adicionar foto usando o look' }),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Adicionar foto usando o look' }));
}

it('opens the photo picker from the card and attaches the selected image to that look', async () => {
  await addPhoto();

  expect(mockPicker).toHaveBeenCalledTimes(1);
  expect(mockUpload).toHaveBeenCalledWith('look-1', { uri: image.uri });
  expect(mockUpdateLookPhoto).toHaveBeenCalledWith('look-1', photoUrl);
});

it('returns to the card without uploading when the picker is canceled', async () => {
  mockPicker.mockResolvedValueOnce({ canceled: true, assets: null });
  await addPhoto();

  expect(mockUpload).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Adicionar foto usando o look' })).toBeTruthy();
});

it('shows feedback and makes the button available again after an upload failure', async () => {
  mockUpload.mockRejectedValueOnce(new Error('Falha no envio'));
  await addPhoto();

  expect(
    await screen.findByText('Não foi possível adicionar a foto. Tente novamente.'),
  ).toBeTruthy();
  expect(
    screen.getByRole('button', { name: 'Adicionar foto usando o look', disabled: false }),
  ).toBeTruthy();
  expect(mockUpdateLookPhoto).not.toHaveBeenCalled();
});
