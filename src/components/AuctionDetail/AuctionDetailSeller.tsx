import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { DiscoverBidders } from '../DiscoverBidders/DiscoverBidders';
import StartBidding from '../StartBidding/StartBidding';
import { SellerClaims } from './SellerClaims';

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
        <DiscoverBidders walletApp={walletApp} auctionInfo={auctionInfo} />
        <StartBidding walletApp={walletApp} auctionInfo={auctionInfo} />
        <SellerClaims auctionInfo={auctionInfo} />
      </div>
    </div>
  );
}
