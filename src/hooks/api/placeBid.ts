import {
  AuctionInfo,
  PlaceBidContractParams,
  placeBid,
  type WalletApp,
} from 'hydra-auction-offchain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';
import { ADA_CURRENCY_SYMBOL, formatLovelaceToAda } from 'src/utils/currency';

export const usePlaceBid = (
  auctionInfo: AuctionInfo,
  sellerSignature: string,
  walletApp: WalletApp
) => {
  const queryClient = useQueryClient();

  const placeBidMutation = useMutation({
    mutationFn: async (bidAmount: string) => {
      const formattedPrice = formatLovelaceToAda(bidAmount);
      toast.info(`Placing bid for ${ADA_CURRENCY_SYMBOL}${formattedPrice}...`);

      const params: PlaceBidContractParams = {
        auctionInfo,
        sellerSignature: sellerSignature,
        bidAmount,
      };
      console.log({ placeBidParams: params });
      const placeBidResponse = await placeBid(walletApp, params);
      console.log({ placeBidResponse });
      logContractToast({
        contractResponse: placeBidResponse,
        toastSuccessMsg: `You succesfully placed a bid for ${ADA_CURRENCY_SYMBOL}${formattedPrice}.`,
        toastErrorMsg: `Placing bid failed`,
      });

      return placeBidResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.log('PLACE BID MUTATION ERROR', error);
      toast.error(`Placing bid failed: ${error}`);
    },
  });

  return placeBidMutation;
};
