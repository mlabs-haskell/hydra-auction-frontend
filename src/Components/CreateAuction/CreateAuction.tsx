import { getUrlParams } from 'src/utils/getUrlParams';
import CreateAuctionTabs from '../CreateAuctionTabs/CreateAuctionTabs';
import { useAssets } from '@meshsdk/react';
import CurrentListing from './CurrentListing';

export default function CreateAuction() {
  // Use url params to get the assetUnit
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');
  const assetName = urlParams.get('assetName');

  //TODO: which details we need to pass to the tabs
  const assets = useAssets();
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);
  return (
    <>
      <h2 className="text-title2 text-center font-bold mb-12">List an NFT</h2>

      <div className="flex flex-col lg:flex-row gap-28 justify-center lg:justify-start items-start">
        <div className="self-center lg:self-start">
          <CurrentListing name={assetName ?? ''} price={100} />
        </div>
        <div className="self-center lg:self-start">
          <CreateAuctionTabs assetToList={assetToList} />
        </div>
      </div>
    </>
  );
}
