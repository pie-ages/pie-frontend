import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { StorefrontFilterSheet } from '@/components/StorefrontFilterSheet';
import { useStorefrontFilters } from '@/hooks/UseStorefrontFilters';
import type { FilterGroup } from '@/types/Filter';

jest.mock('@expo/vector-icons', () => ({
  Feather: () => null,
  MaterialCommunityIcons: () => null,
}));
jest.mock('react-native-reanimated', () => ({ useReducedMotion: () => true }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ bottom: 0 }) }));

const groups: FilterGroup[] = [
  {
    id: 'cores',
    label: 'Cores',
    options: [
      { id: 'bege', label: 'Bege' },
      { id: 'preto', label: 'Preto' },
      { id: 'azul', label: 'Azul' },
      { id: 'verde', label: 'Verde' },
      { id: 'terracota', label: 'Terracota' },
    ],
  },
];

function FilterSheetHarness({ favoriteColors }: { favoriteColors: string[] }) {
  const filters = useStorefrontFilters();

  return (
    <>
      <View testID="catalog-params" accessibilityLabel={JSON.stringify(filters.catalogParams)} />
      <StorefrontFilterSheet
        visible
        groups={groups}
        favoriteColors={favoriteColors}
        pendingFiltersByGroup={filters.pendingFiltersByGroup}
        onTogglePending={filters.togglePendingFilter}
        onApply={filters.applyPendingFilters}
        onClear={filters.clearAllFilters}
        onClose={() => {}}
      />
    </>
  );
}

function colorButtonLabels() {
  return screen
    .getAllByRole('button', { name: /^(Bege|Preto|Azul|Verde|Terracota)/ })
    .map((button) => button.props.accessibilityLabel);
}

describe('StorefrontFilterSheet favorite colors', () => {
  it('keeps the catalog order when there are no valid favorite shades', async () => {
    await render(<FilterSheetHarness favoriteColors={[]} />);
    expect(colorButtonLabels()).toEqual(['Bege', 'Preto', 'Azul', 'Verde', 'Terracota']);

    await screen.rerender(<FilterSheetHarness favoriteColors={['invalid']} />);
    expect(colorButtonLabels()).toEqual(['Bege', 'Preto', 'Azul', 'Verde', 'Terracota']);
  });

  it('prioritizes favorite categories once and preserves the order of other colors', async () => {
    await render(<FilterSheetHarness favoriteColors={['#051B45', '#A4C9E5', '#BA6048']} />);

    expect(colorButtonLabels()).toEqual([
      'Azul, cor favorita',
      'Terracota, cor favorita',
      'Bege',
      'Preto',
      'Verde',
    ]);
  });

  it('applies the category ID and clears its selection while keeping it marked as favorite', async () => {
    await render(<FilterSheetHarness favoriteColors={['#000080']} />);

    const favoriteButton = () => screen.getByRole('button', { name: 'Azul, cor favorita' });
    const appliedParams = () =>
      JSON.parse(screen.getByTestId('catalog-params').props.accessibilityLabel);
    const initialStyle = favoriteButton().props.style;

    expect(favoriteButton().props.accessibilityState.selected).toBe(false);
    await fireEvent.press(favoriteButton());
    expect(favoriteButton().props.accessibilityState.selected).toBe(true);
    expect(favoriteButton().props.style).not.toEqual(initialStyle);
    expect(appliedParams().colors).toBeUndefined();

    await fireEvent.press(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(appliedParams().colors).toEqual(['azul']);

    await fireEvent.press(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(appliedParams().colors).toBeUndefined();
    expect(favoriteButton().props.accessibilityState.selected).toBe(false);
    expect(favoriteButton().props.style).toEqual(initialStyle);
  });
});
