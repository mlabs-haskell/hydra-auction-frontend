import { AuctionDetailSellerProps } from '../AuctionDetail/AuctionDetailSeller';
import { Button } from '../shadcn/Button';
import { useStartBidding } from 'src/hooks/api/startBidding';

type StartBiddingProps = AuctionDetailSellerProps & {
  disabled?: boolean;
};
export default function StartBidding({
  config,
  auctionInfo,
  disabled,
}: StartBiddingProps) {
  const { mutate: startBidding, isPending: isStartBiddingPending } =
    useStartBidding(config);

  const handleStartBidding = () => {
    startBidding({
      auctionInfo: auctionInfo,
    });
  };
  return (
    <Button
      disabled={isStartBiddingPending || disabled}
      className="w-full"
      onClick={handleStartBidding}
    >
      Start Bidding
    </Button>
  );
}
