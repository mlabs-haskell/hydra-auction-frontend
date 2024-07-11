import { useQuery } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  queryStandingBidState,
} from 'hydra-auction-offchain';
import { getValidContractResponse } from 'src/utils/contract';
import { BASE_REFETCH_INTERVAL } from 'src/utils/refetch';

export const STANDING_BID_STATE_QUERY_KEY = 'standing-bid-state';

export const useStandingBidState = (
  config: ContractConfig,
  auctionInfo: AuctionInfo
) => {
  const standingBidStateQuery = useQuery({
    queryKey: [STANDING_BID_STATE_QUERY_KEY, config, auctionInfo.auctionId],
    queryFn: async () => {
      const standingBidStateResponse = await queryStandingBidState(
        config,
        auctionInfo
      );
      return getValidContractResponse(standingBidStateResponse);
    },
    refetchInterval: BASE_REFETCH_INTERVAL,
  });

  return standingBidStateQuery;
};
