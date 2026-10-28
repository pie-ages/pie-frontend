import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Alert, Platform } from 'react-native';

import { confirmAction, showMessage } from '@/utils/confirm';

const originalOS = Platform.OS;

function setPlatform(os: 'ios' | 'web') {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => os });
}

beforeEach(() => {
  jest.restoreAllMocks();
});

afterEach(() => {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => originalOS });
});

describe('confirmAction', () => {
  it('resolves true when the user confirms on the device', async () => {
    setPlatform('ios');
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Remover')?.onPress?.();
    });

    await expect(
      confirmAction({ title: 'Remover', message: 'Tem certeza?', confirmLabel: 'Remover' }),
    ).resolves.toBe(true);
  });

  it('resolves false when the user cancels on the device', async () => {
    setPlatform('ios');
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.find((button) => button.text === 'Cancelar')?.onPress?.();
    });

    await expect(
      confirmAction({ title: 'Remover', message: 'Tem certeza?', confirmLabel: 'Remover' }),
    ).resolves.toBe(false);
  });

  it('uses the browser confirmation on the web', async () => {
    setPlatform('web');
    const confirm = jest.fn<(message: string) => boolean>(() => true);
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { confirm } });

    await expect(
      confirmAction({ title: 'Remover', message: 'Tem certeza?', confirmLabel: 'Remover' }),
    ).resolves.toBe(true);
    expect(confirm).toHaveBeenCalledWith('Remover\n\nTem certeza?');
  });
});

describe('showMessage', () => {
  it('shows a native alert on the device', () => {
    setPlatform('ios');
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    showMessage('Erro', 'Tente novamente.');

    expect(alert).toHaveBeenCalledWith('Erro', 'Tente novamente.');
  });
});
