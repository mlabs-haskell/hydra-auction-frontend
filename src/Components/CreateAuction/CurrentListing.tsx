import { ADA_CURRENCY_SYMBOL } from 'src/utils/currency';
import IpfsImage from '../IpfsImage/IpfsImage';

type CurrentListingProps = {
  name: string;
  price: number;
  assetUnit: string;
  biddingEnd?: string;
};

const CurrentListing = ({
  name,
  price,
  biddingEnd,
  assetUnit,
}: CurrentListingProps) => {
  return (
    <div className="w-[342px]">
      <div className="mb-4 text-start text-body font-semibold">
        Current Listing:
      </div>
      <IpfsImage assetUnit={assetUnit} />
      <div className="font-bold">{name}</div>
      <div className="text-end font-bold">0 {ADA_CURRENCY_SYMBOL}</div>
      {/* <div className="text-end text-dim">${priceUsd}</div>
        <div className="flex justify-center items-center">
          <TimeRemaining endDate={Number(biddingEnd) || 0} />
        </div> */}
    </div>
  );
};
export default CurrentListing;
