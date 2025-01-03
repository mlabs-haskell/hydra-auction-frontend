import { AuctionDetailSellerProps } from '../AuctionDetail/AuctionDetailSeller';
import { Button } from '../shadcn/Button';
import { useMoveBidL2 } from 'src/hooks/api/moveBidL2';

type StartBiddingProps = AuctionDetailSellerProps & {
  disabled?: boolean;
};
export default function MoveBidL2({
  config,
  auctionInfo,
  disabled,
}: StartBiddingProps) {
  const { mutate: moveBidL2, isPending } = useMoveBidL2(config);

  const handleMoveBidL2 = () => {
    if (auctionInfo.delegateInfo)
      moveBidL2({
        auctionCs: auctionInfo.auctionId,
        auctionTerms: auctionInfo.auctionTerms,
        delegateInfo: auctionInfo.delegateInfo,
      });
  };
  return (
    <Button
      disabled={isPending || disabled}
      className="w-full"
      onClick={handleMoveBidL2}
    >
      Move Bidding to L2
    </Button>
  );
}
