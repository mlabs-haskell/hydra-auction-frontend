import { AuctionInfo, ContractConfig } from 'hydra-auction-offchain';
import { DiscoverAuthorizeBidders } from '../DiscoverAuthorizeBidders/DiscoverAuthorizeBidders';
import { SellerClaims } from './SellerClaims';
import StartBidding from '../StartBidding/StartBidding';
import MoveBidL2 from '../MoveBidL2/MoveBidL2';

export type AuctionDetailSellerProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
};

export default function AuctionDetailSeller({
  config,
  auctionInfo,
}: AuctionDetailSellerProps) {
  return (
    <div
      data-testid="seller-detail"
      className="flex flex-col justify-center items-center w-full"
    >
      <div className="flex flex-col  gap-6 items-center w-full">
        <div className="text-title3 text-center mb-3">Seller Options</div>
        <DiscoverAuthorizeBidders config={config} auctionInfo={auctionInfo} />
        <StartBidding config={config} auctionInfo={auctionInfo} />
        <MoveBidL2 config={config} auctionInfo={auctionInfo} />
        <SellerClaims auctionInfo={auctionInfo} />
      </div>
    </div>
  );
}
