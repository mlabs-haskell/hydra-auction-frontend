import {
  AuctionInfo,
  ContractConfig,
  PlaceBidContractParams,
  placeBid,
} from 'hydra-auction-offchain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';
import { ADA_CURRENCY_SYMBOL, formatLovelaceToAda } from 'src/utils/currency';
import { useMixpanel } from 'react-mixpanel-browser';

export const usePlaceBid = (
  config: ContractConfig,
  auctionInfo: AuctionInfo,
  sellerSignature: string
) => {
  const queryClient = useQueryClient();
  const mixPanel = useMixpanel();
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
      const placeBidResponse = await placeBid(config, params);
      console.log({ placeBidResponse });
      if (placeBidResponse.tag === 'error') {
        throw new Error(placeBidResponse.value.message);
      }
      logContractToast({
        contractResponse: placeBidResponse,
        toastSuccessMsg: `You succesfully placed a bid for ${ADA_CURRENCY_SYMBOL}${formattedPrice}.`,
        toastErrorMsg: `Placing bid failed`,
      });

      return placeBidResponse;
    },
    onSuccess: () => {
      mixPanel && mixPanel.track('Bid Placed');
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.log('PLACE BID MUTATION ERROR', error);
      toast.error(`Placing bid failed: ${error}`);
    },
  });

  return placeBidMutation;
};
