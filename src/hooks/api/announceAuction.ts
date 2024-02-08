import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnnounceAuctionContractParams,
  announceAuction,
  WalletApp,
} from 'hydra-auction-offchain';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from 'src/utils/localStorage';

export const useAnnounceAuction = (walletName: string) => {
  const queryClient = useQueryClient();
  const walletApp: WalletApp = walletName as WalletApp;

  const announceAuctionMutation = useMutation({
    mutationFn: async (auctionParams: AnnounceAuctionContractParams) => {
      console.log({ auctionParams, walletApp });
      const announceAuctionResponse: any = await announceAuction(
        walletApp,
        auctionParams
      );
      console.log({ announceAuctionResponse });

      // Save seller address to local storage to determine if we are the seller/bidder on auction detail page
      const newSellerAddress =
        announceAuctionResponse.value.auctionInfo.auctionTerms.sellerAddress;
      const previousSellerAddress = getLocalStorageItem('sellerAddress');

      if (previousSellerAddress !== newSellerAddress) {
        setLocalStorageItem('sellerAddress', newSellerAddress);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error('Error announcing auction', error);
    },
  });

  return announceAuctionMutation;
};
