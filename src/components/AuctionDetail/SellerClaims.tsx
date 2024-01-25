import { useClaimAuctionLotSeller } from 'src/hooks/api/claim';
import { Button } from '../shadcn/Button';
import { AuctionInfo } from 'hydra-auction-offchain';

export const SellerClaims = ({ auctionInfo }: { auctionInfo: AuctionInfo }) => {
  const claimAuctionLot = useClaimAuctionLotSeller();

  const handleClaimAuctionLot = () => {
    claimAuctionLot.mutate(auctionInfo);
  };
  return (
    <Button className="w-full" onClick={handleClaimAuctionLot}>
      Claim Auction Lot
    </Button>
  );
};
