import { WalletApp } from 'hydra-auction-offchain';
import { AuctionDetailSellerProps } from '../AuctionDetail/AuctionDetailSeller';
import { useStartBidding } from '../../hooks/api/bidding';
import { Button } from '../shadcn/Button';

type StartBiddingProps = AuctionDetailSellerProps & {
  disabled?: boolean;
};
export default function StartBidding({
  walletApp,
  auctionInfo,
  disabled,
}: StartBiddingProps) {
  const { mutate: startBidding, isPending: isStartBiddingPending } =
    useStartBidding(walletApp as WalletApp);

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
