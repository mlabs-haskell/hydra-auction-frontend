import { AuctionInfo } from 'hydra-auction-offchain';
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

export const getIsBidder = (
  auctionsBidding?: AuctionBiddingItem[],
  auctionInfo?: AuctionInfo
) => {
  if (!auctionsBidding || !auctionInfo) return false;
  return auctionsBidding.some(
    (biddingItem: AuctionBiddingItem) =>
      biddingItem.auctionId === auctionInfo.auctionId
  );
};

// TODO: implement functions that take the POSIX time for pre bidding, and bidding to return whether we should show
// enter auction, or bid forms
export const isAuctionEnterable = (): boolean => {
  return false;
};

export const isAuctionBiddable = (): boolean => {
  return false;
};
