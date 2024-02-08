import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import EnterAuction from '../EnterAuction/EnterAuction';
import BiddingView from './BiddingView';
import { BidderClaims } from './BidderClaims';
import { useAuctionsBidding } from 'src/hooks/api/enterAuction';
import { getIsBidder } from 'src/utils/auctionState';
import { useWallet } from '@meshsdk/react';
import { useWalletAddress } from 'src/hooks/api/user';

type AuctionDetailBidderProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

export default function AuctionDetailBidder({
  walletApp,
  auctionInfo,
}: AuctionDetailBidderProps) {
  const { wallet, connected } = useWallet();
  const { data: walletAddress } = useWalletAddress(wallet, connected);
  const { data: auctionsBidding } = useAuctionsBidding(
    walletAddress,
    auctionInfo?.auctionId
  );
  const isBidder = getIsBidder(auctionsBidding, auctionInfo);
  console.log({ isBidder });
  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="text-title3 text-center mb-3">Bidder Options</div>
      {isBidder ? (
        <BiddingView walletApp={walletApp} auctionInfo={auctionInfo} />
      ) : (
        <EnterAuction auction={auctionInfo} />
      )}
      <BidderClaims auctionInfo={auctionInfo} />
    </div>
  );
}
