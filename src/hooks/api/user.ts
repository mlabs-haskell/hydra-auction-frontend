import { BrowserWallet } from '@meshsdk/core';
import { useQuery } from '@tanstack/react-query';

const SELLER_ADDRESS_QUERY_KEY = 'seller-address';
export const useWalletAddress = (wallet: BrowserWallet, connected: boolean) => {
  const walletAddressQuery = useQuery({
    queryKey: [SELLER_ADDRESS_QUERY_KEY, wallet, connected],
    queryFn: async () => {
      const sellerAddresses = await wallet.getUsedAddresses();
      return sellerAddresses[0] ?? '';
    },
    enabled: !!connected && !!wallet,
  });
  return walletAddressQuery;
};

export const useWalletAddresses = (wallet: BrowserWallet, connected: boolean) => {
  const walletAddressesQuery = useQuery({
    queryKey: [SELLER_ADDRESS_QUERY_KEY, wallet, connected],
    queryFn: async () => {
      const sellerAddresses = await wallet.getUsedAddresses();
      return sellerAddresses ?? [];
    },
    enabled: !!connected && !!wallet,
  });
  return walletAddressesQuery;
}