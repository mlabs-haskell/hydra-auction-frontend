import { useMutation } from '@tanstack/react-query';
import {
  ContractConfig,
  MoveBidL2ContractParams,
  moveBidL2,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';

export const useMoveBidL2 = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const moveBidL2Mutation = useMutation({
    mutationFn: async (moveBidParams: MoveBidL2ContractParams) => {
      if (config) {
        console.log('Moving bid L2');
        const moveBidL2Response = await moveBidL2(config, moveBidParams);
        console.log({ moveBidL2Response });
        if (moveBidL2Response.tag === 'error')
          throw new Error(moveBidL2Response.value.message);

        return moveBidL2Response;
      }
    },
    onSuccess: () => {
      toast.success('Bidding moved to L2');
      mixPanel && mixPanel.track('Bidding moved to L2');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return moveBidL2Mutation;
};
