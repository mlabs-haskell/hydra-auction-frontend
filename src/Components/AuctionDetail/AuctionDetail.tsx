import { useQueryAuctions } from 'src/hooks/auctions';
import { getUrlParams } from 'src/utils/getUrlParams';
import { useUser } from 'src/hooks/user';
import PlaceBidCompact from '../PlaceBid/PlaceBidCompact';
import { TimeRemaining } from '../Time/TimeRemaining';
import EnterAuction from '../EnterAuction/EnterAuction';

const MOCK_NFT_DESCRIPTION = "Your favorite founder's favorite dog 🐶";
export default function AuctionDetail() {
  // TODO: Display some badge if the user is already a bidder, and for the state of the auction

  // Use url params to get the auctionId
  const urlParams = getUrlParams();
  const auctionId = urlParams.get('auctionId');
  const userDetails = useUser();

  const { data, isLoading, isError } = useQueryAuctions();

  // With auctionId we find the acution details from the queryAuctions cache
  const auctionData = data?.find((auction) => auction.auctionId === auctionId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <div className="flex items-center justify-center">
      <div className="container ">
        <div className="text-center items-center mb-6">
          <h1 className="header me-2">Auction</h1>
          <div className="text-xs text-gray-500">{auctionId}</div>
        </div>

        <div className="flex justify-center items-center mb-6">
          <img
            className="blur-sm"
            width={500}
            alt=""
            src="/images/sample_nft.png"
          />
        </div>

        <div className="mb-6">
          <div className="text-lg">Description</div>
          <p className="text-gray-600 text-sm mb-4">{MOCK_NFT_DESCRIPTION}</p>
          <div className="flex  justify-between">
            <div>
              <div className="text-lg">Bidding Ends</div>
              <div className="text-sm text-gray-500">
                <TimeRemaining
                  endDate={Number(auctionData?.auctionTerms.biddingEnd) || 0}
                />
              </div>
            </div>
            {/* TODO: Current Bid */}
          </div>
        </div>
        {/* If the user is a bidder, show the place bid form, otherwise show the enter auction form */}
        {userDetails.data?.bidder.auctions?.some(
          (obj) => obj.auctionId === auctionData?.auctionId
        ) ? (
          <PlaceBidCompact />
        ) : (
          auctionData && <EnterAuction auction={auctionData} />
        )}
      </div>
    </div>
  );
}
