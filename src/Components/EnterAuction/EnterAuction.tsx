import React, { useRef, useState } from 'react';
import { MOCK_ENTER_AUCTION_PARAMS } from 'src/mocks/enterAuction.mock';
import {
  EnterAuctionT,
  enterAuctionFormSchema,
} from 'src/schemas/enterAuctionFormSchema';
import { StringInput } from '../Inputs/StringInput';
import { NumberInput } from '../Inputs/NumberInput';
import { useAddBidderAuction, useUser } from 'src/hooks/user';
import { AuctionInfo } from 'public/dist/types';
import { MOCK_QUERY_AUCTIONS_RESPONSE } from 'src/mocks/queryAuctions.mock';

// For now we are passing the whole auction, but we will eventually only need the fields required to enter the auction
type EnterAuctionFormProps = {
  auction?: AuctionInfo;
};

export const EnterAuctionForm = ({ auction }: EnterAuctionFormProps) => {
  // If we are not coming from the auction detail page, we will need an auction to enter
  if (auction === undefined) auction = MOCK_QUERY_AUCTIONS_RESPONSE[0];
  // To add the auction to the user's list of auctions so we can determine if they can alread bid on it
  const addBidderAuction = useAddBidderAuction();
  // We need to get the bidderVk, other details from the user in order to enter the auction
  const userDetails = useUser();

  const enterAuctionFormData = useRef<EnterAuctionT>(MOCK_ENTER_AUCTION_PARAMS);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Safe checking the form data with zod
    const auctionForm = enterAuctionFormSchema
      .refine(
        (data) => {
          if (data.depositAmount === null) return true;
          return (
            Number(data.depositAmount) >
            Number(auction?.auctionTerms.minDepositAmount)
          );
        },
        {
          message:
            'Deposit amount must be greater than the minimum required desposit of ADA.',
        }
      )
      .safeParse(enterAuctionFormData.current);

    if (!auctionForm.success) {
      console.log(auctionForm.error);
    } else {
      console.log('success', auctionForm.data);
      // Storing the auctionCs under user bidder so we can access place bid
      addBidderAuction.mutate(auction as AuctionInfo);
    }
  };

  const handleInputChange = (inputId: string, value: string | number) => {
    enterAuctionFormData.current = {
      ...enterAuctionFormData.current,
      [inputId]: value,
    };
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
          onChange={handleInputChange}
        />
        <StringInput
          label="Auction Currency Symbol"
          inputId="auctionCs"
          placeholder={enterAuctionFormData.current.auctionCs}
          onChange={handleInputChange}
        />
        <StringInput
          label="Bidder Verification Key"
          inputId="bidderVk"
          placeholder={enterAuctionFormData.current.bidderVk}
          onChange={handleInputChange}
        />
        {/* If `depositAmount` is set to `null`, the minimum deposit will be made. */}
        <NumberInput
          label="Deposit Amount"
          inputId="depositAmount"
          placeholder={enterAuctionFormData.current.depositAmount || ''}
          onChange={handleInputChange}
        />
        <input type="submit" className="submit-btn"></input>
      </form>
    </div>
  );
};

export default function EnterAuction({ auction }: EnterAuctionFormProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="w-full p-3 border border-gray-700 rounded-3xl mb-2"
      >
        Enter Auction
      </button>
      {show && <EnterAuctionForm auction={auction} />}
    </div>
  );
}

// For its own card/page
export const EnterAuctionPage = () => {
  return (
    <div className="container flex items-center justify-center">
      <div className="w-[600px]">
        <h1 className="header text-center">Enter Auction</h1>
        <EnterAuctionForm />
      </div>
    </div>
  );
};
