import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { InClosetBadge } from '@/components/InClosetBadge';

jest.mock('@/global.css', () => ({}));

describe('InClosetBadge', () => {
  it('shows the "No closet" text, not only a color', async () => {
    await render(<InClosetBadge />);

    expect(screen.getByText('No closet')).toBeTruthy();
  });

  it('describes the state for screen readers', async () => {
    await render(<InClosetBadge />);

    expect(screen.getByLabelText('Esta peça já está no seu closet')).toBeTruthy();
  });
});
