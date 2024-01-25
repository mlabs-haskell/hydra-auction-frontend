import IpfsImage from '../IpfsImage/IpfsImage';

type CurrentListingProps = {
  name: string;
  assetUnit: string;
};

const CurrentListing = ({ name, assetUnit }: CurrentListingProps) => {
  return (
    <div className="w-[342px]">
      <div className="mb-4 text-start text-body font-semibold">
        Current Listing:
      </div>
      <IpfsImage assetUnit={assetUnit} />
      <div className="font-bold">{name}</div>
    </div>
  );
};
export default CurrentListing;
