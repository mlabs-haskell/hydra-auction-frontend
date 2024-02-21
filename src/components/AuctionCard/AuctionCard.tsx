import {
  AuctionInfo,
  StandingBidState,
  WalletApp,
} from 'hydra-auction-offchain';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import IpfsImage from '../IpfsImage/IpfsImage';

import { getAuctionAssetUnit } from 'src/utils/auction';
import { useAssetMetadata } from 'src/hooks/api/assets';

import { useWallet } from '@meshsdk/react';
import {
  ADA_CURRENCY_SYMBOL,
  formatLovelaceToAda,
  numberWithCommas,
} from 'src/utils/currency';
import { TimerIcon } from '@radix-ui/react-icons';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { useStandingBidState } from 'src/hooks/api/standingBidState';

type AuctionCardProps = {
  auctionInfo: AuctionInfo;
};

function AuctionCard({ auctionInfo }: AuctionCardProps) {
  // For now, since we are just listing singular assets, we use the auctionLot[0] object

  const assetUnit = getAuctionAssetUnit(auctionInfo);
  const { data: metadata, isLoading: isLoadingMetadata } =
    useAssetMetadata(assetUnit);
  const { name: walletName } = useWallet();
  const { data: standingBidState, isLoading: isLoadingStandingBidState } =
    useStandingBidState(walletName as WalletApp, auctionInfo);
  const standingBidStatePrice = standingBidState?.value || '';
  let formattedPrice = '';
  // Unexpected response from queryStandingBidState right now, this will be changed
  if (contractOutputResultSchema.safeParse(standingBidStatePrice).success) {
    const standingBidValue = standingBidState?.value as StandingBidState;
    formattedPrice = formatLovelaceToAda(standingBidValue?.price);
  }

  if (isLoadingMetadata || isLoadingStandingBidState)
    return <div>Loading...</div>;
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:bg-slate-200 h-full">
      <a
        className="flex flex-col items-center h-full"
        href={`/auction?auctionId=${auctionInfo.auctionId}`}
      >
        <div className="aspect-w-1 aspect-h-1 w-full h-full max-h-72 overflow-hidden justify-center items-center">
          <IpfsImage
            className="w-full h-full object-cover object-center transition-transform duration-[500ms] hover:scale-110 hover:transform"
            assetUnit={assetUnit}
          />
        </div>
        <div className="flex flex-col items-center w-full p-3">
          <div className="overflow-hidden font-semibold text-title3 w-full mb-1">
            {metadata?.name}
          </div>
          <div className="w-full pb-2 border-b border-slate-300 mb-3">
            <div className="flex justify-end gap-2 font-bold mb-1">
              <div>{ADA_CURRENCY_SYMBOL}</div>
              <div>{formattedPrice}</div>
            </div>
            <div className="overflow-hidden text-end text-dim">
              {numberWithCommas(auctionInfo.auctionTerms.minDepositAmount)} Min
              Deposit
            </div>
          </div>
          <div className="flex w-full justify-between items-center gap-3">
            <AuctionStateRemaining {...auctionInfo.auctionTerms} />
            <TimerIcon className="font-bold " />
          </div>
        </div>
      </a>
    </div>
  );
}

export default AuctionCard;
