//import { TimeRemaining } from '../Time/TimeRemaining';
import { getUrlParams } from 'src/utils/getUrlParams';
import AnnounceAuctionTabs from '../AnnounceTabs/AnnounceTabs';
import { useAssets } from '@meshsdk/react';

const CurrentListing = ({
  name,
  price,
  biddingEnd,
}: {
  name: string;
  price: number;
  biddingEnd?: string;
}) => {
  return (
    <div className="w-[342px]">
      <div className="mb-4 text-start text-body font-semibold">
        Current Listing:
      </div>
      <img
        className="blur-sm"
        width={246}
        alt=""
        src="/images/sample_nft.png"
      />
      <div className="font-bold">{name}</div>
      {/* <div className="text-end font-bold">{price} ADA</div>
      <div className="text-end text-dim">${priceUsd}</div>
      <div className="flex justify-center items-center">
        <TimeRemaining endDate={Number(biddingEnd) || 0} />
      </div> */}
    </div>
  );
};

export default function AnnounceAuction() {
  // Use url params to get the assetUnit
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');
  const assetName = urlParams.get('assetName');

  //TODO: which details we need to pass to the tabs
  const assets = useAssets();
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);
  return (
    <div className="flex items-center justify-center">
      <div className="container grid grid-cols-8">
        <div className="col-span-3 mt-12 ">
          <CurrentListing name={assetName ?? ''} price={100} />
        </div>
        <div className="col-span-5">
          <div className="text-title2 font-bold mb-6">List an nft</div>

          <AnnounceAuctionTabs assetToList={assetToList} />
        </div>
      </div>
    </div>
  );
}
