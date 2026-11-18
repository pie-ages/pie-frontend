import { expect, it, jest } from '@jest/globals';
import { Stack } from 'expo-router';

/* eslint-disable import/order -- Load colorimetry components before the router helpers install their animation mock. */
import ColorimetryResultScreen from '@/app/(screens)/ColorimetryResult';
import { ColorimetrySuccessModal } from '@/components/ColorimetrySuccessModal';

import { fireEvent, renderRouter, screen, testRouter } from 'expo-router/testing-library';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
/* eslint-enable import/order */

jest.mock('expo-image-picker', () => ({
  CameraType: { front: 'front' },
  requestCameraPermissionsAsync: async () => ({ granted: true }),
  launchCameraAsync: async () => ({
    canceled: false,
    assets: [{ uri: 'file:///selfie.jpg' }],
  }),
}));
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: jest.requireActual<typeof import('react-native')>('react-native').View,
    createAnimatedComponent: (component: unknown) => component,
  },
  FadeInDown: { duration: () => ({ delay: () => ({ reduceMotion: () => undefined }) }) },
  ZoomIn: { duration: () => ({ reduceMotion: () => undefined }) },
  ReduceMotion: { System: 'system' },
}));
jest.mock('@/components/AuthButton', () => {
  const { Button } = jest.requireActual<typeof import('react-native')>('react-native');
  return { AuthButton: Button };
});
jest.mock('@/components/ColorimetryConsentModal', () => {
  const { Button } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    ColorimetryConsentModal: ({
      visible,
      onAccept,
      onSkip,
      onDismiss,
    }: {
      visible: boolean;
      onAccept: () => void;
      onSkip: () => void;
      onDismiss: () => void;
    }) =>
      visible ? (
        <>
          <Button
            title="Aceitar"
            onPress={() => {
              onAccept();
              onDismiss();
            }}
          />
          <Button
            title="Agora não"
            onPress={() => {
              onSkip();
              onDismiss();
            }}
          />
        </>
      ) : null,
  };
});
jest.mock('@/components/ColorPickerModal', () => ({ ColorPickerModal: () => null }));
jest.mock('@/hooks/UseColorimetryPreferences', () => ({
  useColorimetryPreferences: () => ({
    status: 'success',
    preferences: { highlightColors: [], avoidColors: [], favoriteColors: [] },
    retry: jest.fn(),
  }),
}));
jest.mock('@/services/style', () => ({
  getFavoriteStyles: async () => ['CASUAL'],
}));

function CatalogTabs() {
  return (
    <Tabs>
      <TabSlot />
      <TabList>
        <TabTrigger name="Storefront" href="/Storefront" />
        <TabTrigger name="Looks" href="/Looks" />
      </TabList>
    </Tabs>
  );
}

it.each([
  { initialUrl: '/MyStyle', previousScreen: '/StyleSelection', skip: false },
  { initialUrl: '/Looks', previousScreen: '/Profile', skip: false },
  { initialUrl: '/Storefront', previousScreen: '/Profile', skip: false },
  { initialUrl: '/MyStyle', previousScreen: '/StyleSelection', skip: true },
])(
  'opens the storefront after colorimetry from $previousScreen (skipped: $skip)',
  async ({ initialUrl, previousScreen, skip }) => {
    const app = await renderRouter(
      {
        _layout: () => (
          <Stack>
            <Stack.Screen name="(screens)/Profile/index" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="(screens)/ColorimetryResult/index"
              options={{ presentation: 'card' }}
            />
          </Stack>
        ),
        '(screens)/MyStyle/index': () => null,
        '(screens)/StyleSelection/index': () => null,
        '(screens)/Profile/index': () => null,
        '(screens)/ColorimetryResult/index': ColorimetryResultScreen,
        '(tabs)/_layout': CatalogTabs,
        '(tabs)/Looks': () => null,
        '(tabs)/Storefront': ColorimetrySuccessModal,
      },
      { initialUrl },
    );
    await testRouter.push(previousScreen);
    if (previousScreen === '/Profile') {
      await testRouter.replace('/ColorimetryResult');
    } else {
      await testRouter.push('/ColorimetryResult');
    }
    await fireEvent.press(
      screen.getByRole('button', { name: 'Tirar foto para iniciar a colorimetria' }),
    );
    if (skip) {
      await fireEvent.press(screen.getByRole('button', { name: 'Agora não' }));
    } else {
      await fireEvent.press(screen.getByRole('button', { name: 'Aceitar' }));
      await fireEvent.press(await screen.findByRole('button', { name: 'Concluir' }));
      expect(app.getPathname()).toBe('/Storefront');
      expect(await screen.findByText('Colorimetria atualizada!')).toBeTruthy();
      expect(await screen.findByText('Seu estilo: Casual')).toBeTruthy();
      await fireEvent.press(await screen.findByRole('button', { name: 'Continuar' }));
    }

    expect(app.getPathname()).toBe('/Storefront');
    expect(screen.queryByText('Colorimetria atualizada!')).toBeNull();
    expect(testRouter.canGoBack()).toBe(false);
  },
);
