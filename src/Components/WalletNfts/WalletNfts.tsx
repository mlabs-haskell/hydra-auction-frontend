import { Asset } from '@meshsdk/core';
import { useAssets } from '@meshsdk/react';
import { MOCK_NFT_IMAGE_URL } from 'src/mocks/images.mock';

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
  return (
    <a href={`/announce-auction?assetUnit=${assetUnit}`}>
      <div className="flex justify-center items-center mb-3">
        <img className="blur-sm" width={342} alt="" src={assetImageSrc} />
      </div>
      <div className="text-center">{assetName}</div>
    </a>
  );
};
// TODO: IPFS to get the asset image, we also need the name which is suppose to come from useAssets
// On website it shows unit, policyId, assetName, fingerprint, quantity as the response from useAssets
// so something is off
export default function WalletNfts() {
  const assets = useAssets();

  return (
    <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
      {assets &&
        assets.slice(0, 10).map((asset: Asset, i) => {
          return (
            <li key={i} className="p-2">
              {/* <div className="overflow-hidden">
                  {asset.unit} (x{asset.quantity})
                </div> */}
              <WalletNftCard assetUnit={asset.unit} assetName={'Name'} />
            </li>
          );
        })}
    </ol>
  );
}
