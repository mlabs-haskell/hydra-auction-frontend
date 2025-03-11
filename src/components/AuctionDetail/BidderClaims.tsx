import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { Button } from '../shadcn/Button';
import {
  useClaimAuctionLotBidder,
  useClaimDepositLoser,
} from 'src/hooks/api/claim';
import { useWallet } from '@meshsdk/react';
import { getConfig } from 'src/utils/config';

export const BidderClaims = ({ auctionInfo }: { auctionInfo: AuctionInfo }) => {
  const { name: walletName } = useWallet();
  const config = getConfig(walletName as WalletApp);
  const claimAuctionLot = useClaimAuctionLotBidder(config);
  const claimDeposit = useClaimDepositLoser(config);

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
