import { ADA_CURRENCY_SYMBOL } from 'src/utils/currency';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import { AuctionTerms } from 'hydra-auction-offchain';

type AuctionBidStateProps = {
  auctionTerms: AuctionTerms;
  formattedPrice: string;
};
export default function AuctionBidState({
  auctionTerms,
  formattedPrice,
}: AuctionBidStateProps) {
  return (
    <div className="flex justify-center mb-12 items-stretch">
      <div className="flex justify-center items-start border-r border-gray-300 w-full">
        <div className="flex flex-col ">
          <div className="text-dim mb-5">Current Bid </div>
          <div className="flex gap-2 items-center">
            <div className="text-title1 font-bold">{ADA_CURRENCY_SYMBOL}</div>
            <div className="text-title1 font-bold">{formattedPrice}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <AuctionStateRemaining size="large" {...auctionTerms} />
      </div>
    </div>
  );
}
