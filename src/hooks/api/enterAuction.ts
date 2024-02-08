import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EnterAuctionContractParams,
  WalletApp,
  enterAuction,
} from 'hydra-auction-offchain';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from 'src/utils/localStorage';

export type AuctionBiddingItem = {
  auctionId: string;
  depositAmount: string;
  assetUnit: string;
};

const AUCTIONS_BIDDING_QUERY_KEY = 'auctions-bidding';

export type EnterAuctionMutationParams = {
  enterAuctionParams: EnterAuctionContractParams;
  walletAddress: string;
};

export type WalletDataLocalStorage = {
  bidding: AuctionBiddingItem[];
};
export const useEnterAuction = (walletApp: WalletApp) => {
  const queryClient = useQueryClient();

  const enterAuctionMutation = useMutation({
    mutationFn: async (
      enterAuctionMutationParams: EnterAuctionMutationParams
    ) => {
      const enterAuctionParams = enterAuctionMutationParams.enterAuctionParams;
      console.log({ enterAuctionParams });
      const enterAuctionResponse = await enterAuction(
        walletApp,
        enterAuctionParams
      );
      console.log({ enterAuctionResponse });
      return {
        data: enterAuctionResponse,
        params: enterAuctionParams,
        walletAddress: enterAuctionMutationParams.walletAddress,
      };
    },
    onSuccess: (mutationResponse) => {
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
            AUCTIONS_BIDDING_QUERY_KEY,
            mutationResponse.params.auctionInfo.auctionId,
          ],
        ],
      });
    },
    onError: (error) => {
      console.log('ENTER AUCTION MUTATION ERROR', error);
    },
  });

  return enterAuctionMutation;
};
// TODO: Add logic on auction-list page to sweep all auctions and check if we are seller / bidder
// Also add logic to remove auction from local storage if it is no longer active
export const useAuctionsBidding = (
  walletAddress?: string,
  auctionId?: string
) => {
  return useQuery({
    queryKey: [AUCTIONS_BIDDING_QUERY_KEY, auctionId],
    queryFn: async () => {
      if (auctionId && walletAddress) {
        const walletData = getLocalStorageItem(walletAddress) || {};
        if (walletData) {
          if (walletAddress) {
            return walletData.bidding || [];
          }
        }
        return [];
      }
    },
    enabled: !!walletAddress && !!auctionId,
  });
};
