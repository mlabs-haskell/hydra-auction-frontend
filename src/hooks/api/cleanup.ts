import { useMutation } from '@tanstack/react-query';
import { AuctionInfo, WalletApp, cleanupAuction } from 'hydra-auction-offchain';

export const useCleanupAuction = (walletApp: WalletApp) => {
  const cleanupMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await cleanupAuction(walletApp, auctionInfo),
  });

  return cleanupMutation;
};
