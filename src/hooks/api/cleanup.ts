import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  cleanupAuction,
} from 'hydra-auction-offchain';

export const useCleanupAuction = (config: ContractConfig) => {
  const cleanupMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      return await cleanupAuction(config, auctionInfo);
    },
  });

  return cleanupMutation;
};
