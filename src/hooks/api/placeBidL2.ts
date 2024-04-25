import { useMutation } from '@tanstack/react-query';
import {
  ContractConfig,
  PlaceBidL2ContractParams,
  placeBidL2,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';

export const usePlaceBidL2 = (config: ContractConfig) => {
  const mixPanel = useMixpanel();

  const placeBidL2Mutation = useMutation({
    mutationFn: async (params: PlaceBidL2ContractParams) => {
      console.log('Placing bid L2');
      const placeBidL2Response = await placeBidL2(config, params);
      console.log({ placeBidL2Response });
      if (placeBidL2Response.tag === 'error')
        throw new Error(placeBidL2Response.value.message);
      return placeBidL2Response;
    },
    onSuccess: () => {
      toast.success('Bid placed successfully');
      mixPanel && mixPanel.track('Bid placed succesfully on L2');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return placeBidL2Mutation;
};
