import { useExtendedAssets } from 'src/hooks/assets';
import { MOCK_NFT_IMAGE_URL } from 'src/mocks/images.mock';
import { getImageUrl } from 'src/utils/image';

type WalletNftCardProps = {
  assetImageSrc?: string;
  assetName?: string;
  assetUnit: string;
};

const IMAGE_WIDTH = 342;

// TODO: combine WalletNftCard and AuctionCard
const WalletNftCard = ({
  assetImageSrc = MOCK_NFT_IMAGE_URL,
  assetName = 'Name',
  assetUnit,
}: WalletNftCardProps) => {
  // TODO: Fix IPFS to get the asset image
  const imageSrc = getImageUrl(assetUnit) ?? assetImageSrc;

  return (
    <a href={`/announce-auction?assetUnit=${assetUnit}&assetName=${assetName}`}>
      <div className="flex justify-center items-center mb-3">
        {imageSrc && (
          <img
            className=""
            width={IMAGE_WIDTH}
            alt={assetName}
            src={imageSrc}
          />
        )}
      </div>
      <div className="text-center">{assetName}</div>
    </a>
  );
};

export default function WalletNfts() {
  const { assets, isError } = useExtendedAssets();

  if (isError) return null;

  return (
    <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
      {assets?.map((asset, index) => (
        <li key={index} className="p-2">
          <WalletNftCard assetUnit={asset.unit} assetName={asset.assetName} />
        </li>
      ))}
    </ul>
  );
}
