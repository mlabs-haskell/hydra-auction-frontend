import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { DiscoverAuthorizeBidders } from '../DiscoverAuthorizeBidders/DiscoverAuthorizeBidders';
import { SellerClaims } from './SellerClaims';
import StartBidding from '../StartBidding/StartBidding';

export type AuctionDetailSellerProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

export default function AuctionDetailSeller({
  walletApp,
  auctionInfo,
}: AuctionDetailSellerProps) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col  gap-6 items-center w-full">
        <div className="text-title3 text-center mb-3">Seller Options</div>
        <DiscoverAuthorizeBidders
          walletApp={walletApp}
          auctionInfo={auctionInfo}
        />
        <StartBidding walletApp={walletApp} auctionInfo={auctionInfo} />
        <SellerClaims auctionInfo={auctionInfo} />
      </div>
    </div>
  );
}
