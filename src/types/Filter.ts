export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroupId =
  'estilos' | 'pecas' | 'cores' | 'lojas' | 'materiais' | 'generos' | 'perfil';

export type FilterGroup = {
  id: FilterGroupId;
  label: string;
  options: FilterOption[];
};

export const PROFILE_COLORIMETRY = 'colorimetria';
export const PROFILE_MATCHES = 'combinam';

export const GENDER_OPTIONS: FilterOption[] = [
  { id: 'feminino', label: 'Feminino' },
  { id: 'masculino', label: 'Masculino' },
  { id: 'unissex', label: 'Unissex' },
];

export const PROFILE_OPTIONS: FilterOption[] = [
  { id: PROFILE_COLORIMETRY, label: 'Minha colorimetria' },
  { id: PROFILE_MATCHES, label: 'Combinam com você' },
];
