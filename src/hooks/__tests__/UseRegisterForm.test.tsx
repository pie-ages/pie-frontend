import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Controller } from 'react-hook-form';
import { Button, TextInput } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import type { LoginFormData } from '@/schemas/authSchema';
import * as client from '@/services/client';

import { useRegisterForm } from '../UseRegisterForm';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockApiPost = jest.spyOn(client, 'apiPost');
const mockCompleteSignUp = jest.fn<(payload: LoginFormData) => Promise<void>>(
  async (_payload) => {},
);

function RegisterFormHarness() {
  const { control, handleRegister } = useRegisterForm();

  return (
    <>
      {(['name', 'email', 'password', 'confirmPassword'] as const).map((name) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => (
            <TextInput testID={name} value={field.value} onChangeText={field.onChange} />
          )}
        />
      ))}
      <Button testID="submit" title="Criar conta" onPress={handleRegister} />
    </>
  );
}

describe('useRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
      pendingStyleQuiz: false,
      signIn: jest.fn<(payload: LoginFormData) => Promise<void>>(async () => {}),
      completeMockSignUp: mockCompleteSignUp,
      completeStyleQuiz: jest.fn<() => void>(() => {}),
      signOut: jest.fn<() => Promise<void>>(async () => {}),
    });
    mockApiPost.mockResolvedValue({});
  });

  it('creates the user with the backend payload and completes sign-up', async () => {
    const screen = await render(<RegisterFormHarness />);

    await fireEvent.changeText(screen.getByTestId('name'), 'Anna');
    await fireEvent.changeText(screen.getByTestId('email'), 'anna@pie.com.br');
    await fireEvent.changeText(screen.getByTestId('password'), '123456');
    await fireEvent.changeText(screen.getByTestId('confirmPassword'), '123456');
    await fireEvent.press(screen.getByTestId('submit'));

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/api/users', {
        name: 'Anna',
        email: 'anna@pie.com.br',
        password: '123456',
      });
    });

    expect(mockCompleteSignUp).toHaveBeenCalledWith({
      email: 'anna@pie.com.br',
      password: '123456',
    });
  });
});
