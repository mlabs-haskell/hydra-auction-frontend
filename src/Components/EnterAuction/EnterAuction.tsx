import React, { useRef, useState } from 'react';
import { enterAuctionFormSchema } from 'src/schemas/enterAuctionFormSchema';
import { NumberInput } from '../Inputs/NumberInput';
import {
  AuctionInfo,
  EnterAuctionContractParams,
  WalletApp,
} from 'hydra-auction-offchain';
import { useEnterAuction } from 'src/hooks/enterAuction';
import { useWallet } from '@meshsdk/react';
import Button from '../Button/Button';

// For now we are passing the whole auction, but we will eventually only need the fields required to enter the auction?
type EnterAuctionFormProps = {
  auction: AuctionInfo;
};

// TODO: we should have a button to enter the minimum deposit amount otherwise they can input a custom deposit amount
export const EnterAuctionForm = ({ auction }: EnterAuctionFormProps) => {
  const { name: walletApp } = useWallet();
  const enterAuction = useEnterAuction(walletApp as WalletApp);

  const enterAuctionFormData = useRef<EnterAuctionContractParams>({
    auctionInfo: auction,
    depositAmount: '0',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auctionForm = enterAuctionFormSchema
      .refine(
        (data) => {
          if (data.depositAmount === null) return true;
          return (
            Number(data.depositAmount) >=
            Number(auction.auctionTerms.minDepositAmount)
          );
        },
        {
          message: `Deposit amount must be at least the minimum required desposit of ${auction?.auctionTerms.minDepositAmount} ADA.`,
        }
      )
      .safeParse(enterAuctionFormData.current);

    if (!auctionForm.success) {
      console.log(auctionForm.error);
    } else {
      console.log(auctionForm.data);
      enterAuction.mutate(auctionForm.data as EnterAuctionContractParams);
      // TODO: should show pop up message that tells bidder that the seller will now authorize them and they will be notified
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
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* TODO implement check box for minimum deposit */}
        {/* <input type="checkbox" placeholder="Use Minimum Deposit"></input> */}
        <NumberInput
          label="Deposit Amount"
          inputId="depositAmount"
          placeholder={'300000'}
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
    <div className="w-full">
      <Button onClick={() => setShow(!show)} className="w-full mb-2">
        Enter Auction
      </Button>
      {show && <EnterAuctionForm auction={auction} />}
    </div>
  );
}
