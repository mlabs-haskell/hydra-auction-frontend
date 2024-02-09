import { AuctionInfo, ContractOutput } from 'hydra-auction-offchain';
import { AuctionBiddingItem } from 'src/hooks/api/enterAuction';

export enum AuctionState {
  PRE_AUCTION,
  PRE_BIDDING,
  BIDDING,
  VOUCHER_ACTIVE,
  VOUCHER_EXPIRED,
  CLEANUP,
}

export const getIsSeller = (sellerAddress?: string, auction?: any) => {
  if (!sellerAddress || !auction) return false;
  return sellerAddress === auction.auctionTerms.sellerAddress;
};

// TODO: implement functions that take the POSIX time for pre bidding, and bidding to return whether we should show
// enter auction, or bid forms
export const isAuctionEnterable = (): boolean => {
  return false;
};

export const isAuctionBiddable = (): boolean => {
  return false;
};
