import { AuctionTerms } from 'hydra-auction-offchain';
import { TimeRemaining } from './TimeRemaining';
import { useEffect, useState } from 'react';

type AuctionStateRemainingProps = {
  biddingEnd: string;
  biddingStart: string;
  purchaseDeadline: string;
  cleanup: string;
  size?: string;
};

const TimeRemainingCard = ({
  endDate,
  label,
  size = 'small',
}: {
  endDate: number;
  label: string;
  size?: string;
}) => {
  return size === 'small' ? (
    <div className="overflow-hidden">
      <div>{label}</div>
      <TimeRemaining endDate={endDate} />
    </div>
  ) : (
    <div>
      <div className="text-dim mb-5">{label}</div>
      <TimeRemaining size="large" endDate={endDate} />
    </div>
  );
};

export default function AuctionStateRemaining({
  biddingEnd,
  biddingStart,
  purchaseDeadline,
  cleanup,
  size = 'small',
}: AuctionStateRemainingProps) {
  const purchaseDeadlineDate = Number(purchaseDeadline);
  const biddingStartDate = Number(biddingStart);
  const biddingEndDate = Number(biddingEnd);
  const cleanupDate = Number(cleanup);
  const [now, setNowTime] = useState(Date.now());

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setNowTime(Date.now());
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (now > cleanupDate) {
    return (
      <div
        className={`font-semibold ${
          size === 'large' ? 'text-title1 font-bold' : ''
        }`}
      >
        Expired
      </div>
    );
  } else if (now > purchaseDeadlineDate) {
    return (
      <TimeRemainingCard
        size={size}
        label="Auction Cleanup"
        endDate={cleanupDate}
      />
    );
  } else if (now > biddingEndDate) {
    return (
      <TimeRemainingCard
        size={size}
        label="Auction Purchase Deadline"
        endDate={purchaseDeadlineDate}
      />
    );
  } else if (now > biddingStartDate) {
    return (
      <TimeRemainingCard
        size={size}
        label="Bidding Ends"
        endDate={biddingEndDate}
      />
    );
  } else {
    return (
      <TimeRemainingCard
        size={size}
        label="Bidding Starts"
        endDate={biddingStartDate}
      />
    );
  }
}
