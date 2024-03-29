import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnnounceAuctionContractParams,
  announceAuction,
  WalletApp,
} from 'hydra-auction-offchain';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';

export const useAnnounceAuction = (walletName: string) => {
  const queryClient = useQueryClient();
  const walletApp: WalletApp = walletName as WalletApp;

  const announceAuctionMutation = useMutation({
    mutationFn: async (auctionParams: AnnounceAuctionContractParams) => {
      toast.info('Creating auction...');
      console.log({ auctionParams, walletApp });
      const announceAuctionResponse: any = await announceAuction(
        walletApp,
        auctionParams
      );
      logContractToast({
        contractResponse: announceAuctionResponse,
        toastSuccessMsg:
          'Auction announced successfully! It may take a couple of minutes for the auction to appear.',
        toastErrorMsg: 'Auction announcement failed:',
      });

      const announceAuctionValidated = contractOutputResultSchema.safeParse(
        announceAuctionResponse
      );
      if (announceAuctionValidated.success) {
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
