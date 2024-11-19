import { blockfrostProvider } from 'src/providers/BlockFrostProvider';
import { resolveMedia } from './resolveMedia';

export const getImageUrl = async (assetUnit: string) => {
  const assetMetaData = await blockfrostProvider.fetchAssetMetadata(assetUnit);
  const image = assetMetaData?.image;
  const ipfsHash = resolveMedia(image)?.toString();
  return ipfsHash ? `${ipfsHash}` : '';
};
