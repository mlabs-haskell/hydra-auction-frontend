import { AssetExtended, BrowserWallet } from '@meshsdk/core';
import { useEffect, useState } from 'react';
import { set } from 'zod';

type UseExtendedAssetsResponse = {
  assets: AssetExtended[] | undefined;
  isError: boolean;
};
// TODO: Get the current active wallet, to pass to browserwallet.enable
export const useExtendedAssets = (): UseExtendedAssetsResponse => {
  const [isError, setIsError] = useState(true);
  const [assets, setAssets] = useState<AssetExtended[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const wallet = await BrowserWallet.enable('nami');
        const fetchedAssets = await wallet.getAssets();
        setIsError(false);
        setAssets(fetchedAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setIsError(true);
      }
    };

    fetchAssets();
  }, []);

  return {
    isError: isError,
    assets: assets,
  };
};
