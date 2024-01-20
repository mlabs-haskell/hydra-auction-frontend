import { z } from 'zod';

export const placeBidFormSchema = z.object({
  bidAmount: z.number(),
});

export type PlaceBidFormT = z.infer<typeof placeBidFormSchema>;
