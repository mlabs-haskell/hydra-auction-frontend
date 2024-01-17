import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import { DiscoverBidders } from '../DiscoverBidders/DiscoverBidders';
import StartBidding from '../StartBidding/StartBidding';
import { ArrowDownIcon } from '@radix-ui/react-icons';

export type AuctionDetailSellerProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

export default function AuctionDetailSeller({
  walletApp,
  auctionInfo,
}: AuctionDetailSellerProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col  gap-6 w-72 items-center">
        <div className="text-title3 text-center mb-3">Seller Options</div>
        <DiscoverBidders walletApp={walletApp} auctionInfo={auctionInfo} />
        <ArrowDownIcon className="text-3xl font-bold" />
        <StartBidding walletApp={walletApp} auctionInfo={auctionInfo} />
      </div>
    </div>
  );
}
