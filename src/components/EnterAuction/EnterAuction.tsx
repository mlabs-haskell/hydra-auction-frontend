import React, { useState } from 'react';
import { enterAuctionFormSchema } from 'src/schemas/enterAuctionFormSchema';
import { NumberInput } from '../Inputs/NumberInput';
import {
  AuctionInfo,
  EnterAuctionContractParams,
  WalletApp,
} from 'hydra-auction-offchain';
import { useEnterAuction } from 'src/hooks/api/enterAuction';
import { useWallet } from '@meshsdk/react';
import { Button } from '../shadcn/Button';
import { useWalletAddress } from 'src/hooks/api/user';
import { getConfig } from 'src/utils/config';
import { adaToLovelace, lovelaceToAda } from 'src/utils/currency';
import { toast } from 'react-toastify';

type EnterAuctionFormProps = {
  auction: AuctionInfo;
};

// TODO: we are setting the default deposit to minimum deposit, they can enter an alternative if they wish
export const EnterAuctionForm = ({ auction }: EnterAuctionFormProps) => {
  const { name: walletApp, wallet, connected } = useWallet();
  const { data: walletAddress } = useWalletAddress(wallet, connected);
  const config = getConfig('network', walletApp as WalletApp);
  const { mutate: enterAuction, isPending: isEnterAuctionPending } =
    useEnterAuction(config);

  const [enterAuctionFormData, setEnterAuctionFormData] =
    useState<EnterAuctionContractParams>({
      auctionInfo: auction,
      depositAmount: auction.auctionTerms.minDepositAmount,
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
      .safeParse(enterAuctionFormData);

    if (!auctionForm.success) {
      toast.error(`Entering auction failed: ${auctionForm.error}`);
      console.log(auctionForm.error);
    } else {
      if (walletAddress) {
        enterAuction({
          enterAuctionParams: auctionForm.data as EnterAuctionContractParams,
          walletAddress,
        });
      }
      // TODO: should show pop up message that tells bidder that the seller will now authorize them and they will be notified
    }
  };

  const handleInputChange = (inputId: string, value: string | number) => {
    setEnterAuctionFormData({
      ...enterAuctionFormData,
      [inputId]: String(value),
    });
  };
  return (
    <div className="p-3 mb-3 w-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <NumberInput
          disabled={isEnterAuctionPending}
          label="Deposit amount"
          inputId="depositAmount"
          placeholder={`Minimum Deposit: ${lovelaceToAda(
            auction.auctionTerms.minDepositAmount
          )} ADA`}
          onChange={(inputId, val) =>
            handleInputChange(inputId, adaToLovelace(val))
          }
          value={lovelaceToAda(enterAuctionFormData.depositAmount || undefined)}
        />
        <input
          disabled={isEnterAuctionPending}
          type="submit"
          className="submit-btn disabled:border-none disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
        ></input>
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
