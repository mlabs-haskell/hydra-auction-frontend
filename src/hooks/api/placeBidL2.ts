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
      if (
        placeBidL2Response?.tag === 'error' ||
        placeBidL2Response?.value?.tag?.toLowerCase() === 'error'
      ) {
        throw new Error(
          placeBidL2Response?.value?.value?.tag ??
            placeBidL2Response?.value?.message
        );
      }
      console.log({ placeBidL2Response });

      return placeBidL2Response;
    },
    onSuccess: () => {
      toast.success('Bid placed successfully on L2');
      mixPanel && mixPanel.track('Bid placed succesfully on L2');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return placeBidL2Mutation;
};
