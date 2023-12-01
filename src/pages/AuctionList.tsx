import { useQueryAuctions } from '../hooks/auctions';
import AuctionCard from '../Components/AuctionCard';

export default function AuctionList() {
  const { data: auctions } = useQueryAuctions();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {auctions?.map((auctionInfo, index) => (
          <AuctionCard
            key={`${auctionInfo.auctionId}_${index}`}
            {...auctionInfo}
          />
        ))}
      </div>
    </div>
  );
}
