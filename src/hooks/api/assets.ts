import { BrowserWallet } from '@meshsdk/core';
import { resolveMedia } from '@meshsdk/react';
import { useQuery } from '@tanstack/react-query';
import { WalletApp } from 'hydra-auction-offchain';
import { blockfrostProvider } from 'src/providers/BlockFrostProvider';
import { ONE_DAY_MS } from 'src/utils/date';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from 'src/utils/localStorage';

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

export const METADATA_QUERY_KEY = 'asset-metadata';

export const getAndStoreAssetMetadata = async (assetUnit: string) => {
  const localMetadata = getLocalStorageItem('metadata') || [];
  const assetMetadataIndex = localMetadata?.findIndex(
    (metadata: any) => metadata.unit === assetUnit
  );

  if (assetMetadataIndex !== -1) {
    return localMetadata[assetMetadataIndex];
  }

  try {
    const assetMetaData = await blockfrostProvider.fetchAssetMetadata(
      assetUnit
    );
    if (Object.keys(assetMetaData).length > 0) {
      const extendedAssetMetadata = {
        ...assetMetaData,
        image: assetMetaData?.image
          ? resolveMedia(assetMetaData?.image)?.toString()
          : undefined,
        unit: assetUnit,
      };
      setLocalStorageItem('metadata', [
        ...localMetadata,
        extendedAssetMetadata,
      ]);
      return extendedAssetMetadata;
    }

    return null;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const useAssetMetadata = (assetUnit: string) => {
  const metadataQuery = useQuery({
    queryKey: [METADATA_QUERY_KEY, assetUnit],
    queryFn: async () => await getAndStoreAssetMetadata(assetUnit),
    staleTime: ONE_DAY_MS * 7,
    enabled: !!assetUnit,
  });

  return metadataQuery;
};
