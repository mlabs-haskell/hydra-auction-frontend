import { useExtendedAssets } from 'src/hooks/api/assets';
import IpfsImage from '../IpfsImage/IpfsImage';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';
import { removeSpecialCharsAssetName } from 'src/utils/formatting';
import { Link } from 'react-router-dom';

type WalletNftCardProps = {
  assetImageSrc?: string;
  assetName: string;
  assetUnit: string;
};

// TODO: combine WalletNftCard and AuctionCard
const WalletNftCard = ({ assetName, assetUnit }: WalletNftCardProps) => {
  return (
    <Link to={`/create-auction?assetUnit=${assetUnit}&assetName=${assetName}`}>
      <div className="aspect-w-1 aspect-h-1 w-full h-full max-h-64 overflow-hidden justify-center items-center mb-2">
        <IpfsImage
          className="w-full h-64 object-cover object-center transition-transform duration-500 hover:scale-110 hover:transform"
          assetUnit={assetUnit}
        />
      </div>
      <div className="text-center">{assetName}</div>
    </Link>
  );
};

export default function WalletNfts() {
  const { name: walletApp } = useWallet();

  const { data: assets, isError } = useExtendedAssets(walletApp as WalletApp);

  if (isError) return <div>Error getting assets...</div>;
  return assets && assets?.length > 0 ? (
    <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
      {assets?.map((asset, index) => (
        <li
          key={index}
          className=" border p-4 rounded-lg shadow-md hover:bg-slate-200"
        >
          <WalletNftCard
            assetUnit={asset.unit}
            assetName={removeSpecialCharsAssetName(asset.assetName)}
          />
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-title3 text-center">
      No NFTs - try minting one to list an auction
    </div>
  );
}
