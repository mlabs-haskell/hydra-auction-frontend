import { AnnounceAuctionContractParams } from 'hydra-auction-offchain';

export const generateMockAnnounceAuctionParams = () => {
  const nowTime = Date.now();
  const params: AnnounceAuctionContractParams = {
    auctionTerms: {
      auctionLot: [
        {
          cs: '',
          tn: '',
          quantity: '1',
        },
      ],
      delegates: ['2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c'],
      biddingStart: (nowTime + 120000).toString(),
      biddingEnd: (nowTime + 80000000).toString(),
      purchaseDeadline: (nowTime + 80000000 * 200000).toString(),
      cleanup: (nowTime + 80000000 + 400000).toString(),
      auctionFeePerDelegate: '5000000',
      startingBid: '6000000',
      minBidIncrement: '1000000',
      minDepositAmount: '3000000',
    },
    additionalAuctionLotOrefs: [],
  };
  return params;
};
