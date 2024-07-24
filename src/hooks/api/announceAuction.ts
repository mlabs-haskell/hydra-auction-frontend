import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AnnounceAuctionContractParams,
  announceAuction,
  ContractConfig,
  awaitTxConfirmed,
  AnnounceAuctionContractOutput,
} from 'hydra-auction-offchain';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { useMixpanel } from 'react-mixpanel-browser';
import { getAuctionAssetUnit } from 'src/utils/auction';

export const useAnnounceAuction = (
  config: ContractConfig,
  walletAddress: string
) => {
  const queryClient = useQueryClient();
  const mixPanel = useMixpanel();
  const announceAuctionMutation = useMutation({
    mutationFn: async (auctionParams: AnnounceAuctionContractParams) => {
      toast.info('Creating auction...');
      if (!walletAddress) {
        throw new Error('Wallet address not found');
      }
      console.log({ auctionParams, config });
      const announceAuctionResponse = await announceAuction(
        config,
        auctionParams
      );

      const announceAuctionValidated =
        getValidContractResponse<AnnounceAuctionContractOutput>(
          announceAuctionResponse
        );
      return announceAuctionValidated;
    },
    onSuccess: async (announceAuctionValidated) => {
      toast.success(
        'Auction created, processing your auction now... This may take a few minutes.'
      );
      await awaitTxConfirmed(config, announceAuctionValidated?.txHash ?? '');
      toast.success('Auction processing complete.');

      // Easier to copy in transactionId to the hydra node for L2
      toast.success(
        `auctionMetadataOref: ${announceAuctionValidated?.auctionInfo.metadataOref?.transactionId}`
      );
      mixPanel?.track('AuctionAnnounceSucceeded', {
        auctionId: announceAuctionValidated?.auctionInfo.auctionId,
        walletAddr: walletAddress,
        delegateGroupUrl:
          announceAuctionValidated?.auctionInfo?.delegateInfo?.wsServers[0],
        minDeposit:
          announceAuctionValidated?.auctionInfo.auctionTerms?.minDepositAmount,
        startingBid:
          announceAuctionValidated?.auctionInfo.auctionTerms?.startingBid,
        auctionLot: getAuctionAssetUnit(announceAuctionValidated?.auctionInfo),
      });
      window.location.replace(
        `auction?auctionId=${announceAuctionValidated?.auctionInfo.auctionId}`
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_AUCTIONS_QUERY_KEY, config],
      });
    },
    onError: (error) => {
      toast.error(`Auction announcement failed: ${error.message}`);
      console.error('Error announcing auction', error);
    },
  });

  return announceAuctionMutation;
};
