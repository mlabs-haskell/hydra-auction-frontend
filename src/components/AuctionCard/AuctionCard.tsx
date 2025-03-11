import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import IpfsImage from '../IpfsImage/IpfsImage';

import { getAuctionAssetUnit } from 'src/utils/auction';
import { useAssetMetadata } from 'src/hooks/api/assets';

import { useWallet } from '@meshsdk/react';
import {
  ADA_CURRENCY_SYMBOL,
  formatLovelaceToAda,
  lovelaceToAda,
} from 'src/utils/currency';
import { TimerIcon } from '@radix-ui/react-icons';
import { useStandingBidState } from 'src/hooks/api/standingBidState';
import { getConfig } from 'src/utils/config';
import { Link } from 'react-router-dom';

type AuctionCardProps = {
  auctionInfo: AuctionInfo;
};

function AuctionCard({ auctionInfo }: AuctionCardProps) {
  // For now, since we are just listing singular assets, we use the auctionLot[0] object

  const assetUnit = getAuctionAssetUnit(auctionInfo);
  const { data: metadata } =
    useAssetMetadata(assetUnit);
  const { name: walletApp } = useWallet();
  const config = getConfig(walletApp as WalletApp);
  const { data: standingBidState } = useStandingBidState(config, auctionInfo);

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:bg-slate-200 h-full">
      <Link
        className="flex flex-col items-center h-full"
        to={`/auction?auctionId=${auctionInfo.auctionId}`}
      >
        <div className="aspect-w-1 aspect-h-1 w-full h-full max-h-72 overflow-hidden justify-center items-center">
          {metadata && (
            <IpfsImage
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110 hover:transform"
              assetUnit={assetUnit}
            />
          )}
        </div>
        <div className="flex flex-col items-center w-full p-3">
          <div className="overflow-hidden font-semibold text-title3 w-full mb-1">
            {metadata?.name}
          </div>
          <div className="w-full pb-2 border-b border-slate-300 mb-3">
            <div className="flex justify-end gap-2 font-bold mb-1">
              <div>{ADA_CURRENCY_SYMBOL}</div>
              <div>{formatLovelaceToAda(standingBidState?.price)}</div>
            </div>
            <div className="overflow-hidden text-end text-dim">
              {ADA_CURRENCY_SYMBOL}{' '}
              {lovelaceToAda(auctionInfo.auctionTerms.minDepositAmount)} Min
              Deposit
            </div>
          </div>
          <div className="flex w-full justify-between items-center gap-3">
            <AuctionStateRemaining {...auctionInfo.auctionTerms} />
            <TimerIcon className="font-bold " />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default AuctionCard;
