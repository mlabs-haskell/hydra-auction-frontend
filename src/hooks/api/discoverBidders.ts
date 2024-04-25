import { useQuery } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  discoverBidders,
} from 'hydra-auction-offchain';

export const DISCOVER_BIDDERS_QUERY_KEY = 'discover-bidders';

export const useDiscoverBidders = (
  config: ContractConfig,
  auctionInfo: AuctionInfo
) => {
  const discoverBiddersQuery = useQuery({
    queryKey: [DISCOVER_BIDDERS_QUERY_KEY, config, auctionInfo.auctionId],
    queryFn: async () => {
      console.log('useDiscoverBidders');
      console.log({ discoverBiddersParams: auctionInfo });

      const discoverBiddersResponse = await discoverBidders(
        config,
        auctionInfo
      );
      console.log({ discoverBiddersResponse });
      return discoverBiddersResponse;
    },
  });

  return discoverBiddersQuery;
};
