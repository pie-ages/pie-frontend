export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroupId = 'estilos' | 'pecas' | 'cores' | 'lojas' | 'materiais';

export type FilterGroup = {
  id: FilterGroupId;
  label: string;
  options: FilterOption[];
};
