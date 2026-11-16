import { z } from 'zod';

export const accountSexSchema = z.enum(['MASCULINO', 'FEMININO', 'PREFIRO_NAO_INFORMAR']);

export type AccountSex = z.infer<typeof accountSexSchema>;
