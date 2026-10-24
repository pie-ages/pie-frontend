import { z } from 'zod';

export const currentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  photoUrl: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;
