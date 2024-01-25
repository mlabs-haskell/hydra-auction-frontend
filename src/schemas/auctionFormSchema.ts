import { z } from 'zod';
export const auctionFormSchema = z.object({
  auctionTerms: z.object({
    auctionLot: z.array(
      z.object({
        cs: z.string(),
        quantity: z.string(),
        tn: z.string(),
      })
    ),
    biddingStart: z.string(),
    biddingEnd: z.string(),
    purchaseDeadline: z.string(),
    cleanup: z.string(),
    auctionFeePerDelegate: z.string(),
    delegates: z.array(z.string()),
    minBidIncrement: z.string(),
    minDepositAmount: z.string(),
    sellerAddress: z.string(),
    sellerVk: z.string(),
    startingBid: z.string(),
  }),
});

export type AuctionForm = z.infer<typeof auctionFormSchema>;
