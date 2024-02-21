import { useQuery } from '@tanstack/react-query';
import {
  AuctionInfo,
  WalletApp,
  discoverBidders,
} from 'hydra-auction-offchain';

export const DISCOVER_BIDDERS_QUERY_KEY = 'discover-bidders';

export const useDiscoverBidders = (
  walletApp: WalletApp,
  auctionInfo: AuctionInfo
) => {
  const discoverBiddersQuery = useQuery({
    queryKey: [DISCOVER_BIDDERS_QUERY_KEY, walletApp, auctionInfo.auctionId],
    queryFn: async () => {
      console.log({ discoverBiddersParams: auctionInfo });
      const discoverBiddersResponse = await discoverBidders(
        walletApp,
        auctionInfo
      );
      console.log({ discoverBiddersResponse });
      return discoverBiddersResponse;
    },
  });

  return discoverBiddersQuery;
};
