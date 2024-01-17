import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import {
  useDiscoverSellerSignature,
  useStandingBidState,
} from '../../hooks/bidding';
import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { ADA_CURRENCY_SYMBOL } from '../../utils/currency';

type BiddingViewProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

export default function BiddingView({
  walletApp,
  auctionInfo,
}: BiddingViewProps) {
  const { data: sellerSignature } = useDiscoverSellerSignature(walletApp, {
    auctionCs: auctionInfo.auctionTerms.auctionLot[0].cs,
    sellerPkh: auctionInfo.auctionTerms.sellerPkh,
  });

  const { data: standingBidState } = useStandingBidState(
    walletApp,
    auctionInfo
  );
  if (!sellerSignature || !standingBidState)
    return <div>Error verifying bidding...</div>;
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex gap-2 items-center">
        <div className="text-dim">Standing Bid: </div>
        <div className="font-semibold">{standingBidState?.price}</div>
        <div>{ADA_CURRENCY_SYMBOL}</div>
      </div>
      <PlaceBidForm
        auctionCs={auctionInfo.auctionTerms.auctionLot[0].cs}
        sellerSignature={sellerSignature}
        standingBid={standingBidState.price}
      />
    </div>
  );
}
