import { z } from 'zod';

export const enterAuctionFormSchema = z.object({
  walletApp: z.string(),
  auctionCs: z.string(),
  bidderVk: z.string(),
  depositAmount: z.string().nullable(),
});

export type EnterAuctionT = z.infer<typeof enterAuctionFormSchema>;
