import {
  AuctionInfo,
  authorizeBidders,
  AuthorizeBiddersContractParams,
  discoverBidders,
  DiscoverSellerSigContractParams,
  discoverSellerSignature,
  placeBid,
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
    queryKey: [STANDING_BID_STATE_QUERY_KEY, walletApp, auctionInfo],
    queryFn: async () => await queryStandingBidState(walletApp, auctionInfo),
  });

  return standingBidStateQuery;
};

export const useDiscoverBidders = (
  walletApp: WalletApp,
  auctionInfo: AuctionInfo
) => {
  const discoverBiddersQuery = useQuery({
    queryKey: [DISCOVER_BIDDERS_QUERY_KEY, walletApp, auctionInfo],
    queryFn: async () => await discoverBidders(walletApp, auctionInfo),
  });

  return discoverBiddersQuery;
};

export const useAuthorizeBidders = (walletApp: WalletApp) => {
  const authorizeBiddersMutation = useMutation({
    mutationFn: async (
      authorizeBiddersParams: AuthorizeBiddersContractParams
    ) => await authorizeBidders(walletApp, authorizeBiddersParams),
  });
  return authorizeBiddersMutation;
};

export const useStartBidding = (
  walletApp: WalletApp,
  startBiddingParams: StartBiddingContractParams
) => {
  const startBiddingMutation = useMutation({
    mutationFn: async () => await startBidding(walletApp, startBiddingParams),
  });

  return startBiddingMutation;
};

export const useDiscoverSellerSignature = (
  walletApp: WalletApp,
  params: DiscoverSellerSigContractParams
) => {
  const sellerSigQuery = useQuery({
    queryKey: [DISCOVER_SELLER_SIGNATURE_QUERY_KEY, walletApp, params],
    queryFn: async () => await discoverSellerSignature(walletApp, params),
  });
  return sellerSigQuery;
};

export const usePlaceBid = (
  auctionCs: string,
  sellerSignature?: string | null
) => {
  const queryClient = useQueryClient();

  const placeBidMutation = useMutation({
    mutationFn: async (bidAmount: string) =>
      sellerSignature &&
      (await placeBid(auctionCs, bidAmount, sellerSignature)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
  });

  return placeBidMutation;
};
