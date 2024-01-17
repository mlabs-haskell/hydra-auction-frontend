import { useActiveAuctions } from 'src/hooks/auctions';
import { getUrlParams } from 'src/utils/getUrlParams';
import AuctionStateRemaining from '../Time/AuctionStateRemaining';
import IpfsImage from '../IpfsImage/IpfsImage';
import { useWallet } from '@meshsdk/react';
import { WalletApp } from 'hydra-auction-offchain';
import { getIsBidder, getIsSeller } from 'src/utils/auctionState';
import { useSellerAddress } from 'src/hooks/user';
import AuctionDetailSeller from './AuctionDetailSeller';
import AuctionDetailBidder from './AuctionDetailBidder';
import { useAuctionsBidding } from '../../hooks/enterAuction';

const MOCK_NFT_DESCRIPTION = 'Mock NFT Description 🐶';
export default function AuctionDetail() {
  // TODO: Display some badge if the user is already a bidder, and for the state of the auction

  // Use url params to get the auctionId
  const urlParams = getUrlParams();
  const auctionId = urlParams.get('auctionId');
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
    (auction) => auction.auctionId === auctionId
  );

  const { data: auctionsBidding } = useAuctionsBidding(auctionInfo?.auctionId);

  if (isLoading || isSellerAddressLoading) return <div>Loading...</div>;
  if (isError || isSellerAddressError)
    return <div>Error getting auction...</div>;
  if (!auctionInfo || !sellerAddress || !auctionInfo || !walletName)
    return <div>Error finding auction...</div>;
  const assetUnit = `${auctionInfo?.auctionTerms?.auctionLot[0].cs}${auctionInfo?.auctionTerms?.auctionLot[0].tn}`;

  // Identifying if we are the seller or a bidder of this auction
  const isSeller = getIsSeller(sellerAddress, auctionInfo);

  const isBidder = getIsBidder(auctionsBidding, auctionInfo);

  console.log({ isSeller, isBidder });

  return (
    <div className="flex items-center justify-center">
      <div className="container ">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-title1 text-center mb-3">Auction Detail</h1>
          <hr className="border-b border-gray-400 w-32 mb-4" />
        </div>

        <div className="flex justify-center items-center mb-6">
          <IpfsImage className="blur-sm" assetUnit={assetUnit} />
        </div>

        <div className="mb-10">
          <div className="text-lg">Description</div>
          <p className="text-gray-600 text-sm mb-4">{MOCK_NFT_DESCRIPTION}</p>
          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-lg">Minimum Deposit</div>
              <div className="text-sm text-gray-500">
                {auctionInfo?.auctionTerms.minDepositAmount}
              </div>
            </div>
            <div>
              <div className="text-lg">Minimum Bid Increment</div>
              <div className="text-sm text-gray-500">
                {auctionInfo?.auctionTerms.minBidIncrement}
              </div>
            </div>
            <div>
              <div className="text-lg">Delegate Auction Fee</div>
              <div className="text-sm text-gray-500">
                {auctionInfo?.auctionTerms.auctionFeePerDelegate}
              </div>
            </div>
            <div>
              <div className="text-lg">Starting Bid</div>
              <div className="text-sm text-gray-500">
                {auctionInfo?.auctionTerms.startingBid}
              </div>
            </div>
          </div>
          <div>
            {auctionInfo && (
              <AuctionStateRemaining {...auctionInfo.auctionTerms} />
            )}
          </div>
        </div>
        {/* TODO: for now, to test flow between bidder-seller, we will keep both bidder and seller components showing */}
        {isSeller ? (
          <div className="flex flex-col gap-10">
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
      </div>
    </div>
  );
}
