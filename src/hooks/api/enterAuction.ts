import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ContractConfig,
  EnterAuctionContractParams,
  enterAuction,
} from 'hydra-auction-offchain';
import { toast } from 'react-toastify';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from 'src/utils/localStorage';
import { getValidContractResponse } from 'src/utils/contract';
import { AUCTIONS_ENTERED_QUERY_KEY } from './auctions';
import { useMixpanel } from 'react-mixpanel-browser';
import { trackError } from 'src/utils/errorTracking';

export type AuctionBiddingItem = {
  auctionId: string;
  depositAmount: string;
  assetUnit: string;
};

export type EnterAuctionMutationParams = {
  enterAuctionParams: EnterAuctionContractParams;
  walletAddress: string;
};

export type WalletDataLocalStorage = {
  bidding: AuctionBiddingItem[];
};
export const useEnterAuction = (config: ContractConfig) => {
  const queryClient = useQueryClient();
  const mixPanel = useMixpanel();
  const enterAuctionMutation = useMutation({
    mutationFn: async (
      enterAuctionMutationParams: EnterAuctionMutationParams
    ) => {
      toast.info(`Entering auction...`);
      const enterAuctionParams = enterAuctionMutationParams.enterAuctionParams;

      console.log({ enterAuctionParams, config });
      const enterAuctionResponse = await enterAuction(
        config,
        enterAuctionParams
      );
      console.log({ enterAuctionResponse });

      const enterAuctionValidated =
        getValidContractResponse(enterAuctionResponse);

      return {
        data: enterAuctionValidated,
        params: enterAuctionParams,
        walletAddress: enterAuctionMutationParams.walletAddress,
      };
    },
    onSuccess: (mutationResponse) => {
      toast.success(
        'Auction entered succesfully. Once the the seller approves your deposit, you will be able to bid.'
      );
      mixPanel?.track('EnterAuctionSucceeded', {
        auctionId: mutationResponse?.params.auctionInfo?.auctionId,
        walletAddr: mutationResponse?.walletAddress,
      });
      // For now a way to simulate buyer oracle so we can see whether we are a bidder for each auction
      // This will need to be moved to the hook which authorizes bidders by the seller. It is here
      // just for testing purposes.
      const mutationParams = mutationResponse.params;
      const auctionInfo = mutationParams.auctionInfo;
      const walletAddress = mutationResponse.walletAddress;
      const walletData: WalletDataLocalStorage = getLocalStorageItem(
        walletAddress
      ) || {
        bidding: [],
      };

      if (
        !walletData.bidding.find(
          (auction: AuctionBiddingItem) =>
            auction.auctionId === auctionInfo.auctionId
        )
      ) {
        setLocalStorageItem(walletAddress, {
          ...walletData,
          bidding: [
            ...walletData.bidding,
            {
              auctionId: auctionInfo.auctionId,
              depositAmount: mutationParams.depositAmount,
            },
          ],
        });
      }

      queryClient.invalidateQueries({
        queryKey: [
          [
            AUCTIONS_ENTERED_QUERY_KEY,
            mutationResponse.params.auctionInfo.auctionId,
          ],
        ],
      });
    },
    onError: (error, params) => {
      trackError(error, 'enterAuction', mixPanel, params);
      toast.error(`Entering auction failed: ${error.message}`);
      console.log('ENTER AUCTION MUTATION ERROR', error);
    },
  });

  return enterAuctionMutation;
};
