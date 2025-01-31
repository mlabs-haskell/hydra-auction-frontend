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
    startingBid: z.string(),
  }),
  delegateInfo: z.object({
    httpServers: z.array(z.string()),
    wsServers: z.array(z.string()),
  }),
  additionalAuctionLotOrefs: z.array(
    z.object({
      index: z.string(),
      transactionId: z.string(),
    })
  ),
});

export type AuctionForm = z.infer<typeof auctionFormSchema>;
