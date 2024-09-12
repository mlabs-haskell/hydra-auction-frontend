import { useMutation } from '@tanstack/react-query';
import {
  ContractConfig,
  PlaceBidL2ContractParams,
  placeBidL2,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { trackError } from 'src/utils/errorTracking';

export const usePlaceBidL2 = (config: ContractConfig) => {
  const mixPanel = useMixpanel();

  const placeBidL2Mutation = useMutation({
    mutationFn: async (params: PlaceBidL2ContractParams) => {
      const placeBidL2Response = await placeBidL2(config, params);
      console.log({ placeBidL2Response });
      const placeBidL2Validated = getValidContractResponse(placeBidL2Response);

      return placeBidL2Validated;
    },
    onSuccess: () => {
      toast.success('Bid placed successfully on L2');
      mixPanel?.track('Bid placed succesfully on L2');
    },
    onError: (error, params) => {
      trackError(error, 'placeBidL2', mixPanel, params);
      toast.error(`Placing bid on L2 failed: ${error.message}`);
      console.log(error);
    },
  });

  return placeBidL2Mutation;
};
