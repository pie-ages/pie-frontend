import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { StoreLogo } from '@/components/StoreLogo';

jest.mock('@/global.css', () => ({}));
jest.mock('expo-image', () => {
  const { createElement } = jest.requireActual<typeof import('react')>('react');
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  return { Image: (props: object) => createElement(View, props) };
});

describe('StoreLogo', () => {
  it('shows the store logo when a url is provided', async () => {
    await render(<StoreLogo companyName="Loja Aurora" logoUrl="https://cdn/logo.png" />);

    expect(screen.getByLabelText('Logo da loja Loja Aurora')).toBeTruthy();
    expect(screen.getByTestId('store-logo-image').props.source).toEqual({
      uri: 'https://cdn/logo.png',
    });
    expect(screen.queryByText('LA')).toBeNull();
  });

  it('falls back to the store initials when there is no logo', async () => {
    await render(<StoreLogo companyName="Loja Aurora" logoUrl={null} />);

    expect(screen.getByText('LA')).toBeTruthy();
    expect(screen.queryByTestId('store-logo-image')).toBeNull();
  });

  it('falls back to the store initials when the logo fails to load', async () => {
    await render(<StoreLogo companyName="Loja Aurora" logoUrl="https://cdn/broken.png" />);

    await fireEvent(screen.getByTestId('store-logo-image'), 'error', { error: 'failed' });

    expect(screen.getByText('LA')).toBeTruthy();
    expect(screen.queryByTestId('store-logo-image')).toBeNull();
  });

  it('ignores blank logo urls', async () => {
    await render(<StoreLogo companyName="Aurora" logoUrl="   " />);

    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.queryByTestId('store-logo-image')).toBeNull();
  });
});
