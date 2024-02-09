import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import {
  useDiscoverSellerSignature,
  useStandingBidState,
} from '../../hooks/api/bidding';
import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { ADA_CURRENCY_SYMBOL } from '../../utils/currency';
import { Button } from '../shadcn/Button';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';

type BiddingViewProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

// TODO: figure out buy it now flow, disable/grey out button if no buy it now
export default function BiddingView({
  walletApp,
  auctionInfo,
}: BiddingViewProps) {
  const { data: sellerSignature } = useDiscoverSellerSignature(walletApp, {
    auctionCs: auctionInfo.auctionId,
    sellerAddress: auctionInfo.auctionTerms.sellerAddress,
  });
  const { data: standingBidState } = useStandingBidState(
    walletApp,
    auctionInfo
  );
  if (sellerSignature?.tag !== 'result') {
    return <div>Seller Signature Error</div>;
  }
  if (!sellerSignature) return <div>Error verifying bidding...</div>;
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex justify-center mb-12 items-stretch">
        <div className="flex justify-center items-start border-r border-gray-300 w-full">
          <div className="flex flex-col ">
            <div className="text-dim mb-5">Current Bid </div>
            <div className="flex gap-2 items-center">
              <div className="text-title1 font-bold">{ADA_CURRENCY_SYMBOL}</div>
              <div className="text-title1 font-bold">
                {standingBidState?.price}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full">
          <AuctionStateRemaining size="large" {...auctionInfo.auctionTerms} />
        </div>
      </div>
      <div className="flex w-full gap-1">
        <Button className="w-full">Place Bid</Button>
        <Button variant="outline" className="w-full">
          Buy it now
        </Button>
      </div>
      <PlaceBidForm
        auctionInfo={auctionInfo}
        sellerSignature={sellerSignature.value ?? ''}
        walletApp={walletApp}
        standingBid={standingBidState?.price ?? ''}
      />
    </div>
  );
}
