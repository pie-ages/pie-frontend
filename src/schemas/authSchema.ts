import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome.'),
    email: z
      .string()
      .trim()
      .min(1, 'Informe o e-mail.')
      .email('Por favor, insira um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginResponseSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    photoUrl: z.string().nullable(),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
