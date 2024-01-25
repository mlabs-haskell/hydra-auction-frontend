import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { DiscoverBidders } from '../DiscoverBidders/DiscoverBidders';
import StartBidding from '../StartBidding/StartBidding';
import { ArrowDownIcon } from '@radix-ui/react-icons';
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
        <ArrowDownIcon className="text-3xl font-bold" />
        <StartBidding walletApp={walletApp} auctionInfo={auctionInfo} />
        <ArrowDownIcon className="text-3xl font-bold" />
        <SellerClaims auctionInfo={auctionInfo} />
        <ArrowDownIcon className="text-3xl font-bold mb-6" />
      </div>
    </div>
  );
}
