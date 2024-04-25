import { useMutation } from '@tanstack/react-query';
import {
  AuthorizeBiddersContractParams,
  ContractConfig,
  authorizeBidders,
  awaitTxConfirmed,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { logContractToast } from 'src/utils/contract';

export const AUTHORIZE_BIDDERS_QUERY_KEY = 'authorize-bidders';

export const useAuthorizeBidders = (config: ContractConfig) => {
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
      logContractToast({
        contractResponse: authorizeBiddersResponse,
        toastSuccessMsg: `Successfully authorized ${authorizeBiddersParams.biddersToAuthorize.length}  bidders`,
        toastErrorMsg: 'Authorizing bidders failed',
      });
      console.log({ authorizeBiddersResponse });
      const validatedAuthorizeBiddersResponse =
        contractOutputResultSchema.safeParse(authorizeBiddersResponse);
      if (validatedAuthorizeBiddersResponse.success) {
        toast.info('Confirming authorized bidders contract...');
        await awaitTxConfirmed(
          config,
          validatedAuthorizeBiddersResponse.data.value
        );

        return authorizeBiddersResponse;
      }
      return null;
    },
    onError: (error) => {
      console.error('Error authorizing bidders', error);
      toast.error(`Authorizing bidders failed: ${error}`);
    },
    onSuccess: (_, variables) => {
      toast.success('Confirmed authorized bidders contract');
      mixPanel && mixPanel.track('Authorized Bidders');
    },
  });
  return authorizeBiddersMutation;
};
