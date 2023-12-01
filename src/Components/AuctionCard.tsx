import React from 'react';

// Define the structure of auction terms
interface AuctionTerms {
  auctionFeePerDelegate: string;
  auctionLot: Array<{
    cs: string;
    quantity: string;
    tn: string;
  }>;
  biddingEnd: string;
  biddingStart: string;
  cleanup: string;
  delegates: string[];
  minBidIncrement: string;
  minDepositAmount: string;
  purchaseDeadline: string;
  sellerPkh: string;
  sellerVk: string;
  startingBid: string;
}

// Define the structure of the auction object
type AuctionCardProps = {
  auctionEscrowAddr: string;
  auctionId: string;
  auctionTerms: AuctionTerms;
  bidderDepositAddr: string;
  feeEscrowAddr: string;
  standingBidAddr: string;
};

export default function AuctionCard({
  auctionEscrowAddr,
  auctionId,
  auctionTerms,
  bidderDepositAddr,
  feeEscrowAddr,
  standingBidAddr,
}: AuctionCardProps) {
  const renderObject = (obj: any): JSX.Element[] => {
    return Object.entries(obj).map(([key, value]) => {
      // Check if the value is an object and recursively render its properties
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key} className="text-left">
            <div className="font-bold">{key}</div>
            <div className="ml-4 text-ellipsis overflow-hidden">
              {renderObject(value)}
            </div>
          </div>
        );
      }

      return (
        <div key={key} className="text-left">
          <div className="font-bold">{key}</div>
          <div className="text-ellipsis overflow-hidden">
            {value?.toString()}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="border p-4 rounded-lg shadow-md hover:bg-slate-200">
      {renderObject({
        auctionEscrowAddr,
        auctionId,
        auctionTerms,
        bidderDepositAddr,
        feeEscrowAddr,
        standingBidAddr,
      })}
    </div>
  );
}
