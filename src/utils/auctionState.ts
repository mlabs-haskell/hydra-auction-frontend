export enum AuctionState {
  PRE_AUCTION,
  PRE_BIDDING,
  BIDDING,
  VOUCHER_ACTIVE,
  VOUCHER_EXPIRED,
  CLEANUP,
}

export enum AuctionListSortState {
  ALL = 'all',
  SELLER = 'seller',
  ////
  // this represents all 3 states for the bidder we are naming it not seller for now
  // - bidder authorized
  // - bidder entered auction but not authorized
  // - bidder hasn't entered auction
  NOT_SELLER = 'not-seller',
  ////

  ENTERED = 'entered',
  NOT_ENTERED = 'not-entered',
  AUTHORIZED = 'authorized',
}

export const auctionListFilterOptions = [
  { accessor: AuctionListSortState.ALL, label: 'All' },
  { accessor: AuctionListSortState.SELLER, label: 'Seller' },
  { accessor: AuctionListSortState.NOT_SELLER, label: 'Not Seller' },
  // { accessor: AuctionListSortState.ENTERED, label: 'Entered' },
  // { accessor: AuctionListSortState.NOT_ENTERED, label: 'Not Entered' },
  // { accessor: AuctionListSortState.AUTHORIZED, label: 'Authorized' },
];

export const getIsSeller = (sellerAddresses?: string[], auction?: any) => {
  if (!sellerAddresses || !auction) return false;
  return sellerAddresses.includes(auction.auctionTerms.sellerAddress);
};

// TODO: implement functions that take the POSIX time for pre bidding, and bidding to return whether we should show
// enter auction, or bid forms
export const isAuctionEnterable = (): boolean => {
  return false;
};

export const isAuctionBiddable = (): boolean => {
  return false;
};
