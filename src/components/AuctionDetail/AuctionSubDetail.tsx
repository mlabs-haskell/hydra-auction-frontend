import { AssetMetadata } from '@meshsdk/core';
import { ListBulletIcon } from '@radix-ui/react-icons';
import { AuctionInfo } from 'hydra-auction-offchain';
import {
  ADA_CURRENCY_SYMBOL,
  formatLovelaceToAda,
  numberWithCommas,
} from 'src/utils/currency';

const MOCK_NFT_DESCRIPTION = 'Mock NFT Description 🐶';

const AuctionTermCard = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => {
  return (
    <div>
      <div className="text-sm text-dim">{label}</div>
      <div className=" font-bold ">
        {ADA_CURRENCY_SYMBOL} {numberWithCommas(value || '')}
      </div>
    </div>
  );
};
export default function AuctionSubDetail({
  auctionInfo,
  description,
}: {
  auctionInfo: AuctionInfo;
  description?: AssetMetadata;
}) {
  return (
    <div className="flex flex-col  w-full">
      <div className="flex mb-4 items-center gap-2 py-3 border-b border-gray-400 font-semibold">
        <ListBulletIcon />
        <div>Details</div>
      </div>
      <div className="mb-10">
        <div className="mb-4">Description from the Creator</div>
        <p className="text-dim">
          {description ? description : MOCK_NFT_DESCRIPTION}
        </p>
      </div>

      <div className="mb-4">Auction Terms</div>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <AuctionTermCard
          label="Minimum Deposit"
          value={formatLovelaceToAda(
            auctionInfo?.auctionTerms.minDepositAmount
          )}
        />
        <AuctionTermCard
          label="Minimum Bid Increment"
          value={formatLovelaceToAda(auctionInfo?.auctionTerms.minBidIncrement)}
        />
        <AuctionTermCard
          label="Delegate Auction Fee"
          value={formatLovelaceToAda(
            auctionInfo?.auctionTerms.auctionFeePerDelegate
          )}
        />
        <AuctionTermCard
          label="Starting Bid"
          value={formatLovelaceToAda(auctionInfo?.auctionTerms.startingBid)}
        />
      </div>
    </div>
  );
}
