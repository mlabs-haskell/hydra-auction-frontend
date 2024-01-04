import { useActiveAuctions } from '../../hooks/auctions';
import AuctionCard from './AuctionCard';

export default function AuctionList() {
  const { data: auctions } = useActiveAuctions();
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-title1 text-center mb-3">Query Auctions</h1>
        <hr className="border-b border-gray-400 w-32 mb-4" />
      </div>
      <div>
        <div className="flex gap-2 p-2 font-semibold">
          {auctions?.length || 0} Auctions
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
    </>
  );
}
