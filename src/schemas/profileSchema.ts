import { z } from 'zod';

export const userProductStylesSchema = z.object({
  styles: z.array(z.string()),
});
