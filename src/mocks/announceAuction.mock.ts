import { AnnounceAuctionContractParams } from 'hydra-auction-offchain';

export const MOCK_ANNOUNCE_AUCTION_PARAMS: AnnounceAuctionContractParams = {
  auctionTerms: {
    auctionLot: [
      {
        cs: '5e42b3d7b9c162888bddfd00f5077b3ab54bf978ab62c30d6397bb14',
        tn: '74616c6c35',
        quantity: '1',
      },
    ],
    // sellerPkh: '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c',
    // sellerVk:
    //   '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9',
    delegates: ['2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c'],
    biddingStart: String(Date.now() + 300000),
    biddingEnd: String(Date.now() + 600000000),
    purchaseDeadline: String(Date.now() + 700000000),
    cleanup: String(Date.now() + 800000000),
    auctionFeePerDelegate: '2100000',
    startingBid: '3000000',
    minBidIncrement: '100000',
    minDepositAmount: '300000',
  },
  additionalAuctionLotOrefs: [],
};
