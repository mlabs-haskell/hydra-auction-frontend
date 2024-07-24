import { useMutation } from '@tanstack/react-query';
import {
  AuthorizeBiddersContractParams,
  ContractConfig,
  authorizeBidders,
  awaitTxConfirmed,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';

export const AUTHORIZE_BIDDERS_QUERY_KEY = 'authorize-bidders';

export const useAuthorizeBidders = (
  config: ContractConfig,
  auctionId: string
) => {
  const mixPanel = useMixpanel();
  const authorizeBiddersMutation = useMutation({
    mutationFn: async (
      authorizeBiddersParams: AuthorizeBiddersContractParams
    ) => {
      console.log({ authorizeBiddersParams });
      toast.info('Authorizing bidders (this may take a few minutes)...');
      if (!authorizeBiddersParams.biddersToAuthorize.length) {
        toast.error('No bidders to authorize');
        return null;
      }
      const authorizeBiddersResponse = await authorizeBidders(
        config,
        authorizeBiddersParams
      );
      console.log({ authorizeBiddersResponse });
      const authorizeBiddersValidated = getValidContractResponse(
        authorizeBiddersResponse
      );
      return {
        params: authorizeBiddersParams,
        contract: authorizeBiddersValidated,
        auctionId,
      };
    },
    onError: (error) => {
      console.error('Error authorizing bidders', error);
      toast.error(`Authorizing bidders failed: ${error.message}`);
    },
    onSuccess: async (authorizeBiddersValidated) => {
      if (authorizeBiddersValidated?.contract) {
        toast.update('Authorizing bidders (this may take a few minutes)...');
        await awaitTxConfirmed(config, authorizeBiddersValidated.contract);
        toast.success('Confirmed authorized bidders contract.');

        mixPanel?.track('AuthorizeBiddersSucceeded', {
          auctionId: authorizeBiddersValidated?.auctionId,
          walletAddr: undefined,
          bidders: authorizeBiddersValidated?.params.biddersToAuthorize,
        });
      }
    },
  });
  return authorizeBiddersMutation;
};
