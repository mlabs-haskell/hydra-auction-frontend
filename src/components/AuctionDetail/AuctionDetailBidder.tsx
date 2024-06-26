import {
  AuctionInfo,
  ContractConfig,
  ContractOutput,
} from 'hydra-auction-offchain';
import EnterAuction from '../EnterAuction/EnterAuction';
import BiddingView from './BiddingView';
import { BidderClaims } from './BidderClaims';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';
import { useDiscoverSellerSignature } from 'src/hooks/api/discoverSellerSignature';

function getValidatedSellerSignature(
  sellerSignature: ContractOutput<string | null> | undefined
): string | null {
  const sellerSignatureValidated =
    contractOutputResultSchema.safeParse(sellerSignature);
  if (sellerSignatureValidated.success) {
    return sellerSignatureValidated.data.value ?? '';
  }
  return null;
}
type AuctionDetailBidderProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
  walletAddress: string;
};

export default function AuctionDetailBidder({
  config,
  auctionInfo,
  walletAddress,
}: AuctionDetailBidderProps) {
  const { data: sellerSignature } = useDiscoverSellerSignature(
    config,
    walletAddress,
    {
      auctionCs: auctionInfo.auctionId,
      sellerAddress: auctionInfo.auctionTerms.sellerAddress,
    }
  );
  // sellerSignature returns a valid value only if we are an authorized bidder on the auction
  const validatedSellerSignature = getValidatedSellerSignature(sellerSignature);

  return (
    <div className="w-full flex flex-col items-center gap-12">
      <div className="text-title3 text-center mb-3">Bidder Options</div>
      {validatedSellerSignature ? (
        <BiddingView
          config={config}
          auctionInfo={auctionInfo}
          sellerSignature={validatedSellerSignature}
        />
      ) : (
        <EnterAuction auction={auctionInfo} />
      )}
      <BidderClaims auctionInfo={auctionInfo} />
    </div>
  );
}
