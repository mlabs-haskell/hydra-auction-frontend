import {
  AuctionInfo,
  queryAuctions,
  type WalletApp,
} from 'hydra-auction-offchain';
import { useQuery } from '@tanstack/react-query';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const QUERY_AUCTIONS_QUERY_KEY = 'query-auctions';

export const useActiveAuctions = (walletApp: WalletApp) => {
  const activeAuctions = useQuery({
    queryKey: [QUERY_AUCTIONS_QUERY_KEY],
    queryFn: async () => {
      const auctions = await queryAuctions(walletApp);
      return auctions;
    },
    refetchInterval: 10000,
  });

  return activeAuctions;
};
