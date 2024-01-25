import { AuctionInfo } from 'hydra-auction-offchain';
import { Button } from '../shadcn/Button';
import {
  useClaimAuctionLotBidder,
  useClaimDepositLoser,
} from 'src/hooks/api/claim';

export const BidderClaims = ({ auctionInfo }: { auctionInfo: AuctionInfo }) => {
  const claimAuctionLot = useClaimAuctionLotBidder();
  const claimDeposit = useClaimDepositLoser();

  const handleClaimAuctionLot = () => {
    claimAuctionLot.mutate(auctionInfo);
  };
  const handleClaimDeposit = () => {
    claimDeposit.mutate(auctionInfo);
  };

  return (
    <div className="grid lg:grid-cols-2 w-full gap-3">
      <Button className="w-full" onClick={handleClaimAuctionLot}>
        Claim Auction Lot
      </Button>
      <Button className="w-full" onClick={handleClaimDeposit}>
        Claim Deposit
      </Button>
    </div>
  );
};
