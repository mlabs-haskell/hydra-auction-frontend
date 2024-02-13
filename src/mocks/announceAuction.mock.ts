import { AnnounceAuctionContractParams } from 'hydra-auction-offchain';

export const generateMockAnnounceAuctionParams = () => {
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
      biddingStart: '',
      biddingEnd: '',
      purchaseDeadline: '',
      cleanup: '',
      auctionFeePerDelegate: '5000000',
      startingBid: '6000000',
      minBidIncrement: '1000000',
      minDepositAmount: '3000000',
    },
    additionalAuctionLotOrefs: [],
  };
  return params;
};
