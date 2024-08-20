import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  cleanupAuction,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { trackError } from 'src/utils/errorTracking';

export const useCleanupAuction = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const cleanupMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      const cleanupResponse = await cleanupAuction(config, auctionInfo);
      console.log({ cleanupResponse });
      const cleanupValidated = getValidContractResponse(cleanupResponse);
      return cleanupValidated;
    },
    onSuccess: () => {
      console.log('Auction cleaned up successfully');
      toast.success('Auction cleaned up successfully');
    },
    onError: (error, params) => {
      trackError(error, 'cleanupAuction', mixPanel, params);
      console.error('Error cleaning up auction', error);
      toast.error(`Auction cleanup failed: ${error.message}`);
    },
  });

  return cleanupMutation;
};
