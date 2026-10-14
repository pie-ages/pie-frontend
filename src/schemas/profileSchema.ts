import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  photoUrl: z.string().nullable(),
});

export const userProductStylesSchema = z.object({
  styles: z.array(z.string()),
});
