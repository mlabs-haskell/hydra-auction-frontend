import {
  AuctionFilters,
  AuctionInfo,
  ContractConfig,
  DiscoverSellerSigContractParams,
  discoverSellerSignature,
  queryAuctions,
} from 'hydra-auction-offchain';
import { useQuery } from '@tanstack/react-query';
import { getLocalStorageItem } from 'src/utils/localStorage';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { useMixpanel } from 'react-mixpanel-browser';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const QUERY_AUCTIONS_QUERY_KEY = 'query-auctions';
export const AUCTIONS_ENTERED_QUERY_KEY = 'auctions-entered';
export const AUCTIONS_AUTHORIZED_QUERY_KEY = 'auctions-authorized';

export const useActiveAuctions = (
  config: ContractConfig,
  auctionFilters?: AuctionFilters,
  refetch?: boolean
) => {
  const mixPanel = useMixpanel();
  const activeAuctions = useQuery({
    queryKey: [QUERY_AUCTIONS_QUERY_KEY, config],
    queryFn: async () => {
      console.log('useActiveAuctions');
      console.log({ mixPanel });
      // mixPanel && mixPanel.track('Querying Auctions');
      return await queryAuctions(config, auctionFilters);
    },
    refetchInterval: refetch ? 10000 : Infinity,
    enabled: !!config,
  });

  return activeAuctions;
};

// TODO: Add logic on auction-list page to sweep all auctions and check if we are seller / bidder
// Also add logic to remove auction from local storage if it is no longer active
export const useAuctionsEntered = (
  // return auctionId not full auction
  walletAddress?: string
) => {
  return useQuery({
    queryKey: [AUCTIONS_ENTERED_QUERY_KEY, walletAddress],
    queryFn: async () => {
      if (walletAddress) {
        const walletData = getLocalStorageItem(walletAddress) || {};
        if (walletData) {
          return (
            walletData.bidding?.map((auction: any) => auction.auctionId) || []
          );
        }
        return [];
      }
    },
    enabled: !!walletAddress,
  });
};

export const useAuctionsAuthorized = (
  // Not ideal we should have a way to do this without signing for each
  config: ContractConfig,
  walletAddress?: string,
  auctions?: AuctionInfo[]
) => {
  return useQuery({
    queryKey: [AUCTIONS_AUTHORIZED_QUERY_KEY, config, walletAddress],
    queryFn: async () => {
      if (auctions && walletAddress && config) {
        const authorizedAuctions = await Promise.all(
          auctions.map(async (auction) => {
            const sellerSigParams: DiscoverSellerSigContractParams = {
              auctionCs: auction.auctionId,
              sellerAddress: walletAddress,
            };

            const sellerSignatureResponse = await discoverSellerSignature(
              config,
              sellerSigParams
            );
            const validatedSellerSignature =
              contractOutputResultSchema.safeParse(sellerSignatureResponse);
            if (
              validatedSellerSignature.success &&
              validatedSellerSignature.data
            ) {
              return auction.auctionId;
            }
          })
        );
        return authorizedAuctions;
      }
      return [];
    },
    enabled: !!walletAddress && !!auctions,
  });
};
