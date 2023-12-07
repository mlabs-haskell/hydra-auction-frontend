import React, { useRef } from 'react';
import { MOCK_PLACE_BID_PARAMS } from 'src/mocks/placeBid.mock';
import { PlaceBidFormT } from 'src/schemas/placeBidFormSchema';
import { StringInput } from './Inputs/StringInput';
import { NumberInput } from './Inputs/NumberInput';

/*

export const discoverSellerSignature = async (
  auctionCs: CurrencySymbol,
  bidderVk: VerificationKey
): Promise<ContractOutput<ByteArray>> => unimplemented();


export const placeBid = async (
  auctionCs: CurrencySymbol,
  bidAmount: BigInt,
  sellerSignature: ByteArray  - see above for getting sellerSignature
): Promise<ContractOutput<TransactionHash>> => unimplemented();
*/

// TODO: Goes into AuctionDetail.tsx
const PlaceBidForm = () => {
  const placeBidFormData = useRef<PlaceBidFormT>(MOCK_PLACE_BID_PARAMS);
  return (
    <div className="p-3 mb-3 w-full">
      <div className="flex items-center justify-center">
        <div className="border-b border-gray-400 w-32"></div>
      </div>
      <form className="block">
        <StringInput
          label="Auction Currency Symbol"
          inputId="auctionCs"
          placeholder={placeBidFormData.current.auctionCs}
          onChange={(value) =>
            (placeBidFormData.current = {
              ...placeBidFormData.current,
              auctionCs: value,
            })
          }
        />
        <NumberInput
          label="Bid Amount"
          inputId="bidAmount"
          placeholder={placeBidFormData.current.bidAmount || ''}
          onChange={(value) =>
            (placeBidFormData.current = {
              ...placeBidFormData.current,
              bidAmount: value,
            })
          }
        />
        <input type="submit" className="submit-btn"></input>
      </form>
    </div>
  );
};

function PlaceBid() {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-[600px]">
        <h1 className="header text-center">Place Bid</h1>
        <PlaceBidForm />
      </div>
    </div>
  );
}

export default PlaceBid;
