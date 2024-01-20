import { AuctionInfo } from 'hydra-auction-offchain';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import IpfsImage from '../IpfsImage/IpfsImage';

import { getAuctionAssetUnit } from 'src/utils/auction';

type AuctionCardProps = {
  auctionInfo: AuctionInfo;
};

function AuctionCard({ auctionInfo }: AuctionCardProps) {
  // For now, since we are just listing singular assets, we use the auctionLot[0] object

  const assetUnit = getAuctionAssetUnit(auctionInfo);

  return (
    <div className="border p-4 rounded-lg shadow-md hover:bg-slate-200">
      <a href={`/auction?assetUnit=${assetUnit}`}>
        <div className="flex justify-center items-center mb-3">
          <IpfsImage assetUnit={assetUnit} />
        </div>
        <div className="overflow-hidden">
          Auction ID: {auctionInfo.auctionId}
        </div>

        <div className="overflow-hidden">
          Minimum Deposit: {auctionInfo.auctionTerms.minDepositAmount}
        </div>
        <AuctionStateRemaining {...auctionInfo.auctionTerms} />
      </a>
    </div>
  );
}

export default AuctionCard;
