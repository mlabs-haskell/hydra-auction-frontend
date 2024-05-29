import { useQuery } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  queryStandingBidState,
} from 'hydra-auction-offchain';

export const STANDING_BID_STATE_QUERY_KEY = 'standing-bid-state';

export const useStandingBidState = (
  config: ContractConfig,
  auctionInfo: AuctionInfo
) => {
  const standingBidStateQuery = useQuery({
    queryKey: [STANDING_BID_STATE_QUERY_KEY, config, auctionInfo.auctionId],
    queryFn: async () => {
      console.log('useStandingBidState');
      return await queryStandingBidState(config, auctionInfo);
    },
  });

  return standingBidStateQuery;
};
