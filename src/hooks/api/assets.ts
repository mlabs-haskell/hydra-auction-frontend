import { BrowserWallet } from '@meshsdk/core';
import { useQuery } from '@tanstack/react-query';
import { WalletApp } from 'hydra-auction-offchain';

export const EXTENDED_ASSETS_QUERY_KEY = 'extended-assets';
export const useExtendedAssets = (walletApp: WalletApp) => {
  const assetsQuery = useQuery({
    queryKey: [EXTENDED_ASSETS_QUERY_KEY, walletApp],
    queryFn: async () => {
      const wallet = await BrowserWallet.enable(walletApp);
      const fetchedAssets = await wallet.getAssets();
      return fetchedAssets;
    },
  });

  return assetsQuery;
};
