import {
  AuctionInfo,
  ContractConfig,
  StandingBidState,
  WalletApp,
} from 'hydra-auction-offchain';

import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { formatLovelaceToAda } from '../../utils/currency';
import { Button } from '../shadcn/Button';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import AuctionBidState from './AuctionBidState';
import { useStandingBidState } from 'src/hooks/api/standingBidState';
import { PlaceBidL2Form } from '../PlaceBidL2/PlaceBidL2';

type BiddingViewProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
  sellerSignature: string;
};

export default function BiddingView({
  config,
  auctionInfo,
  sellerSignature,
}: BiddingViewProps) {
  const { data: standingBidState } = useStandingBidState(config, auctionInfo);

  let formattedPrice = '';
  if (contractOutputResultSchema.safeParse(standingBidState).success) {
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
        config={config}
        standingBid={formattedPrice ?? ''}
      />
      <div className="flex w-full gap-1">
        <Button className="w-full">Place Bid on L2</Button>
      </div>
      <PlaceBidL2Form
        config={config}
        auctionCs={auctionInfo.auctionId}
        auctionTerms={auctionInfo.auctionTerms}
        delegateInfo={auctionInfo.delegateInfo}
        sellerSignature={sellerSignature}
      />
    </div>
  );
}
