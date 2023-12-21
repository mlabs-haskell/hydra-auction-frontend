type CurrentListingProps = {
  name: string;
  price: number;
  biddingEnd?: string;
};

const CurrentListing = ({ name, price, biddingEnd }: CurrentListingProps) => {
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
      <div className="text-end font-bold">{price} ADA</div>
      {/* <div className="text-end text-dim">${priceUsd}</div>
        <div className="flex justify-center items-center">
          <TimeRemaining endDate={Number(biddingEnd) || 0} />
        </div> */}
    </div>
  );
};
export default CurrentListing;
