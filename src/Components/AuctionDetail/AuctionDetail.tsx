import { getUrlParams } from 'src/utils/getUrlParams';

export default function AuctionDetail() {
  // TODO:  Implement discoverBidders(), authorizeBidders(), startBidding()
  //          We probably want the announceAuction to "use" useMutation and optimistically update the cache
  //            so we can see it here immediately.
  //          We will find the auction from query data with the auctionId from the URL
  const urlParams = getUrlParams();
  const auctionId = urlParams.get('auctionId');

  return (
    <div className="p-6">
      <h1 className="header me-2">Auction</h1>
      <div className="text-xs text-gray-500">{auctionId}</div>
    </div>
  );
}
