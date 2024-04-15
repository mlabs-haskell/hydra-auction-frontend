import {
  AuctionInfo,
  StandingBidState,
  WalletApp,
} from 'hydra-auction-offchain';

import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { formatLovelaceToAda } from '../../utils/currency';
import { Button } from '../shadcn/Button';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import AuctionBidState from './AuctionBidState';
import { useStandingBidState } from 'src/hooks/api/standingBidState';

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

  const standingBidStatePrice = standingBidState?.value || '';
  let formattedPrice = '';
  if (contractOutputResultSchema.safeParse(standingBidStatePrice)) {
    const standingBidValue = standingBidState?.value as StandingBidState;
    formattedPrice = formatLovelaceToAda(standingBidValue?.price);
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <AuctionBidState
        auctionTerms={auctionInfo.auctionTerms}
        formattedPrice={formattedPrice}
      />
      <div className="flex w-full gap-1">
        <Button className="w-full">Place Bid</Button>
      </div>
      <PlaceBidForm
        auctionInfo={auctionInfo}
        sellerSignature={sellerSignature}
        walletApp={walletApp}
        standingBid={formattedPrice ?? ''}
      />
    </div>
  );
}
