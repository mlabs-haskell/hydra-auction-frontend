import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  WalletApp,
  claimAuctionLotBidder,
  claimAuctionLotSeller,
  claimDepositLoser,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { logContractToast } from 'src/utils/contract';

// Bidder wins auction
export const useClaimAuctionLotBidder = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const claimAuctionLotBidderMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      const claimAuctionLotBidderResponse = await claimAuctionLotBidder(
        config,
        auctionInfo
      );
      console.log({ claimAuctionLotBidderResponse });
      logContractToast({
        contractResponse: claimAuctionLotBidderResponse,
        toastSuccessMsg: 'Auction lot claimed successfully.',
        toastErrorMsg: 'Auction lot claim failed:',
      });
      return claimAuctionLotBidderResponse;
    },
    onSuccess: (_, variables) => {
      mixPanel && mixPanel.track('Claimed Auction Lot Bidder');
    },
  });

  return claimAuctionLotBidderMutation;
};

// Winner didn't claim auction lot, so seller claims their lot back
export const useClaimAuctionLotSeller = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const claimAuctionLotSellerMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      return await claimAuctionLotSeller(config, auctionInfo);
    },
    onSuccess: (_, variables) => {
      mixPanel && mixPanel.track('Claimed Auction Lot Seller');
    },
  });

  return claimAuctionLotSellerMutation;
};

// Bidder lost, so they claim deposit back
export const useClaimDepositLoser = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const claimDepositLoserMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      return await claimDepositLoser(config, auctionInfo);
    },
    onSuccess: (_, variables) => {
      mixPanel && mixPanel.track('Claimed Deposit Loser');
    },
  });

  return claimDepositLoserMutation;
};
