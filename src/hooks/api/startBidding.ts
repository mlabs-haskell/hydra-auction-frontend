import { useMutation } from '@tanstack/react-query';
import {
  StartBiddingContractParams,
  WalletApp,
  startBidding,
} from 'hydra-auction-offchain';
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';

export const START_BIDDING_QUERY_KEY = 'start-bidding';

export const useStartBidding = (walletApp: WalletApp) => {
  const startBiddingMutation = useMutation({
    mutationFn: async (startBiddingParams: StartBiddingContractParams) => {
      toast.info(`Starting bidding for your auction...`);
      console.log({ startBiddingParams });

      const startBiddingResponse = await startBidding(
        walletApp,
        startBiddingParams
      );
      console.log({ startBiddingResponse });
      logContractToast({
        contractResponse: startBiddingResponse,
        toastSuccessMsg: 'Bidding for your auction started succesfully.',
        toastErrorMsg: 'Start bidding failed',
      });
    },
    onError: (error) => {
      console.log({ l: 'startBidding error', error });
      toast.error(`Start bidding failed: ${error}`);
    },
  });

  return startBiddingMutation;
};
