import { useExtendedAssets } from 'src/hooks/api/assets';
import IpfsImage from '../IpfsImage/IpfsImage';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';

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
  const { name: walletApp } = useWallet();

  const { data: assets, isError } = useExtendedAssets(walletApp as WalletApp);

  if (isError) return <div>Error getting assets...</div>;
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
