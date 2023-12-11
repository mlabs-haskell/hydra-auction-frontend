import { useQueryAuctions } from '../../hooks/auctions';
import AuctionCard from './AuctionCard';

export default function AuctionList() {
  const { data: auctions } = useQueryAuctions();

  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <h1 className="header text-center mb-3">Query Auctions</h1>
        <div className="flex items-center justify-center mb-4">
          <div className="border-b border-gray-400 w-32"></div>
        </div>
        <div className="flex justify-between ">
          <div className="flex gap-2 p-2 rounded  font-semibold">
            <div>{auctions?.length || 0}</div>
            <div>Auctions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {auctions?.map((auctionInfo, index) => (
            <AuctionCard
              key={`${auctionInfo.auctionId}_${index}`}
              {...auctionInfo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
