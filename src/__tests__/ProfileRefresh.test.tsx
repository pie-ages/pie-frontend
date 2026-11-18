import { expect, it, jest } from '@jest/globals';
import { router, Stack } from 'expo-router';
import { fireEvent, renderRouter, screen, testRouter, waitFor } from 'expo-router/testing-library';
import { Button } from 'react-native';

import ProfileScreen from '@/app/(screens)/Profile';
import { fetchPreferences } from '@/services/preferences';
import { getFavoriteStyles } from '@/services/style';
import { fetchCurrentUser } from '@/services/user';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));
jest.mock('@/services/preferences');
jest.mock('@/services/style');
jest.mock('@/services/user');

function EditStyles() {
  return (
    <>
      <Button title="Cancelar edição" onPress={() => router.back()} />
      <Button
        title="Confirmar edição"
        onPress={() =>
          router.dismissTo({ pathname: '/(screens)/Profile', params: { updatedSection: 'styles' } })
        }
      />
    </>
  );
}

it('keeps loaded data on cancel and only reloads the section signaled by a save', async () => {
  const user = jest.mocked(fetchCurrentUser);
  const colors = jest.mocked(fetchPreferences);
  const styles = jest.mocked(getFavoriteStyles);
  user.mockResolvedValue({ id: 'user-1', name: 'Marcos', email: 'marcos@example.com' });
  colors.mockResolvedValue({ favoriteColors: [], highlightColors: [], avoidColors: [] });
  styles.mockResolvedValueOnce(['CASUAL']).mockResolvedValueOnce(['ROMANTICO']);

  await renderRouter(
    {
      _layout: () => <Stack />,
      index: () => null,
      '(screens)/Profile/index': ProfileScreen,
      '(screens)/EditStyles/index': EditStyles,
    },
    { initialUrl: '/' },
  );
  await testRouter.push('/Profile');
  expect(await screen.findByText('Casual')).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: 'Editar estilos' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Cancelar edição' }));
  expect(screen.getByText('Casual')).toBeTruthy();
  expect(styles).toHaveBeenCalledTimes(1);

  await fireEvent.press(screen.getByRole('button', { name: 'Editar estilos' }));
  await fireEvent.press(screen.getByRole('button', { name: 'Confirmar edição' }));
  await waitFor(() => expect(screen.getByText('Romântico')).toBeTruthy());

  expect(user).toHaveBeenCalledTimes(1);
  expect(colors).toHaveBeenCalledTimes(1);
  expect(styles).toHaveBeenCalledTimes(2);
});
