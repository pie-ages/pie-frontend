import { describe, expect, it } from '@jest/globals';

import { forgotPasswordSchema, registerSchema, resetPasswordSchema } from '@/schemas/authSchema';
import { styleIdentificationSchema } from '@/schemas/styleSchema';
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

describe('forgotPasswordSchema', () => {
  it('trims the email', () => {
    const result = forgotPasswordSchema.safeParse({ email: ' anna@pie.com.br ' });
    expect(result.success && result.data.email).toBe('anna@pie.com.br');
  });

  it('rejects a malformed email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'anna@' });
    expect(result.error?.issues[0].message).toBe('Por favor, insira um e-mail válido.');
  });
});

describe('resetPasswordSchema', () => {
  const validReset = { password: '123456', confirmPassword: '123456' };

  it('accepts matching passwords', () => {
    expect(resetPasswordSchema.safeParse(validReset).success).toBe(true);
  });

  it('rejects passwords shorter than six characters', () => {
    const result = resetPasswordSchema.safeParse({ password: '12345', confirmPassword: '12345' });
    expect(result.error?.issues[0].message).toBe('A senha deve ter pelo menos 6 caracteres.');
  });

  it('flags confirmPassword when passwords differ', () => {
    const result = resetPasswordSchema.safeParse({ ...validReset, confirmPassword: 'outra' });
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
