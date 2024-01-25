import { useWallet } from '@meshsdk/react';
import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  WalletApp,
  claimAuctionLotBidder,
  claimAuctionLotSeller,
  claimDepositLoser,
} from 'hydra-auction-offchain';

// Bidder wins auction
export const useClaimAuctionLotBidder = (walletApp: WalletApp) => {
  const claimAuctionLotBidderMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimAuctionLotBidder(walletApp, auctionInfo),
  });

  return claimAuctionLotBidderMutation;
};

// Winner didn't claim auction lot, so seller claims their lot back
export const useClaimAuctionLotSeller = (walletApp: WalletApp) => {
  const claimAuctionLotSellerMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimAuctionLotSeller(walletApp, auctionInfo),
  });

  return claimAuctionLotSellerMutation;
};

// Bidder lost, so they claim deposit back
export const useClaimDepositLoser = (walletApp: WalletApp) => {
  const claimDepositLoserMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimDepositLoser(walletApp, auctionInfo),
  });

  return claimDepositLoserMutation;
};
