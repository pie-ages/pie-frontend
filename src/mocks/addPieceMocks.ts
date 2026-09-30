export interface SelectOption {
  label: string;
  value: string;
}

// Opções para o campo "Peça"
export const mockCategories: SelectOption[] = [
  { label: 'Blazer', value: 'blazer' },
  { label: 'Calça', value: 'pants' },
  { label: 'Camiseta', value: 't_shirt' },
  { label: 'Vestido', value: 'dress' },
];

// Opções para o campo "Estilo"
export const mockStyles: SelectOption[] = [
  { label: 'Casual', value: 'casual' },
  { label: 'Clássico', value: 'classic' },
  { label: 'Esportivo', value: 'sport' },
  { label: 'Festa', value: 'party' },
];

// Opções para o campo "Cor"
export const mockColors: SelectOption[] = [
  { label: 'Off-White', value: 'off_white' },
  { label: 'Branco', value: 'white' },
  { label: 'Preto', value: 'black' },
  { label: 'Azul', value: 'blue' },
  { label: 'Verde', value: 'green' },
];
