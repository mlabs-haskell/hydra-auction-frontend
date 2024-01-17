import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import EnterAuction from '../EnterAuction/EnterAuction';
import BiddingView from './BiddingView';

type AuctionDetailBidderProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

export default function AuctionDetailBidder({
  walletApp,
  auctionInfo,
}: AuctionDetailBidderProps) {
  console.log({ localStorage });
  return (
    <div className="flex flex-col gap-6 justify-center items-center h-full">
      <div className="flex flex-col gap-6 items-center w-72">
        <div className="text-title3 text-center mb-3">Bidder Options</div>
        <EnterAuction auction={auctionInfo} />
      </div>
      <BiddingView walletApp={walletApp} auctionInfo={auctionInfo} />
    </div>
  );
}
