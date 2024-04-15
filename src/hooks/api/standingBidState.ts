import { useQuery } from '@tanstack/react-query';
import {
  AuctionInfo,
  WalletApp,
  queryStandingBidState,
} from 'hydra-auction-offchain';

export const STANDING_BID_STATE_QUERY_KEY = 'standing-bid-state';

export const useStandingBidState = (
  walletApp: WalletApp,
  auctionInfo: AuctionInfo
) => {
  const standingBidStateQuery = useQuery({
    queryKey: [STANDING_BID_STATE_QUERY_KEY, walletApp, auctionInfo.auctionId],
    queryFn: async () => await queryStandingBidState(walletApp, auctionInfo),
  });

  return standingBidStateQuery;
};
