import { useMutation } from '@tanstack/react-query';
import {
  ContractConfig,
  StartBiddingContractParams,
  startBidding,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getAuctionAssetUnit } from 'src/utils/auction';
import { getValidContractResponse } from 'src/utils/contract';

export const START_BIDDING_QUERY_KEY = 'start-bidding';

export const useStartBidding = (config: ContractConfig, walletAddr: string) => {
  const mixPanel = useMixpanel();
  const startBiddingMutation = useMutation({
    mutationFn: async (startBiddingParams: StartBiddingContractParams) => {
      toast.info(`Starting bidding for your auction...`);
      console.log({ startBiddingParams });
      const startBiddingResponse = await startBidding(
        config,
        startBiddingParams
      );
      console.log({ startBiddingResponse });
      const startBiddingValidated =
        getValidContractResponse(startBiddingResponse);
      return {
        contract: startBiddingValidated,
        auctionInfo: startBiddingParams.auctionInfo,
      };
    },
    onSuccess(startBiddingValidated) {
      toast.success('Bidding for your auction started succesfully.');
      mixPanel?.track('StartBiddingSucceeded', {
        auctionId: startBiddingValidated?.auctionInfo.auctionId,
        auctionLot:
          getAuctionAssetUnit(startBiddingValidated?.auctionInfo) ?? '',
        walletAddr: walletAddr,
      });
    },
    onError: (error) => {
      console.log({ l: 'startBidding error', error });
      toast.error(`Start bidding failed: ${error.message}`);
    },
  });

  return startBiddingMutation;
};
