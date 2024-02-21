import { useQuery } from '@tanstack/react-query';
import {
  DiscoverSellerSigContractParams,
  WalletApp,
  discoverSellerSignature,
} from 'hydra-auction-offchain';

export const DISCOVER_SELLER_SIGNATURE_QUERY_KEY = 'discover-seller-signature';

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
