import { AuctionTerms } from 'hydra-auction-offchain';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import IpfsImage from '../IpfsImage/IpfsImage';

type AuctionCardProps = {
  auctionId: string;
  auctionTerms: AuctionTerms;
};

function AuctionCard({ auctionId, auctionTerms }: AuctionCardProps) {
  // For now, since we are just listing singular assets, we use the auctionLot[0] object
  const tn = auctionTerms.auctionLot[0].tn;
  const cs = auctionTerms.auctionLot[0].cs;
  const assetUnit = `${cs}${tn}`;

  return (
    <div className="border p-4 rounded-lg shadow-md hover:bg-slate-200">
      <a href={`/auction?auctionId=${auctionId}`}>
        <div className="flex justify-center items-center mb-3">
          <IpfsImage assetUnit={assetUnit} />
        </div>
        <div className="overflow-hidden">Auction ID: {auctionId}</div>

        <div className="overflow-hidden">
          Minimum Deposit: {auctionTerms.minDepositAmount}
        </div>
        <AuctionStateRemaining {...auctionTerms} />
      </a>
    </div>
  );
}

export default AuctionCard;
