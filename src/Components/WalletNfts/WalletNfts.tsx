import { resolveMedia } from '@meshsdk/react';
import { useExtendedAssets } from 'src/hooks/assets';
import { MOCK_NFT_IMAGE_URL } from 'src/mocks/images.mock';

const IPFS_BASE_URL = 'https://ipfs.grabbit.market/ipfs/'; //'https://ipfs.io/ipfs/';

type WalletNftsProps = {
  setSelectedNft: (unit: string) => void;
};

type WalletNftCardProps = {
  assetImageSrc?: string;
  assetName?: string;
  assetUnit: string;
};

const WalletNftCard = ({
  assetImageSrc = MOCK_NFT_IMAGE_URL,
  assetName = 'Name',
  assetUnit,
}: WalletNftCardProps) => {
  // Resolve IPFS image URL using resolveMedia
  const ipfsHash = resolveMedia(assetUnit);
  const imageSrc = ipfsHash ? `${IPFS_BASE_URL}${ipfsHash}` : assetImageSrc;

  return (
    <a href={`/announce-auction?assetUnit=${assetUnit}&assetName=${assetName}`}>
      <div className="flex justify-center items-center mb-3">
        {imageSrc && (
          <img className="" width={342} alt={assetName} src={imageSrc} />
        )}
      </div>
      <div className="text-center">{assetName}</div>
    </a>
  );
};
// TODO: IPFS to get the asset image
export default function WalletNfts() {
  const { assets, isError } = useExtendedAssets();

  if (isError) return null;
  return (
    <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
      {assets?.slice(0, 10).map((asset, i) => (
        <li key={i} className="p-2">
          <WalletNftCard assetUnit={asset.unit} assetName={asset.assetName} />
        </li>
      ))}
    </ol>
  );
}
