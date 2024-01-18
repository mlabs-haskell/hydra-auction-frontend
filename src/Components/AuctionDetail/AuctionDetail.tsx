import { useActiveAuctions } from 'src/hooks/api/auctions';
import { getUrlParams } from 'src/utils/getUrlParams';
import IpfsImage from '../IpfsImage/IpfsImage';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';
import { getIsBidder, getIsSeller } from 'src/utils/auctionState';
import { useSellerAddress } from 'src/hooks/api/user';
import AuctionDetailSeller from './AuctionDetailSeller';
import AuctionDetailBidder from './AuctionDetailBidder';
import { useAuctionsBidding } from '../../hooks/api/enterAuction';
import { getAuctionAssetUnit } from 'src/utils/auction';
import AuctionSubDetail from './AuctionSubDetail';

const MOCK_NFT_TITLE = 'My NFT';

export default function AuctionDetail() {
  // TODO: Display some badge if the user is already a bidder, and for the state of the auction

  // Use url params to get the auctionId
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit') || '';
  const { name: walletName } = useWallet();
  const walletApp: WalletApp = walletName as WalletApp;
  const { data: auctions, isLoading, isError } = useActiveAuctions(walletApp);
  const {
    data: sellerAddress,
    isLoading: isSellerAddressLoading,
    isError: isSellerAddressError,
  } = useSellerAddress();

  console.log({ auctions });

  // With auctionId we find the auction details from the queryAuctions cache
  const auctionInfo = auctions?.find(
    (auction) => getAuctionAssetUnit(auction) === assetUnit
  );

  const { data: auctionsBidding } = useAuctionsBidding(auctionInfo?.auctionId);

  if (isLoading || isSellerAddressLoading) return <div>Loading...</div>;
  if (isError || isSellerAddressError)
    return <div>Error getting auction...</div>;
  if (!auctionInfo || !sellerAddress || !auctionInfo || !walletName)
    return <div>Error finding auction...</div>;

  // Identifying if we are the seller or a bidder of this auction
  const isSeller = getIsSeller(sellerAddress, auctionInfo);

  const isBidder = getIsBidder(auctionsBidding, auctionInfo);

  console.log({ isSeller, isBidder });

  return (
    <div className="flex items-center justify-center">
      {/* TODO: Remove container */}
      <div className="container ">
        <div className="grid lg:grid-cols-2 gap-3">
          <div className="flex justify-center items-center mb-6">
            <IpfsImage className="" assetUnit={assetUnit} />
          </div>
          <div className="flex flex-col items-center gap-10">
            <div className="text-title2 font-semibold mb-6">
              {MOCK_NFT_TITLE}
            </div>
            {/* TODO: for now, to test flow between bidder-seller, we will keep both bidder and seller components showing */}
            {isSeller ? (
              <div className="w-full">
                <AuctionDetailSeller
                  walletApp={walletApp}
                  auctionInfo={auctionInfo}
                />
                <AuctionDetailBidder
                  walletApp={walletApp}
                  auctionInfo={auctionInfo}
                />
              </div>
            ) : (
              <></>
            )}
            <AuctionSubDetail auctionInfo={auctionInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
