import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { Button } from '../shadcn/Button';
import {
  useClaimAuctionLotBidder,
  useClaimDepositLoser,
} from 'src/hooks/api/claim';
import { useWallet } from '@meshsdk/react';

export const BidderClaims = ({ auctionInfo }: { auctionInfo: AuctionInfo }) => {
  const { name: walletName } = useWallet();

  const claimAuctionLot = useClaimAuctionLotBidder(walletName as WalletApp);
  const claimDeposit = useClaimDepositLoser(walletName as WalletApp);

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
