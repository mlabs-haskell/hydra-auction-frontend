import { useQuery } from '@tanstack/react-query';
import {
  ContractConfig,
  DiscoverSellerSigContractParams,
  discoverSellerSignature,
} from 'hydra-auction-offchain';

export const DISCOVER_SELLER_SIGNATURE_QUERY_KEY = 'discover-seller-signature';

export const useDiscoverSellerSignature = (
  config: ContractConfig,
  walletAddress: string,
  params: DiscoverSellerSigContractParams
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

      const sellerSignatureResponse = await discoverSellerSignature(
        config,
        params
      );
      console.log({ sellerSignatureResponse });
      return sellerSignatureResponse;
    },
    enabled: !!config && !!walletAddress && !!params.auctionCs,
  });
  return sellerSigQuery;
};
