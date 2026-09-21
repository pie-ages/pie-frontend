export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroupId = 'estilos' | 'pecas' | 'cores' | 'lojas';

export type FilterGroup = {
  id: FilterGroupId;
  label: string;
  options: FilterOption[];
};
