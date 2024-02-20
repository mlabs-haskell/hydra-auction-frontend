import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { useStandingBidState } from '../../hooks/api/bidding';
import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { ADA_CURRENCY_SYMBOL, formatLovelaceToAda } from '../../utils/currency';
import { Button } from '../shadcn/Button';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';

type BiddingViewProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
  sellerSignature: string;
};

export default function BiddingView({
  walletApp,
  auctionInfo,
  sellerSignature,
}: BiddingViewProps) {
  const { data: standingBidState } = useStandingBidState(
    walletApp,
    auctionInfo
  );
  const formattedPrice = formatLovelaceToAda(standingBidState?.price);
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex justify-center mb-12 items-stretch">
        <div className="flex justify-center items-start border-r border-gray-300 w-full">
          <div className="flex flex-col ">
            <div className="text-dim mb-5">Current Bid </div>
            <div className="flex gap-2 items-center">
              <div className="text-title1 font-bold">{ADA_CURRENCY_SYMBOL}</div>
              <div className="text-title1 font-bold">{formattedPrice}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <AuctionStateRemaining size="large" {...auctionInfo.auctionTerms} />
        </div>
      </div>
      <div className="flex w-full gap-1">
        <Button className="w-full">Place Bid</Button>
      </div>
      <PlaceBidForm
        auctionInfo={auctionInfo}
        sellerSignature={sellerSignature}
        walletApp={walletApp}
        standingBid={standingBidState?.price ?? ''}
      />
    </div>
  );
}
