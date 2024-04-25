import { BrowserWallet } from '@meshsdk/core';
import { useQuery } from '@tanstack/react-query';

const SELLER_ADDRESS_QUERY_KEY = 'seller-address';
export const useWalletAddress = (wallet: BrowserWallet, connected: boolean) => {
  const walletAddressQuery = useQuery({
    queryKey: [SELLER_ADDRESS_QUERY_KEY],
    queryFn: async () => {
      console.log('useWalletAddress');
      const sellerAddresses = await wallet.getUsedAddresses();
      return sellerAddresses[0] ?? '';
    },
    enabled: !!connected && !!wallet,
  });
  return walletAddressQuery;
};
