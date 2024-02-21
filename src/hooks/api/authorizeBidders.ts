import { useMutation } from '@tanstack/react-query';
import {
  AuthorizeBiddersContractParams,
  WalletApp,
  authorizeBidders,
  awaitTxConfirmed,
} from 'hydra-auction-offchain';
import { toast } from 'react-toastify';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { logContractToast } from 'src/utils/contract';

export const AUTHORIZE_BIDDERS_QUERY_KEY = 'authorize-bidders';

export const useAuthorizeBidders = (walletApp: WalletApp) => {
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
        walletApp,
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
          walletApp,
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
    onSuccess: () => {
      toast.success('Confirmed authorized bidders contract');
    },
  });
  return authorizeBiddersMutation;
};
