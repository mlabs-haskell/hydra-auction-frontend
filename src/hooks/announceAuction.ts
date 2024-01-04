import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnnounceAuctionContractParams,
  announceAuction,
  WalletApp,
} from 'hydra-auction-offchain';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';

export const useAnnounceAuction = (walletName: string) => {
  const queryClient = useQueryClient();
  const walletApp: WalletApp = walletName as WalletApp;

  const announceAuctionMutation = useMutation({
    mutationFn: async (auctionParams: AnnounceAuctionContractParams) => {
      const announceAuctionResponse = await announceAuction(
        walletApp,
        auctionParams
      );
      return announceAuctionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
  });

  return announceAuctionMutation;
};
