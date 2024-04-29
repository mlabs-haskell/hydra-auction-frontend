import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnnounceAuctionContractParams,
  announceAuction,
  WalletApp,
  ContractConfig,
} from 'hydra-auction-offchain';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { useMixpanel } from 'react-mixpanel-browser';

export const useAnnounceAuction = (config: ContractConfig) => {
  const queryClient = useQueryClient();
  const mixPanel = useMixpanel();
  const announceAuctionMutation = useMutation({
    mutationFn: async (auctionParams: AnnounceAuctionContractParams) => {
      toast.info('Creating auction...');
      console.log({ auctionParams, config });
      const announceAuctionResponse: any = await announceAuction(
        config,
        auctionParams
      );
      logContractToast({
        contractResponse: announceAuctionResponse,
        toastSuccessMsg: `Auction announced successfully! It may take a couple of minutes for the auction to appear.`,
        toastErrorMsg: 'Auction announcement failed:',
      });
      toast.success(
        `auctionMetadataOref: ${announceAuctionResponse?.value?.auctionInfo.metadataOref.transactionId}`
      );

      const announceAuctionValidated = contractOutputResultSchema.safeParse(
        announceAuctionResponse
      );
      if (announceAuctionValidated.success) {
        mixPanel && mixPanel.track('Auction Announced');
        setTimeout(() => {
          window.location.replace('/auction-list');
        }, 5000);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(`Auction announcement failed: ${JSON.stringify(error)}`);
      console.error('Error announcing auction', error);
    },
  });

  return announceAuctionMutation;
};
