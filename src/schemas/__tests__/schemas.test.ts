import { describe, expect, it } from '@jest/globals';

import { registerSchema } from '@/schemas/authSchema';
import { favoriteStylesSchema, styleIdentificationSchema } from '@/schemas/styleSchema';
import { currentUserSchema } from '@/schemas/userSchema';
import { addPieceSchema, wardrobeImageAnalysisSchema } from '@/schemas/wardrobeSchema';

const validRegister = {
  name: ' Anna ',
  email: 'anna@pie.com.br',
  password: '123456',
  confirmPassword: '123456',
};

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

describe('currentUserSchema', () => {
  const user = {
    id: '6f1c2b0e-1a2b-4c3d-9e8f-001122334455',
    name: 'Ana Souza',
    email: 'ana@pie.com.br',
    photoUrl: 'https://cdn.pie.com.br/ana.png',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
  };

  it('accepts the /users/me response', () => {
    expect(currentUserSchema.parse(user)).toEqual(user);
  });

  it('accepts null or missing photo and dates', () => {
    expect(
      currentUserSchema.safeParse({ ...user, photoUrl: null, createdAt: null, updatedAt: null })
        .success,
    ).toBe(true);
    expect(
      currentUserSchema.safeParse({ id: user.id, name: user.name, email: user.email }).success,
    ).toBe(true);
  });

  it('rejects a response without name or email', () => {
    expect(currentUserSchema.safeParse({ ...user, name: undefined }).success).toBe(false);
    expect(currentUserSchema.safeParse({ ...user, email: null }).success).toBe(false);
  });
});

describe('favoriteStylesSchema', () => {
  it('accepts an empty list', () => {
    expect(favoriteStylesSchema.parse({ styles: [] }).styles).toEqual([]);
  });

  it('accepts more than one known style', () => {
    expect(favoriteStylesSchema.parse({ styles: ['CASUAL', 'ROMANTICO'] }).styles).toEqual([
      'CASUAL',
      'ROMANTICO',
    ]);
  });

  it('ignores unknown styles instead of rejecting the response', () => {
    expect(favoriteStylesSchema.parse({ styles: ['DRAMATICO'] }).styles).toEqual([]);
  });

  it('keeps the known styles when the list also has unknown ones', () => {
    expect(favoriteStylesSchema.parse({ styles: ['CASUAL', 'DRAMATICO', 'BOHO'] }).styles).toEqual([
      'CASUAL',
      'BOHO',
    ]);
  });
});
