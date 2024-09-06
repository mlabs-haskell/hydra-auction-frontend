import { z } from 'zod';
import { auctionTermsSchema } from './auctionTermsSchema';

export const enterAuctionFormSchema = z.object({
  auctionInfo: z.object({
    auctionId: z.string(),
    auctionTerms: auctionTermsSchema,
    auctionEscrowAddr: z.string(),
    bidderDepositAddr: z.string(),
    feeEscrowAddr: z.string(),
    standingBidAddr: z.string(),
    metadataOref: z.nullable(
      z.object({
        index: z.string(),
        transactionId: z.string(),
      })
    ),
    delegateInfo: z.object({
      httpServers: z.array(z.string()),
      wsServers: z.array(z.string()),
    }),
  }),

  depositAmount: z.string(),
});
