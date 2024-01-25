import { z } from 'zod';

export const valueEntrySchema = z.object({
  cs: z.string(),
  tn: z.string(),
  quantity: z.string(),
});
export const auctionTermsSchema = z.object({
  auctionLot: z.array(valueEntrySchema),
  delegates: z.array(z.string()),
  biddingStart: z.string(),
  biddingEnd: z.string(),
  purchaseDeadline: z.string(),
  cleanup: z.string(),
  auctionFeePerDelegate: z.string(),
  startingBid: z.string(),
  minBidIncrement: z.string(),
  minDepositAmount: z.string(),
  sellerAddress: z.string(),
  sellerVk: z.string(),
});
