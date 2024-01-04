import { resolveMedia } from '@meshsdk/react';
import { useEffect, useState } from 'react';
import { blockfrostProvider } from 'src/providers/BlockFrostProvider';

// The blockfrostProvider.fetchAssetMetadata function takes assetUnit as an argument - which comes from the mesh api.
// The assetUnit is built from ${policyId}${assetName} which is ${cs}${tn} from the auctionLot from the hydra-auction-offchain api.

// TODO: We need to be able to pass an array of assetUnits to this hook for auctionLots that have multiple assets.
export const useIpfsImageSrc = (assetUnit: string) => {
  const [ipfsImageSrc, setIpfsImageSrc] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIpfsImageSrc = async () => {
      setLoading(true);

      try {
        const assetMetaData = await blockfrostProvider.fetchAssetMetadata(
          assetUnit
        );
        const image = assetMetaData?.image;
        const ipfsHash = resolveMedia(image)?.toString();
        setIpfsImageSrc(ipfsHash ? `${ipfsHash}` : '');
      } catch (err) {
        setError('Error fetching image');
      } finally {
        setLoading(false);
      }
    };
    if (assetUnit) fetchIpfsImageSrc();
  }, [assetUnit]);

  return { ipfsImageSrc, isError: error, isLoading: loading };
};
