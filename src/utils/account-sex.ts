import type { AccountSexChoice } from '@/constants/AccountSex';
import type { AccountSex } from '@/schemas/accountSexSchema';

const sexByChoice: Record<Exclude<AccountSexChoice, ''>, AccountSex> = {
  masculino: 'MASCULINO',
  feminino: 'FEMININO',
  prefiro_nao_informar: 'PREFIRO_NAO_INFORMAR',
};

const choiceBySex: Record<AccountSex, AccountSexChoice> = {
  MASCULINO: 'masculino',
  FEMININO: 'feminino',
  PREFIRO_NAO_INFORMAR: 'prefiro_nao_informar',
};

export function toAccountSex(choice: AccountSexChoice): AccountSex | undefined {
  return choice === '' ? undefined : sexByChoice[choice];
}

export function toAccountSexChoice(sex: AccountSex | null | undefined): AccountSexChoice {
  return sex == null ? '' : choiceBySex[sex];
}
