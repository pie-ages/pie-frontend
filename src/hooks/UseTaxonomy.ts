import { useEffect, useState } from 'react';

import { fetchCompanies } from '@/api/companies';
import { fetchTaxonomy } from '@/api/taxonomy';
import type { FilterGroup } from '@/types/product';

type TaxonomyState = {
  filterGroups: FilterGroup[];
  isLoading: boolean;
};

export function useTaxonomy(): TaxonomyState {
  const [state, setState] = useState<TaxonomyState>({ filterGroups: [], isLoading: true });

  useEffect(() => {
    Promise.allSettled([fetchTaxonomy(), fetchCompanies()]).then(
      ([taxonomyResult, companiesResult]) => {
        if (taxonomyResult.status === 'rejected') {
          setState({ filterGroups: [], isLoading: false });
          return;
        }

        const taxonomy = taxonomyResult.value;
        const companies = companiesResult.status === 'fulfilled' ? companiesResult.value : [];

        setState({
          isLoading: false,
          filterGroups: [
            {
              id: 'estilos',
              label: 'Estilos',
              options: taxonomy.styles.map((t) => ({ id: t.id, label: t.name })),
            },
            {
              id: 'pecas',
              label: 'Peças de Roupa',
              options: taxonomy.categories.map((t) => ({ id: t.id, label: t.name })),
            },
            {
              id: 'cores',
              label: 'Cores',
              options: taxonomy.colors.map((t) => ({ id: t.id, label: t.name })),
            },
            {
              id: 'lojas',
              label: 'Lojas',
              options: companies.filter((c) => c.name).map((c) => ({ id: c.id, label: c.name })),
            },
          ],
        });
      },
    );
  }, []);

  return state;
}
