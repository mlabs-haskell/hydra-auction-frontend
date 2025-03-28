import { useUrlParams } from 'src/hooks/urlParams';
import CreateAuctionTabs from '../CreateAuctionTabs/CreateAuctionTabs';
import { useAssets } from '@meshsdk/react';
import CurrentListing from './CurrentListing';

export default function CreateAuction() {
  // Use url params to get the assetUnit
  const urlParams = useUrlParams();
  const assetUnit = urlParams.get('assetUnit');
  const assetName = urlParams.get('assetName');

  // For now we are going to use the assetUnit to get the asset from the queryAssets cache inside the form.
  // This way we dont need to prop drill the asset across the tabs
  const assets = useAssets();
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);

  if (!assetUnit || !assetName || !assetToList)
    return <div>Error finding asset...</div>;
  return (
    <>
      <h2 className="text-title2 text-center font-bold mb-12">List an NFT</h2>

      <div className="flex flex-col lg:flex-row gap-28 justify-center lg:justify-start items-start">
        <div className="self-center lg:self-start">
          <CurrentListing name={assetName} assetUnit={assetUnit} />
        </div>
        <div className="self-center lg:self-start">
          <CreateAuctionTabs assetToList={assetToList} />
        </div>
      </div>
    </>
  );
}
