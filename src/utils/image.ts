import { resolveMedia } from '@meshsdk/react';
import { blockfrostProvider } from 'src/providers/BlockFrostProvider';

export const getImageUrl = async (assetUnit: string) => {
  const assetMetaData = await blockfrostProvider.fetchAssetMetadata(assetUnit);
  const image = assetMetaData?.image;
  const ipfsHash = resolveMedia(image)?.toString();
  return ipfsHash ? `${ipfsHash}` : '';
};
