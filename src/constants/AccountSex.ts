export const ACCOUNT_SEX_FIELD_ENABLED = false;

export const ACCOUNT_SEX_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'prefiro_nao_informar', label: 'Prefiro não informar' },
] as const;

export type AccountSexChoice = (typeof ACCOUNT_SEX_OPTIONS)[number]['value'] | '';
