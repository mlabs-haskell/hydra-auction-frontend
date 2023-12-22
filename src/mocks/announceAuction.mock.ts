import { AnnounceAuctionContractParams } from 'hydra-auction-offchain';

export const MOCK_ANNOUNCE_AUCTION_PARAMS: AnnounceAuctionContractParams = {
  auctionTerms: {
    auctionLot: [
      {
        cs: 'c0f8644a01a6bf5db02f4afe30d604975e63dd274f1098a1738e561d',
        tn: '4d6f6e614c697361',
        quantity: '1',
      },
    ],
    sellerPkh: '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c',
    sellerVk:
      '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9',
    delegates: ['2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c'],
    biddingStart: String(Math.floor(Date.now() / 1000)),
    biddingEnd: String(Math.floor(Date.now() / 1000) + 10000),
    purchaseDeadline: String(Math.floor(Date.now() / 1000) + 20000),
    cleanup: String(Math.floor(Date.now() / 1000) + 30000),
    auctionFeePerDelegate: '5000000',
    startingBid: '6000000',
    minBidIncrement: '1000000',
    minDepositAmount: '3000000',
  },
  additionalAuctionLotOrefs: [],
};
