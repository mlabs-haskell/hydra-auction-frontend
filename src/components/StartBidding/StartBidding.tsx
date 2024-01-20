import { WalletApp } from 'hydra-auction-offchain';
import { AuctionDetailSellerProps } from '../AuctionDetail/AuctionDetailSeller';
import { useStartBidding } from '../../hooks/api/bidding';
import { Button } from '../shadcn/Button';

export default function StartBidding({
  walletApp,
  auctionInfo,
}: AuctionDetailSellerProps) {
  const startBidding = useStartBidding(walletApp as WalletApp, {
    auctionInfo: auctionInfo,
  });

  const handleStartBidding = () => {
    startBidding.mutate();
  };
  return (
    <div className="w-full">
      <Button className="w-full" onClick={handleStartBidding}>
        Start Bidding
      </Button>
    </div>
  );
}
