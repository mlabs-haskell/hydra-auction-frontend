import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  cleanupAuction,
} from 'hydra-auction-offchain';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';

export const useCleanupAuction = (config: ContractConfig) => {
  const cleanupMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      const cleanupResponse = await cleanupAuction(config, auctionInfo);
      console.log({ cleanupResponse });
      const cleanupValidated = getValidContractResponse(cleanupResponse);
      return cleanupValidated;
    },
    onSuccess: () => {
      toast.success('Auction cleaned up successfully');
    },
    onError: (error) => {
      console.error('Error cleaning up auction', error);
      toast.error(`Auction cleanup failed: ${error.message}`);
    },
  });

  return cleanupMutation;
};
