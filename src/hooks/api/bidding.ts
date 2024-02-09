import {
  AuctionInfo,
  authorizeBidders,
  AuthorizeBiddersContractParams,
  discoverBidders,
  DiscoverSellerSigContractParams,
  discoverSellerSignature,
  placeBid,
  PlaceBidContractParams,
  queryStandingBidState,
  startBidding,
  StartBiddingContractParams,
  type WalletApp,
} from 'hydra-auction-offchain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_AUCTIONS_QUERY_KEY } from './auctions';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const STANDING_BID_STATE_QUERY_KEY = 'standing-bid-state';
export const DISCOVER_BIDDERS_QUERY_KEY = 'discover-bidders';
export const AUTHORIZE_BIDDERS_QUERY_KEY = 'authorize-bidders';
export const START_BIDDING_QUERY_KEY = 'start-bidding';
const DISCOVER_SELLER_SIGNATURE_QUERY_KEY = 'discover-seller-signature';

// FLOW: bidder enterAuction -> seller discoverBidders -> seller authorizeBidders -> bidder discoverSellerSignature -> seller startBidding -> bidder placeBid
// TODO: flesh out into separate files once we have flow down
export const useStandingBidState = (
  walletApp: WalletApp,
  auctionInfo: AuctionInfo
) => {
  const standingBidStateQuery = useQuery({
    queryKey: [STANDING_BID_STATE_QUERY_KEY, walletApp, auctionInfo.auctionId],
    queryFn: async () => await queryStandingBidState(walletApp, auctionInfo),
  });

  return standingBidStateQuery;
};

export const useDiscoverBidders = (
  walletApp: WalletApp,
  auctionInfo: AuctionInfo
) => {
  const discoverBiddersQuery = useQuery({
    queryKey: [DISCOVER_BIDDERS_QUERY_KEY, walletApp, auctionInfo.auctionId],
    queryFn: async () => {
      console.log({ discoverBiddersParams: auctionInfo });
      const discoverBiddersResponse = await discoverBidders(
        walletApp,
        auctionInfo
      );
      console.log({ discoverBiddersResponse });
      return discoverBiddersResponse;
    },
  });

  return discoverBiddersQuery;
};

export const useAuthorizeBidders = (walletApp: WalletApp) => {
  const authorizeBiddersMutation = useMutation({
    mutationFn: async (
      authorizeBiddersParams: AuthorizeBiddersContractParams
    ) => {
      console.log({ authorizeBiddersParams });
      const authorizeBiddersResponse = await authorizeBidders(
        walletApp,
        authorizeBiddersParams
      );

      console.log({ authorizeBiddersResponse });
      return authorizeBiddersResponse;
    },
    onError: (error) => {
      console.error('Error authorizing bidders', error);
    },
  });
  return authorizeBiddersMutation;
};

export const useStartBidding = (
  walletApp: WalletApp,
  startBiddingParams: StartBiddingContractParams
) => {
  const startBiddingMutation = useMutation({
    mutationFn: async () => {
      console.log({ startBiddingParams });
      const startBiddingResponse = await startBidding(
        walletApp,
        startBiddingParams
      );
      console.log({ startBiddingResponse });
      return startBiddingResponse;
    },
    onError: (error) => {
      console.error('Error starting bidding', error);
    },
  });

  return startBiddingMutation;
};

export const useDiscoverSellerSignature = (
  walletApp: WalletApp,
  params: DiscoverSellerSigContractParams
) => {
  const sellerSigQuery = useQuery({
    queryKey: [DISCOVER_SELLER_SIGNATURE_QUERY_KEY, walletApp, params],
    queryFn: async () => {
      console.log({ discoverSellerSignatureParams: params });
      const sellerSignatureResponse = await discoverSellerSignature(
        walletApp,
        params
      );
      console.log({ sellerSignatureResponse });
      return sellerSignatureResponse;
    },
  });
  return sellerSigQuery;
};

export const usePlaceBid = (
  auctionInfo: AuctionInfo,
  sellerSignature?: string | null,
  walletApp?: WalletApp
) => {
  const queryClient = useQueryClient();

  const placeBidMutation = useMutation({
    mutationFn: async (bidAmount: string) => {
      if (sellerSignature && walletApp) {
        const params: PlaceBidContractParams = {
          auctionInfo,
          sellerSignature: sellerSignature,
          bidAmount,
        };
        console.log({ placeBidParams: params });
        const placeBidResponse = await placeBid(walletApp, params);
        console.log({ placeBidResponse });
        return placeBidResponse;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.log('PLACE BID MUTATION ERROR', error);
    },
  });

  return placeBidMutation;
};
