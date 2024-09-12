import { useMutation } from '@tanstack/react-query';
import {
  AuctionInfo,
  ContractConfig,
  claimAuctionLotBidder,
  claimAuctionLotSeller,
  claimDepositLoser,
} from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { trackError } from 'src/utils/errorTracking';

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
      const validatedClaimAuctionLotBidder = getValidContractResponse(
        claimAuctionLotBidderResponse
      );
      return validatedClaimAuctionLotBidder;
    },
    onSuccess: () => {
      toast.success('Auction lot claimed successfully.');
      mixPanel?.track('ClaimLotSucceeded', {
        userType: 'bidder',
      });
    },
    onError: (error, params) => {
      trackError(error, 'claimAuctionLotBidder', mixPanel, params);
      console.error('Error claiming auction lot as winning bidder.', error);
      toast.error(`Auction lot claim failed: ${error.message}`);
    },
  });

  return claimAuctionLotBidderMutation;
};

// Winner didn't claim auction lot, so seller claims their lot back
export const useClaimAuctionLotSeller = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const claimAuctionLotSellerMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      const claimAuctionLotSellerResponse = await claimAuctionLotSeller(
        config,
        auctionInfo
      );
      console.log({ claimAuctionLotSellerResponse });
      const claimAuctionLotSellerValidated = getValidContractResponse(
        claimAuctionLotSellerResponse
      );

      return claimAuctionLotSellerValidated;
    },
    onSuccess: () => {
      toast.success('Auction lot claimed successfully.');
      mixPanel?.track('Reclaimed Auction Lot as Seller');
    },
    onError: (error, params) => {
      trackError(error, 'claimAuctionLotSeller', mixPanel, params);
      console.error('Error claiming auction lot as seller.', error);
      toast.error(`Auction lot claim failed: ${error.message}`);
    },
  });

  return claimAuctionLotSellerMutation;
};

// Bidder lost, so they claim deposit back
export const useClaimDepositLoser = (config: ContractConfig) => {
  const mixPanel = useMixpanel();
  const claimDepositLoserMutation = useMutation({
    mutationFn: async (auctionInfo: AuctionInfo) => {
      const claimDepositLoserResponse = await claimDepositLoser(
        config,
        auctionInfo
      );
      console.log({ claimDepositLoserResponse });
      const claimDepositLoserValidated = getValidContractResponse(
        claimDepositLoserResponse
      );
      return claimDepositLoserValidated;
    },
    onSuccess: () => {
      toast.success('Deposit claimed successfully.');
      mixPanel?.track('Claimed Deposit Loser');
    },
    onError: (error, params) => {
      trackError(error, 'claimDepositLoser', mixPanel, params);
      console.error('Error claiming loser deposit.', error);
      toast.error(`Deposit claim failed: ${error.message}`);
    },
  });

  return claimDepositLoserMutation;
};
