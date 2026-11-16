import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

import { useStorefrontFilters } from '../UseStorefrontFilters';

describe('useStorefrontFilters', () => {
  it('maps gender and profile filters to catalog params and combines with existing ones', async () => {
    const { result } = await renderHook(() => useStorefrontFilters());

    await act(async () => {
      result.current.clearAllFilters();
      result.current.toggleAppliedFilter('generos', 'feminino');
      result.current.toggleAppliedFilter('generos', 'unissex');
      result.current.toggleAppliedFilter('perfil', 'colorimetria');
      result.current.toggleAppliedFilter('perfil', 'combinam');
      result.current.toggleAppliedFilter('estilos', 'casual');
    });

    expect(result.current.catalogParams.genders).toEqual(['feminino', 'unissex']);
    expect(result.current.catalogParams.colorimetry).toBe(true);
    expect(result.current.catalogParams.matchesProfile).toBe(true);
    expect(result.current.catalogParams.styles).toEqual(['casual']);
  });

  it('removes filters individually and clears all without leaving residue', async () => {
    const { result } = await renderHook(() => useStorefrontFilters());

    await act(async () => {
      result.current.clearAllFilters();
      result.current.toggleAppliedFilter('perfil', 'combinam');
      result.current.toggleAppliedFilter('generos', 'masculino');
    });
    await act(async () => {
      result.current.toggleAppliedFilter('perfil', 'combinam');
    });

    expect(result.current.catalogParams.matchesProfile).toBeUndefined();
    expect(result.current.catalogParams.genders).toEqual(['masculino']);

    await act(async () => {
      result.current.clearAllFilters();
    });

    expect(result.current.catalogParams.genders).toBeUndefined();
    expect(result.current.appliedFilterIds.size).toBe(0);
  });
});
