import { describe, expect, it } from '@jest/globals';

import { accountSexSchema } from '@/schemas/accountSexSchema';
import { userResponseSchema } from '@/schemas/authSchema';
import { currentUserSchema } from '@/schemas/userSchema';
import { toAccountSex, toAccountSexChoice } from '@/utils/account-sex';

describe('account sex', () => {
  it('converte as escolhas para os valores da API', () => {
    expect(toAccountSex('masculino')).toBe('MASCULINO');
    expect(toAccountSex('feminino')).toBe('FEMININO');
    expect(toAccountSex('prefiro_nao_informar')).toBe('PREFIRO_NAO_INFORMAR');
  });

  it('converte os valores da API para as escolhas da interface', () => {
    expect(toAccountSexChoice('MASCULINO')).toBe('masculino');
    expect(toAccountSexChoice('FEMININO')).toBe('feminino');
    expect(toAccountSexChoice('PREFIRO_NAO_INFORMAR')).toBe('prefiro_nao_informar');
  });

  it('mantém valores ausentes sem seleção automática', () => {
    expect(toAccountSex('')).toBeUndefined();
    expect(toAccountSexChoice(null)).toBe('');
    expect(toAccountSexChoice(undefined)).toBe('');
  });

  it.each(['UNISSEX', 'masculino', '', 0, true])('rejeita o valor inválido %p', (value) => {
    expect(accountSexSchema.safeParse(value).success).toBe(false);
  });

  it('preserva o sexo nas respostas de cadastro e perfil', () => {
    const user = {
      id: 'user-1',
      name: 'Teste',
      email: 'teste@example.com',
      photoUrl: null,
      sex: 'FEMININO',
    };

    expect(userResponseSchema.parse(user).sex).toBe('FEMININO');
    expect(currentUserSchema.parse(user).sex).toBe('FEMININO');
  });

  it('aceita respostas com sexo nulo ou ausente', () => {
    const user = {
      id: 'user-1',
      name: 'Teste',
      email: 'teste@example.com',
      photoUrl: null,
    };

    expect(userResponseSchema.parse(user).sex).toBeUndefined();
    expect(currentUserSchema.parse(user).sex).toBeUndefined();
    expect(userResponseSchema.parse({ ...user, sex: null }).sex).toBeNull();
    expect(currentUserSchema.parse({ ...user, sex: null }).sex).toBeNull();
  });
});
