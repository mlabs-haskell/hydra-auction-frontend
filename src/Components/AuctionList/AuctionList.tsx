import { MOCK_QUERY_AUCTIONS_RESPONSE } from 'src/mocks/queryAuctions.mock';
import { useQueryAuctions } from '../../hooks/auctions';
import AuctionCard from './AuctionCard';

export default function AuctionList() {
  // const { data: auctions } = useQueryAuctions();
  const auctions = MOCK_QUERY_AUCTIONS_RESPONSE;

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
