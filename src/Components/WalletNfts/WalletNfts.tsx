import { useExtendedAssets } from 'src/hooks/assets';
import IpfsImage from '../IpfsImage/IpfsImage';

type WalletNftCardProps = {
  assetImageSrc?: string;
  assetName?: string;
  assetUnit: string;
};

// TODO: combine WalletNftCard and AuctionCard
const WalletNftCard = ({
  assetName = 'Name',
  assetUnit,
}: WalletNftCardProps) => {
  return (
    <a href={`/create-auction?assetUnit=${assetUnit}&assetName=${assetName}`}>
      <div className="flex justify-center items-center mb-3">
        <IpfsImage assetUnit={assetUnit} />
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
        <li
          key={index}
          className=" border p-4 rounded-lg shadow-md hover:bg-slate-200"
        >
          <WalletNftCard assetUnit={asset.unit} assetName={asset.assetName} />
        </li>
      ))}
    </ul>
  );
}
