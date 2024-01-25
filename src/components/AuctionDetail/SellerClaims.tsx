import { useClaimAuctionLotSeller } from 'src/hooks/api/claim';
import { Button } from '../shadcn/Button';
import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { useWallet } from '@meshsdk/react';

export const SellerClaims = ({ auctionInfo }: { auctionInfo: AuctionInfo }) => {
  const { name: walletName } = useWallet();

  const claimAuctionLot = useClaimAuctionLotSeller(walletName as WalletApp);

  const handleClaimAuctionLot = () => {
    claimAuctionLot.mutate(auctionInfo);
  };
  return (
    <Button className="w-full" onClick={handleClaimAuctionLot}>
      Claim Auction Lot
    </Button>
  );
};
