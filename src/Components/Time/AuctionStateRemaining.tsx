import { AuctionTerms } from 'hydra-auction-offchain';
import { TimeRemaining } from './TimeRemaining';

export default function AuctionStateRemaining({
  biddingEnd,
  biddingStart,
  purchaseDeadline,
  cleanup,
}: AuctionTerms) {
  const purchaseDeadlineDate = Number(purchaseDeadline);
  const biddingStartDate = Number(biddingStart);
  const biddingEndDate = Number(biddingEnd);
  const cleanupDate = Number(cleanup);
  const now = Date.now();

  if (now > cleanupDate) {
    return (
      <div className="overflow-hidden">
        Auction Expired:{' '}
        <span className="text-dim">
          {new Date(cleanupDate).toLocaleDateString()}
        </span>
      </div>
    );
  } else if (now > purchaseDeadlineDate) {
    return (
      <div className="overflow-hidden">
        Auction Cleanup: <TimeRemaining endDate={cleanupDate} />
      </div>
    );
  } else if (now > biddingEndDate) {
    return (
      <div className="overflow-hidden">
        Auction Purchase Deadline:{' '}
        <TimeRemaining endDate={purchaseDeadlineDate} />
      </div>
    );
  } else if (now > biddingStartDate) {
    return (
      <div className="overflow-hidden">
        Auction End: <TimeRemaining endDate={biddingEndDate} />
      </div>
    );
  } else {
    return (
      <div className="overflow-hidden">
        Auction Start: <TimeRemaining endDate={biddingStartDate} />
      </div>
    );
  }
}
