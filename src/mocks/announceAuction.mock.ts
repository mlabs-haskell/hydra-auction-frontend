import {
  AnnounceAuctionContractParams,
  AuctionInfo,
} from 'hydra-auction-offchain';
import { ONE_DAY_MS, ONE_HOUR_MS } from 'src/utils/date';

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
      delegates: [
        'ac55de689702d745e77050ce83b77ff9619383bb802e40fb90aa3be4',
        'e17e5b8c19c89d663c66b3e4943972d7b6dd70a711fade4cf1a6a95a',
      ],
      biddingStart: '',
      biddingEnd: '',
      purchaseDeadline: '',
      cleanup: '',
      auctionFeePerDelegate: '5000000',
      startingBid: '12000000',
      minBidIncrement: '1000000',
      minDepositAmount: '3000000',
    },
    delegateInfo: {
      httpServers: ['http://127.0.0.1:7010', 'http://127.0.0.1:7011'],
      wsServers: ['ws://127.0.0.1:7020', 'ws://127.0.0.1:7021'],
    },
    additionalAuctionLotOrefs: [],
  };
  return params;
};

export const generateMockAuctionInfo = (): AuctionInfo => {
  const info: AuctionInfo = {
    auctionId: 'mockAuctionId',
    auctionEscrowAddr: 'mockAuctionEscrowAddr',
    bidderDepositAddr: 'mockBidderDepositAddr',
    feeEscrowAddr: 'mockFeeEscrowAddr',
    standingBidAddr: 'mockStandingBidAddr',
    metadataOref: null,
    auctionTerms: {
      sellerAddress: 'mockSellerAddress',
      sellerVk: 'mockSellerVk',
      auctionLot: [
        {
          cs: 'mockCs',
          tn: 'mockTn',
          quantity: '1',
        },
      ],
      delegates: [
        'ac55de689702d745e77050ce83b77ff9619383bb802e40fb90aa3be4',
        'e17e5b8c19c89d663c66b3e4943972d7b6dd70a711fade4cf1a6a95a',
      ],
      biddingStart: new Date(Date.now() + ONE_HOUR_MS)
        .toISOString()
        .split('.')[0],
      biddingEnd: new Date(Date.now() + 2 * ONE_HOUR_MS)
        .toISOString()
        .split('.')[0],
      purchaseDeadline: new Date(Date.now() + ONE_DAY_MS)
        .toISOString()
        .split('.')[0],
      cleanup: new Date(Date.now() + 2 * ONE_DAY_MS)
        .toISOString()
        .split('.')[0],
      auctionFeePerDelegate: '5000000',
      startingBid: '12000000',
      minBidIncrement: '1000000',
      minDepositAmount: '3000000',
    },
    delegateInfo: {
      httpServers: ['http://127.0.0.1:7010', 'http://127.0.0.1:7011'],
      wsServers: ['ws://127.0.0.1:7020', 'ws://127.0.0.1:7021'],
    },
  };
  return info;
};
