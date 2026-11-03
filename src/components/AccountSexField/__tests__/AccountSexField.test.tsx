import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { useState } from 'react';

import { AccountSexField } from '@/components/AccountSexField';
import { ACCOUNT_SEX_OPTIONS, type AccountSexChoice } from '@/constants/AccountSex';

jest.mock('@/global.css', () => ({}));

function ControlledField() {
  const [value, setValue] = useState<AccountSexChoice>('');

  return <AccountSexField value={value} onChange={setValue} />;
}

describe('AccountSexField', () => {
  it('não seleciona uma opção automaticamente quando o valor está vazio', async () => {
    const screen = await render(<AccountSexField value="" onChange={jest.fn()} />);

    for (const option of ACCOUNT_SEX_OPTIONS) {
      expect(
        screen.getByRole('radio', { name: option.label }).props.accessibilityState.checked,
      ).toBe(false);
    }
  });

  it('permite trocar a seleção mantendo somente uma opção selecionada', async () => {
    const screen = await render(<ControlledField />);

    await fireEvent.press(screen.getByRole('radio', { name: 'Masculino' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Feminino' }));

    expect(screen.getByRole('radio', { name: 'Masculino' }).props.accessibilityState.checked).toBe(
      false,
    );
    expect(screen.getByRole('radio', { name: 'Feminino' }).props.accessibilityState.checked).toBe(
      true,
    );
  });

  it('exibe a opção previamente recebida como selecionada', async () => {
    const screen = await render(
      <AccountSexField value="prefiro_nao_informar" onChange={jest.fn()} />,
    );

    expect(
      screen.getByRole('radio', { name: 'Prefiro não informar' }).props.accessibilityState.checked,
    ).toBe(true);
  });

  it('não altera a seleção quando está desabilitado', async () => {
    const onChange = jest.fn();
    const screen = await render(<AccountSexField value="" onChange={onChange} disabled />);

    await fireEvent.press(screen.getByRole('radio', { name: 'Feminino' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('apresenta a mensagem de erro recebida', async () => {
    const screen = await render(
      <AccountSexField value="" onChange={jest.fn()} error="Selecione uma opção." />,
    );

    expect(screen.getByRole('alert').props.children).toBe('Selecione uma opção.');
  });
});
