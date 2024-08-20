import { useMutation } from '@tanstack/react-query';
import {
  ContractConfig,
  MoveBidL2ContractParams,
  moveBidL2,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { trackError } from 'src/utils/errorTracking';

export const useMoveBidL2 = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const moveBidL2Mutation = useMutation({
    mutationFn: async (moveBidParams: MoveBidL2ContractParams) => {
      if (config) {
        console.log('Moving bid L2');
        const moveBidL2Response = await moveBidL2(config, moveBidParams);
        console.log({ moveBidL2Response });
        const moveBidL2Validated = getValidContractResponse(moveBidL2Response);

        return moveBidL2Validated;
      }
    },
    onSuccess: () => {
      toast.success('Bidding moved to L2');
      mixPanel?.track('Bidding moved to L2');
    },
    onError: (error, params) => {
      trackError(error, 'moveBidL2', mixPanel, params);
      toast.error(`Moving bid to L2 failed: ${error.message}`);
    },
  });

  return moveBidL2Mutation;
};
