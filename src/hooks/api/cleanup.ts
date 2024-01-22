import { useMutation } from '@tanstack/react-query';
import { AuctionInfo, cleanupAuction } from 'hydra-auction-offchain';

export const useCleanupAuction = () => {
  const cleanupMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await cleanupAuction(auctionInfo),
  });

  return cleanupMutation;
};
