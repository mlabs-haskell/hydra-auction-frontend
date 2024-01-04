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
  const { name } = useWallet();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        if (name) {
          const wallet = await BrowserWallet.enable(name);
          const fetchedAssets = await wallet.getAssets();
          setIsError(false);
          setIsLoading(false);
          setAssets(fetchedAssets);
        }
      } catch (error) {
        console.error('Error fetching assets:', error);
        setIsError(true);
      }
    };
    fetchAssets();
  }, [name]);

  return {
    isLoading: isLoading,
    isError: isError,
    assets: assets,
  };
};
