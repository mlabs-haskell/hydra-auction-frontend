import { AssetExtended, BrowserWallet } from '@meshsdk/core';
import { useWallet } from '@meshsdk/react';
import { useEffect, useState } from 'react';

type UseExtendedAssetsResponse = {
  assets: AssetExtended[] | undefined;
  isError: boolean;
  isLoading: boolean;
};

export const useExtendedAssets = (): UseExtendedAssetsResponse => {
  const [isError, setIsError] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<AssetExtended[]>([]);
  const { name: walletName } = useWallet();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const wallet = await BrowserWallet.enable(walletName);
        const fetchedAssets = await wallet.getAssets();
        setIsError(false);
        setIsLoading(false);
        setAssets(fetchedAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setIsError(true);
      }
    };
    walletName && fetchAssets();
  }, [walletName]);

  return {
    isLoading: isLoading,
    isError: isError,
    assets: assets,
  };
};
