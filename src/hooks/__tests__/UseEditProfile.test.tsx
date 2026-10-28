import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';

import { useEditProfile } from '@/hooks/UseEditProfile';
import { ApiError } from '@/services/client';
import { fetchCurrentUser, updateCurrentUser } from '@/services/user';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('@/services/user');

const mockFetchCurrentUser = jest.mocked(fetchCurrentUser);
const mockUpdateCurrentUser = jest.mocked(updateCurrentUser);

const currentUser = {
  id: 'user-1',
  name: 'Marcos',
  email: 'marcos@pie.com',
  photoUrl: 'https://cdn.pie.com/marcos.jpg',
};

async function renderLoadedHook() {
  const hook = await renderHook(() => useEditProfile());
  await waitFor(() => expect(hook.result.current.user).toEqual(currentUser));
  return hook;
}

describe('useEditProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchCurrentUser.mockResolvedValue(currentUser);
    mockUpdateCurrentUser.mockResolvedValue(currentUser);
  });

  it('preenche nome e email com o usuário logado', async () => {
    const { result } = await renderLoadedHook();

    expect(result.current.name).toBe('Marcos');
    expect(result.current.email).toBe('marcos@pie.com');
  });

  it('salva o nome editado preservando a foto e volta para o perfil', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.setName('  Marcos Raach  '));
    await act(async () => result.current.save());

    expect(mockUpdateCurrentUser).toHaveBeenCalledWith('user-1', {
      name: 'Marcos Raach',
      photoUrl: 'https://cdn.pie.com/marcos.jpg',
    });
    expect(router.back).toHaveBeenCalled();
  });

  it('não salva com o nome em branco', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.setName('   '));

    expect(result.current.canSave).toBe(false);
    await act(async () => result.current.save());
    expect(mockUpdateCurrentUser).not.toHaveBeenCalled();
  });

  it('mostra a mensagem do servidor quando o salvamento falha', async () => {
    mockUpdateCurrentUser.mockRejectedValue(new ApiError('Nome inválido', 400, 'Nome inválido'));
    const { result } = await renderLoadedHook();

    await act(async () => result.current.save());

    expect(result.current.error).toBe('Nome inválido');
    expect(router.back).not.toHaveBeenCalled();
  });
});
