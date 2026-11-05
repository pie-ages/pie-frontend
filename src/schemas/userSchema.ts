import { z } from 'zod';

import { accountSexSchema } from '@/schemas/accountSexSchema';

export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  photoUrl: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  sex: accountSexSchema.nullish(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;
