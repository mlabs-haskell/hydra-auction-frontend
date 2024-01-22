import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  claimAuctionLotBidder,
  claimAuctionLotSeller,
  claimDepositLoser,
} from 'hydra-auction-offchain';

// Bidder wins auction
export const useClaimAuctionLotBidder = () => {
  const claimAuctionLotBidderMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimAuctionLotBidder(auctionInfo),
  });

  return claimAuctionLotBidderMutation;
};

// Winner didn't claim auction lot, so seller claims their lot back
export const useClaimAuctionLotSeller = () => {
  const claimAuctionLotSellerMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimAuctionLotSeller(auctionInfo),
  });

  return claimAuctionLotSellerMutation;
};

// Bidder lost, so they claim deposit back
export const useClaimDepositLoser = () => {
  const claimDepositLoserMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) =>
      await claimDepositLoser(auctionInfo),
  });

  return claimDepositLoserMutation;
};
