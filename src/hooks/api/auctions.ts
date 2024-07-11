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
import { BASE_REFETCH_INTERVAL } from 'src/utils/refetch';
import { getValidContractResponse } from 'src/utils/contract';

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
  const activeAuctions = useQuery({
    queryKey: [QUERY_AUCTIONS_QUERY_KEY, config],
    queryFn: async () => {
      const auctions = await queryAuctions(config, auctionFilters);
      return auctions;
    },
    refetchInterval: refetch ? BASE_REFETCH_INTERVAL : Infinity,
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
  // To get all auctions we are authorized to bid on
  config: ContractConfig,
  walletAddress?: string,
  auctions?: AuctionInfo[],
  walletVk?: string
) => {
  return useQuery({
    queryKey: [AUCTIONS_AUTHORIZED_QUERY_KEY, config, walletAddress, walletVk],
    queryFn: async () => {
      if (auctions && walletAddress && config) {
        const authorizedAuctions = await Promise.all(
          auctions.map(async (auction) => {
            const sellerSigParams: DiscoverSellerSigContractParams = {
              auctionCs: auction.auctionId,
              sellerAddress: walletAddress,
              bidderVk: walletVk ?? '',
            };

            const sellerSignatureResponse = await discoverSellerSignature(
              config,
              sellerSigParams
            );
            const sellerSignatureValidated = getValidContractResponse(
              sellerSignatureResponse
            );
            if (sellerSignatureValidated) {
              return auction.auctionId;
            }
          })
        );
        return authorizedAuctions;
      }
      return [];
    },
    enabled: !!walletAddress && !!auctions && !!walletVk,
  });
};
