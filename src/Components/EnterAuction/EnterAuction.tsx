import React, { useRef } from 'react';
import { MOCK_ENTER_AUCTION_PARAMS } from 'src/mocks/enterAuction.mock';
import {
  EnterAuctionT,
  enterAuctionFormSchema,
} from 'src/schemas/enterAuctionFormSchema';
import { StringInput } from '../Inputs/StringInput';
import { NumberInput } from '../Inputs/NumberInput';

/*
export const enterAuction = async (
  walletApp: WalletApp,
  auctionCs: CurrencySymbol,
  bidderVk: VerificationKey,
  depositAmount: BigInt | null
): Promise<ContractOutput<TransactionHash>> => unimplemented();
*/

const EnterAuctionForm = () => {
  const enterAuctionFormData = useRef<EnterAuctionT>(MOCK_ENTER_AUCTION_PARAMS);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auctionForm = enterAuctionFormSchema.safeParse(
      enterAuctionFormData.current
    );

    if (!auctionForm.success) {
      console.log(auctionForm.error);
    } else {
      console.log('success', auctionForm.data);

      // TODO: call api with validated enterAuction data
    }
  };
  return (
    <div className="p-3 mb-3 w-full">
      <div className="flex items-center justify-center">
        <div className="border-b border-gray-400 w-32"></div>
      </div>
      <form className="block" onSubmit={handleSubmit}>
        <StringInput
          label="Wallet App"
          inputId="walletApp"
          placeholder={enterAuctionFormData.current.walletApp}
          onChange={(value) =>
            (enterAuctionFormData.current = {
              ...enterAuctionFormData.current,
              walletApp: value,
            })
          }
        />
        <StringInput
          label="Auction Currency Symbol"
          inputId="auctionCs"
          placeholder={enterAuctionFormData.current.auctionCs}
          onChange={(value) =>
            (enterAuctionFormData.current = {
              ...enterAuctionFormData.current,
              auctionCs: value,
            })
          }
        />
        <StringInput
          label="Bidder Verification Key"
          inputId="bidderVk"
          placeholder={enterAuctionFormData.current.bidderVk}
          onChange={(value) =>
            (enterAuctionFormData.current = {
              ...enterAuctionFormData.current,
              bidderVk: value,
            })
          }
        />
        {/* If `depositAmount` is set to `null`, the minimum deposit will be made. */}
        <NumberInput
          label="Deposit Amount"
          inputId="depositAmount"
          placeholder={enterAuctionFormData.current.depositAmount || ''}
          onChange={(value) =>
            (enterAuctionFormData.current = {
              ...enterAuctionFormData.current,
              depositAmount: value,
            })
          }
        />
        <input type="submit" className="submit-btn"></input>
      </form>
    </div>
  );
};

export default function EnterAuction() {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-[600px]">
        <h1 className="header text-center">Enter Auction</h1>
        <EnterAuctionForm />
      </div>
    </div>
  );
}
