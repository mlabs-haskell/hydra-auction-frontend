import { useQuery } from '@tanstack/react-query';
import {
  ContractConfig,
  DiscoverSellerSigContractParams,
  discoverSellerSignature,
} from 'hydra-auction-offchain';
import { getValidContractResponse } from 'src/utils/contract';
import { BASE_REFETCH_INTERVAL } from 'src/utils/refetch';

export const DISCOVER_SELLER_SIGNATURE_QUERY_KEY = 'discover-seller-signature';

export const useDiscoverSellerSignature = (
  config: ContractConfig,
  walletAddress: string,
  params: DiscoverSellerSigContractParams,
  enabled: boolean
) => {
  const sellerSigQuery = useQuery({
    queryKey: [
      DISCOVER_SELLER_SIGNATURE_QUERY_KEY,
      config,
      walletAddress,
      params.auctionCs,
    ],
    queryFn: async () => {
      console.log('useDiscoverSellerSignature');
      console.log({ discoverSellerSignatureParams: params });

      console.log({ sellerSigParams: params });
      const sellerSignatureResponse = await discoverSellerSignature(
        config,
        params
      );
      console.log({ sellerSignatureResponse });
      const sellerSignatureValidated = getValidContractResponse(
        sellerSignatureResponse
      );
      return sellerSignatureValidated;
    },
    enabled: !!config && !!walletAddress && !!params.auctionCs && !!enabled,
    refetchInterval: BASE_REFETCH_INTERVAL,
  });
  return sellerSigQuery;
};
