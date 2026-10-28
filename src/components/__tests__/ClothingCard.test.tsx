import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { ClothingCard } from '@/components/ClothingCard';
import type { WardrobePiece } from '@/types/Look';

const item: WardrobePiece = { id: 'a', name: 'Calça Jeans', imageUrl: null, category: 'Calça' };

describe('ClothingCard', () => {
  it('has no remove button when removal is not available', async () => {
    await render(<ClothingCard item={item} />);

    expect(screen.queryByRole('button', { name: 'Remover Calça Jeans do closet' })).toBeNull();
  });

  it('shows a remove button that reports which piece was chosen', async () => {
    const onRemove = jest.fn();
    await render(<ClothingCard item={item} onRemove={onRemove} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Remover Calça Jeans do closet' }));

    expect(onRemove).toHaveBeenCalledWith(item);
  });
});
