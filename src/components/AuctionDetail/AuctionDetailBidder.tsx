import { AuctionInfo, ContractConfig } from 'hydra-auction-offchain';
import EnterAuction from '../EnterAuction/EnterAuction';
import BiddingView from './BiddingView';
import { BidderClaims } from './BidderClaims';
import { useDiscoverSellerSignature } from 'src/hooks/api/discoverSellerSignature';
import { useWalletVk } from 'src/hooks/api/walletVk';
import { useEffect, useState } from 'react';

type AuctionDetailBidderProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
  walletAddress: string;
};

export default function AuctionDetailBidder({
  config,
  auctionInfo,
  walletAddress,
}: AuctionDetailBidderProps) {
  const [walletVkEnabled, setWalletVkEnabled] = useState<boolean>(true);
  const { data: walletVk } = useWalletVk(config, walletVkEnabled);

  const { data: sellerSignature } = useDiscoverSellerSignature(
    config,
    walletAddress,
    {
      auctionCs: auctionInfo.auctionId,
      sellerAddress: auctionInfo.auctionTerms.sellerAddress,
      bidderVk: walletVk ?? null,
    },
    walletVkEnabled
  );

  // sellerSignature returns a valid value only if we are an authorized bidder on the auction
  useEffect(() => {
    if (sellerSignature) {
      setWalletVkEnabled(false);
    }
  }, [sellerSignature]);
  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="text-title3 text-center mb-3">Bidder Options</div>
      {sellerSignature ? (
        <BiddingView
          config={config}
          auctionInfo={auctionInfo}
          sellerSignature={sellerSignature}
        />
      ) : (
        <EnterAuction auction={auctionInfo} />
      )}
      <BidderClaims auctionInfo={auctionInfo} />
    </div>
  );
}
