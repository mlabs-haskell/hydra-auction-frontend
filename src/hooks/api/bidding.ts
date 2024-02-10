import {
  AuctionInfo,
  authorizeBidders,
  AuthorizeBiddersContractParams,
  awaitTxConfirmed,
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
import { toast } from 'react-toastify';
import { logContractToast } from 'src/utils/contract';
import { ADA_CURRENCY_SYMBOL } from 'src/utils/currency';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const STANDING_BID_STATE_QUERY_KEY = 'standing-bid-state';
export const DISCOVER_BIDDERS_QUERY_KEY = 'discover-bidders';
export const AUTHORIZE_BIDDERS_QUERY_KEY = 'authorize-bidders';
export const START_BIDDING_QUERY_KEY = 'start-bidding';
export const DISCOVER_SELLER_SIGNATURE_QUERY_KEY = 'discover-seller-signature';

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
      toast.info('Authorizing bidders (this may take a few minutes)...');
      if (!authorizeBiddersParams.biddersToAuthorize.length) {
        toast.error('No bidders to authorize');
        return null;
      }
      const authorizeBiddersResponse = await authorizeBidders(
        walletApp,
        authorizeBiddersParams
      );
      logContractToast({
        contractResponse: authorizeBiddersResponse,
        toastSuccessMsg: `Successfully authorized ${authorizeBiddersParams.biddersToAuthorize.length}  bidders`,
        toastErrorMsg: 'Authorizing bidders failed',
      });
      console.log({ authorizeBiddersResponse });
      const validatedAuthorizeBiddersResponse =
        contractOutputResultSchema.safeParse(authorizeBiddersResponse);
      if (validatedAuthorizeBiddersResponse.success) {
        toast.info('Confirming authorized bidders contract...');
        await awaitTxConfirmed(
          walletApp,
          validatedAuthorizeBiddersResponse.data.value
        );

        return authorizeBiddersResponse;
      }
      return null;
    },
    onError: (error) => {
      console.error('Error authorizing bidders', error);
      toast.error(`Authorizing bidders failed: ${error}`);
    },
    onSuccess: () => {
      toast.success('Confirmed authorized bidders contract');
    },
  });
  return authorizeBiddersMutation;
};

export const useStartBidding = (walletApp: WalletApp) => {
  const startBiddingMutation = useMutation({
    mutationFn: async (startBiddingParams: StartBiddingContractParams) => {
      toast.info(`Starting bidding for your auction...`);
      console.log({ startBiddingParams });

      const startBiddingResponse = await startBidding(
        walletApp,
        startBiddingParams
      );
      console.log({ startBiddingResponse });
      logContractToast({
        contractResponse: startBiddingResponse,
        toastSuccessMsg: 'Bidding for your auction started succesfully.',
        toastErrorMsg: 'Start bidding failed',
      });
    },
    onError: (error) => {
      console.log({ l: 'startBidding error', error });
      toast.error(`Start bidding failed: ${error}`);
    },
  });

  return startBiddingMutation;
};

export const useDiscoverSellerSignature = (
  walletApp: WalletApp,
  walletAddress: string,
  params: DiscoverSellerSigContractParams
) => {
  const sellerSigQuery = useQuery({
    queryKey: [
      DISCOVER_SELLER_SIGNATURE_QUERY_KEY,
      walletApp,
      walletAddress,
      params.auctionCs,
    ],
    queryFn: async () => {
      console.log({ discoverSellerSignatureParams: params });
      const sellerSignatureResponse = await discoverSellerSignature(
        walletApp,
        params
      );
      console.log({ sellerSignatureResponse });
      return sellerSignatureResponse;
    },
    enabled: !!walletApp && !!walletAddress && !!params.auctionCs,
  });
  return sellerSigQuery;
};

export const usePlaceBid = (
  auctionInfo: AuctionInfo,
  sellerSignature: string,
  walletApp: WalletApp
) => {
  const queryClient = useQueryClient();

  const placeBidMutation = useMutation({
    mutationFn: async (bidAmount: string) => {
      toast.info(`Placing bid for ${ADA_CURRENCY_SYMBOL}${bidAmount}...`);

      const params: PlaceBidContractParams = {
        auctionInfo,
        sellerSignature: sellerSignature,
        bidAmount,
      };
      console.log({ placeBidParams: params });
      const placeBidResponse = await placeBid(walletApp, params);
      console.log({ placeBidResponse });
      logContractToast({
        contractResponse: placeBidResponse,
        toastSuccessMsg: `You succesfully placed a bid for ${ADA_CURRENCY_SYMBOL}${bidAmount}.`,
        toastErrorMsg: `Placing bid failed`,
      });

      return placeBidResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_AUCTIONS_QUERY_KEY] });
    },
    onError: (error) => {
      console.log('PLACE BID MUTATION ERROR', error);
      toast.error(`Placing bid failed: ${error}`);
    },
  });

  return placeBidMutation;
};
