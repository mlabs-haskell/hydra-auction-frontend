type CurrentListingProps = {
  name: string;
  price: number;
  biddingEnd?: string;
};

const IMAGE_WIDTH = 246;
const CURRENCY_SYMBOL = 'ADA';

// TODO: add ipfs image and auction details here
const CurrentListing = ({ name, price, biddingEnd }: CurrentListingProps) => {
  return (
    <div className="w-[342px]">
      <div className="mb-4 text-start text-body font-semibold">
        Current Listing:
      </div>
      <img
        width={IMAGE_WIDTH}
        className="blur-sm w-full"
        alt=""
        src="/images/sample_nft.png"
      />
      <div className="font-bold">{name}</div>
      <div className="text-end font-bold">
        {price} {CURRENCY_SYMBOL}
      </div>
      {/* <div className="text-end text-dim">${priceUsd}</div>
        <div className="flex justify-center items-center">
          <TimeRemaining endDate={Number(biddingEnd) || 0} />
        </div> */}
    </div>
  );
};
export default CurrentListing;
