import { useActiveAuctions } from '../../hooks/auctions';
import AuctionCard from '../AuctionCard/AuctionCard';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';

// TODO: hide card if no ipfs image
export default function AuctionList() {
  const { name: walletName } = useWallet();
  const walletApp: WalletApp = walletName as WalletApp;
  const { data: auctions } = useActiveAuctions(walletApp);
  console.log({ auctions });
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-title1 text-center mb-3">Query Auctions</h1>
        <hr className="border-b border-gray-400 w-32 mb-4" />
      </div>
      <div>
        <div className="flex gap-2 p-2 font-semibold">
          {auctions?.length || 0} Auctions
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {auctions?.map((auctionInfo, index) => (
            <AuctionCard
              key={`${auctionInfo.auctionId}_${index}`}
              {...auctionInfo}
            />
          ))}
        </div>
      </div>
    </>
  );
}
