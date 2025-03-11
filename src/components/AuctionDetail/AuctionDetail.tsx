import { useActiveAuctions } from 'src/hooks/api/auctions';
import { getUrlParams } from 'src/utils/getUrlParams';
import IpfsImage from '../IpfsImage/IpfsImage';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';
import { getIsSeller } from 'src/utils/auctionState';
import { useWalletAddress } from 'src/hooks/api/user';
import AuctionDetailSeller from './AuctionDetailSeller';
import AuctionDetailBidder from './AuctionDetailBidder';
import { getAuctionAssetUnit } from 'src/utils/auction';
import AuctionSubDetail from './AuctionSubDetail';
import { useAssetMetadata } from 'src/hooks/api/assets';
import { useCleanupAuction } from 'src/hooks/api/cleanup';
import { Button } from '../shadcn/Button';
import { getConfig } from 'src/utils/config';
import { useMixpanel } from 'react-mixpanel-browser';
import { useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';

const MOCK_NFT_TITLE = 'My NFT';

// TODO: Claims and cleanup components are always showing, we will implement the conditions when the APIs are ready
export default function AuctionDetail() {
  // TODO: Display some badge if the user is already a bidder, and for the state of the auction
  const mixPanel = useMixpanel();
  // Use url params to get the auctionId
  const urlParams = getUrlParams();
  const auctionId = urlParams.get('auctionId') || '';
  const { name: walletName, wallet, connected } = useWallet();
  const walletApp: WalletApp = walletName as WalletApp;
  const config = getConfig(walletApp);
  const { data: auctions, isLoading, isError } = useActiveAuctions(config);
  const { data: walletAddress } = useWalletAddress(wallet as BrowserWallet, connected);

  // With auctionId we find the auction details from the queryAuctions cache
  const auctionInfo = auctions?.find(
    (auction) => auction.auctionId === auctionId
  );

  const assetUnit = getAuctionAssetUnit(auctionInfo);

  const cleanupAuction = useCleanupAuction(config);

  const { data: assetMetadata } = useAssetMetadata(assetUnit);

  // Identifying if we are the seller or a bidder of this auction

  const isSeller = getIsSeller(walletAddress, auctionInfo);

  const handleCleanupAuction = () => {
    if (auctionInfo) {
      cleanupAuction.mutate(auctionInfo);
    }
  };

  useEffect(() => {
    mixPanel.track('AuctionViewed', {
      auctionId: auctionId,
      walletAddr: walletAddress,
      userType: isSeller ? 'Seller' : 'Bidder',
    });
  }, [isSeller, auctionId, mixPanel, walletAddress]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting auction...</div>;
  if (!auctionInfo) return <div>Error finding auction...</div>;
  if (!walletAddress || !walletName) return <div>Wallet not valid</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <div className="flex justify-center items-center mb-6">
        <IpfsImage assetUnit={assetUnit} />
      </div>
      <div className="flex flex-col items-center gap-10">
        <div className="text-title2 font-semibold mb-6">
          {assetMetadata?.name ? assetMetadata.name : MOCK_NFT_TITLE}
        </div>
        {/* NOTE: If you want to make testing easier, just show both bidder and seller auction details without any conditions */}
        {isSeller ? (
          <div className="w-full">
            <AuctionDetailSeller config={config} auctionInfo={auctionInfo} />
          </div>
        ) : (
          <AuctionDetailBidder
            config={config}
            walletAddress={walletAddress}
            auctionInfo={auctionInfo}
          />
        )}

        <Button onClick={handleCleanupAuction} className="w-full">
          Cleanup
        </Button>

        <AuctionSubDetail
          description={assetMetadata?.description}
          auctionInfo={auctionInfo}
        />
      </div>
    </div>
  );
}
