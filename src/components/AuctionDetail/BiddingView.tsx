import {
  AuctionInfo,
  ContractConfig
} from 'hydra-auction-offchain';

import { PlaceBidForm } from '../PlaceBid/PlaceBid';
import { formatLovelaceToAda } from '../../utils/currency';

import AuctionBidState from './AuctionBidState';
import { useStandingBidState } from 'src/hooks/api/standingBidState';
import { PlaceBidL2Form } from '../PlaceBidL2/PlaceBidL2';
import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
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
  const [standingBidL2, setStandingBidL2] = useState<string>('');
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const { lastMessage, readyState } = useWebSocket(
    auctionInfo.delegateInfo?.wsServers[0] ?? ''
  );

  useEffect(() => {
    try {
      const jsonMsg = lastMessage?.data;
      const msg = JSON.parse(jsonMsg);
      if (msg) {
        if (msg.tag === 'StandingBid') {
          setStandingBidL2(msg.value.price);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [lastMessage, readyState, setStandingBidL2]);

  useEffect(() => {
    if (standingBidL2) {
      setFormattedPrice(formatLovelaceToAda(standingBidL2));
    } else if (standingBidState) {
      setFormattedPrice(formatLovelaceToAda(standingBidState?.price));
    }
  }, [standingBidState, standingBidL2]);

  return (
    <div className="w-full flex flex-col gap-10" data-testid="bidding-view">
      <AuctionBidState
        auctionTerms={auctionInfo.auctionTerms}
        formattedPrice={formattedPrice}
      />
      <div className="w-full">Place Bid</div>
      <PlaceBidForm
        auctionInfo={auctionInfo}
        sellerSignature={sellerSignature}
        config={config}
        standingBid={formattedPrice ?? ''}
      />

      <div className="w-full">Place Bid on L2</div>

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
