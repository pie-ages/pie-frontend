import { describe, expect, it } from '@jest/globals';

import { isHttpUrl } from '@/utils/external-url';

describe('isHttpUrl', () => {
  it('accepts http and https links', () => {
    expect(isHttpUrl('https://loja.com.br/produto/1')).toBe(true);
    expect(isHttpUrl('http://loja.com.br')).toBe(true);
  });

  it('rejects empty values, other schemes and malformed links', () => {
    expect(isHttpUrl(null)).toBe(false);
    expect(isHttpUrl(undefined)).toBe(false);
    expect(isHttpUrl('')).toBe(false);
    expect(isHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isHttpUrl('mailto:loja@pie.com.br')).toBe(false);
    expect(isHttpUrl('loja.com.br/produto')).toBe(false);
  });
});
