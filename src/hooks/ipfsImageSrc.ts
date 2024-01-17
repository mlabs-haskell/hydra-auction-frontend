import { resolveMedia } from '@meshsdk/react';
import { useQuery } from '@tanstack/react-query';
import { blockfrostProvider } from 'src/providers/BlockFrostProvider';

// The blockfrostProvider.fetchAssetMetadata function takes assetUnit as an argument - which comes from the mesh api.
// The assetUnit is built from ${policyId}${assetName} which is ${cs}${tn} from the auctionLot from the hydra-auction-offchain api.

// TODO: We need to be able to pass an array of assetUnits to this hook for auctionLots that have multiple assets.

const IPFS_IMAGE_QUERY_KEY = 'ipfs-image';

export const useIpfsImageSrc = (assetUnit: string) => {
  const ipfsQuery = useQuery({
    queryKey: [IPFS_IMAGE_QUERY_KEY, assetUnit],
    queryFn: async () => {
      const assetMetaData = await blockfrostProvider.fetchAssetMetadata(
        assetUnit
      );
      const image = assetMetaData?.image;
      const ipfsHash = resolveMedia(image)?.toString();
      return ipfsHash;
    },
  });

  return ipfsQuery;
};
