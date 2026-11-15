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

  it('preenche o sexo recebido da API', async () => {
    mockFetchCurrentUser.mockResolvedValue({ ...currentUser, sex: 'FEMININO' });

    const { result } = await renderHook(() => useEditProfile());

    await waitFor(() => expect(result.current.sexChoice).toBe('feminino'));
  });

  it('envia o sexo selecionado no formato da API', async () => {
    const { result } = await renderLoadedHook();

    await act(async () => result.current.setSexChoice('prefiro_nao_informar'));
    await act(async () => result.current.save());

    expect(mockUpdateCurrentUser).toHaveBeenCalledWith('user-1', {
      name: 'Marcos',
      photoUrl: 'https://cdn.pie.com/marcos.jpg',
      sex: 'PREFIRO_NAO_INFORMAR',
    });
  });

  it('preserva o sexo carregado ao editar apenas o nome', async () => {
    mockFetchCurrentUser.mockResolvedValue({ ...currentUser, sex: 'MASCULINO' });

    const { result } = await renderHook(() => useEditProfile());

    await waitFor(() => expect(result.current.sexChoice).toBe('masculino'));
    await act(async () => result.current.setName('Marcos Atualizado'));
    await act(async () => result.current.save());

    expect(mockUpdateCurrentUser).toHaveBeenCalledWith('user-1', {
      name: 'Marcos Atualizado',
      photoUrl: 'https://cdn.pie.com/marcos.jpg',
      sex: 'MASCULINO',
    });
  });

  it('mantém cadastro com sexo nulo sem seleção e sem enviar o campo', async () => {
    mockFetchCurrentUser.mockResolvedValue({ ...currentUser, sex: null });

    const { result } = await renderHook(() => useEditProfile());

    await waitFor(() => expect(result.current.user?.id).toBe('user-1'));
    expect(result.current.sexChoice).toBe('');

    await act(async () => result.current.save());

    expect(mockUpdateCurrentUser).toHaveBeenCalledWith('user-1', {
      name: 'Marcos',
      photoUrl: 'https://cdn.pie.com/marcos.jpg',
    });
  });

  it('mantém a escolha e permanece na tela quando o salvamento falha', async () => {
    mockUpdateCurrentUser.mockRejectedValue(
      new ApiError('Falha ao salvar', 500, 'Falha ao salvar'),
    );
    const { result } = await renderLoadedHook();

    await act(async () => result.current.setSexChoice('feminino'));
    await act(async () => result.current.save());

    expect(result.current.sexChoice).toBe('feminino');
    expect(result.current.error).toBe('Falha ao salvar');
    expect(router.back).not.toHaveBeenCalled();
  });
});
