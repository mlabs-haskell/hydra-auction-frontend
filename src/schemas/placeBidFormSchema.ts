import { z } from 'zod';

export const placeBidFormSchema = z.object({
  auctionCs: z.string(),
  bidAmount: z.string(),
});

export type PlaceBidFormT = z.infer<typeof placeBidFormSchema>;
