import { describe, expect, it } from '@jest/globals';

import { loginResponseSchema, registerSchema } from '@/schemas/authSchema';
import { styleIdentificationSchema } from '@/schemas/styleSchema';
import { addPieceSchema, wardrobeImageAnalysisSchema } from '@/schemas/wardrobeSchema';

import { lookFormSchema } from '../lookSchema';

const validLoginResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.payload.sig',
  refreshToken: 'refresh-token-string',
  expiresIn: 3600,
  tokenType: 'bearer',
  user: { id: 'uuid-1', name: 'Anna', email: 'anna@pie.com.br', photoUrl: null },
};

const validRegister = {
  name: ' Anna ',
  email: 'anna@pie.com.br',
  password: '123456',
  confirmPassword: '123456',
};

describe('loginResponseSchema', () => {
  it('parses a valid response from the backend', () => {
    const result = loginResponseSchema.safeParse(validLoginResponse);
    expect(result.success).toBe(true);
  });

  it('accepts null user', () => {
    const result = loginResponseSchema.safeParse({ ...validLoginResponse, user: null });
    expect(result.success).toBe(true);
  });

  it('rejects legacy shape with token instead of accessToken', () => {
    const legacy = { token: 'abc', user: validLoginResponse.user };
    const result = loginResponseSchema.safeParse(legacy);
    expect(result.success).toBe(false);
  });

  it('rejects response missing refreshToken', () => {
    const { refreshToken: _r, ...noRefresh } = validLoginResponse;
    expect(loginResponseSchema.safeParse(noRefresh).success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('trims fields and accepts matching passwords', () => {
    const result = registerSchema.safeParse(validRegister);
    expect(result.success && result.data.name).toBe('Anna');
  });

  it('flags confirmPassword when passwords differ', () => {
    const result = registerSchema.safeParse({ ...validRegister, confirmPassword: 'outra' });
    expect(result.error?.issues[0].path).toEqual(['confirmPassword']);
  });
});

describe('addPieceSchema', () => {
  const piece = { name: 'Vestido', category: 'vestido', style: '', color: '' };

  it('requires an image', () => {
    const result = addPieceSchema.safeParse({ ...piece, image: null });
    expect(result.error?.issues[0].message).toBe('Adicione uma imagem da peça.');
  });

  it('rejects unsupported image types', () => {
    const image = { uri: 'file:///a.gif', mimeType: 'image/gif' };
    expect(addPieceSchema.safeParse({ ...piece, image }).success).toBe(false);
  });
});

describe('lookFormSchema', () => {
  it('rejects looks with more than four pieces', () => {
    const item = { id: 'piece', name: 'Peça', imageUrl: null, category: 'Outros' };
    const result = lookFormSchema.safeParse({
      title: 'Look',
      occasion: '',
      items: [item, item, item, item, item],
    });

    expect(result.success).toBe(false);
  });
});

describe('response schemas', () => {
  it('turns null AI analysis fields into empty strings', () => {
    const result = wardrobeImageAnalysisSchema.parse({
      category: 'vestido',
      style: null,
      color: null,
    });
    expect(result).toEqual({ category: 'vestido', style: '', color: '' });
  });

  it('accepts at most one known identified style', () => {
    expect(styleIdentificationSchema.safeParse({ styles: [] }).success).toBe(true);
    expect(styleIdentificationSchema.safeParse({ styles: ['BOHO'] }).success).toBe(true);
    expect(styleIdentificationSchema.safeParse({ styles: ['BOHO', 'CASUAL'] }).success).toBe(false);
    expect(styleIdentificationSchema.safeParse({ styles: ['PUNK'] }).success).toBe(false);
  });
});
