import { AuctionInfo } from 'hydra-auction-offchain';

export const getAuctionAssetUnit = (auction?: AuctionInfo) => {
  const tn = auction?.auctionTerms.auctionLot[0].tn;
  const cs = auction?.auctionTerms.auctionLot[0].cs;
  return `${cs}${tn}`;
};
