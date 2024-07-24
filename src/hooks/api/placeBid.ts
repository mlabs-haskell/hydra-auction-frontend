import {
  AuctionInfo,
  ContractConfig,
  PlaceBidContractParams,
  placeBid,
} from 'hydra-auction-offchain';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { ADA_CURRENCY_SYMBOL, formatLovelaceToAda } from 'src/utils/currency';
import { useMixpanel } from 'react-mixpanel-browser';
import { STANDING_BID_STATE_QUERY_KEY } from './standingBidState';

export const usePlaceBid = (
  config: ContractConfig,
  auctionInfo: AuctionInfo,
  sellerSignature: string,
  address: string
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
      const placeBidValidated = getValidContractResponse(placeBidResponse);
      return {
        placeBidValidated,
        formattedPrice,
        auctionInfo,
      };
    },
    onSuccess: (data) => {
      toast.success(
        `You succesfully placed a bid for ${ADA_CURRENCY_SYMBOL}${data.formattedPrice}.`
      );

      mixPanel?.track('PlaceBidSucceeded', {
        auctionId: data.auctionInfo.auctionId,
        walletAddr: address,
        layer: 1, // 1 | 2
        amount: Number(data.formattedPrice),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_AUCTIONS_QUERY_KEY, config],
      });
      queryClient.invalidateQueries({
        queryKey: [STANDING_BID_STATE_QUERY_KEY, config, auctionInfo.auctionId],
      });
    },
    onError: (error) => {
      console.log('PLACE BID MUTATION ERROR', error);
      toast.error(`Failed to place bid ${error.message}`);
    },
  });

  return placeBidMutation;
};
