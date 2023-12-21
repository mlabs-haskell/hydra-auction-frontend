import React, { useRef } from 'react';
import { NumberInput } from '../Inputs/NumberInput';
import { DateTimeInput } from '../Inputs/DateInput';
import { DropDown } from '../DropDown/DropDown';
import { auctionFormSchema } from 'src/schemas/auctionFormSchema';
import { getDelegates } from 'src/fetch/getDelegates';
import {
  AnnounceAuctionContractParams,
  AuctionInfo,
  ContractOutput,
  TransactionHash,
  WalletApp,
} from 'public/dist';
import { MOCK_ANNOUNCE_AUCTION_PARAMS } from 'src/mocks/announceAuction.mock';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
  announceAuction?: (
    walletApp: WalletApp,
    params: AnnounceAuctionContractParams
  ) => Promise<ContractOutput<TransactionHash>>;
}

type CreateAuctionFormProps = {
  className?: string;
};
const CreateAuctionForm = ({ className }: CreateAuctionFormProps) => {
  const delegateGroup = getDelegates();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auctionForm = auctionFormSchema.safeParse(auctionFormData.current);

    if (!auctionForm.success) {
      console.log(auctionForm.error);
    } else {
      console.log('success', auctionForm.data);

      const customWindow = window as CustomWindow;

      const walletApp = 'Nami';
      const params = {
        auctionTerms: auctionForm.data.auctionTerms,
        additionalAuctionLotOrefs:
          MOCK_ANNOUNCE_AUCTION_PARAMS.additionalAuctionLotOrefs,
      };
      console.log({ params });
      // TODO: Replace window function with npm package, and use api function in react query
      if (customWindow?.announceAuction) {
        const announceAuctionResponse = await customWindow.announceAuction(
          walletApp,
          params
        );

        // TODO: Get a passing announceAuctionResponse - look at the inputs for hydra-auction-offchain's announceAuction
        console.log({ announceAuctionResponse });
      }
    }
  };

  const auctionFormData = useRef<AnnounceAuctionContractParams>(
    MOCK_ANNOUNCE_AUCTION_PARAMS
  );

  const handleAuctionInputChange = (inputId: string, value: any) => {
    auctionFormData.current = {
      ...auctionFormData.current,
      auctionTerms: {
        ...auctionFormData.current.auctionTerms,
        [inputId]: value,
      },
    };
  };

  // const handleAuctionLotsChange = (auctionLots: ValueEntry[]) => {
  //   auctionFormData.current = {
  //     ...auctionFormData.current,
  //     auctionTerms: {
  //       ...auctionFormData.current.auctionTerms,
  //       auctionLot: auctionLots,
  //     },
  //   };
  // };

  // TODO: Figure out which fields are actually going to be input vs coming from api
  return (
    <div className="p-0 md:p-3 mb-3 w-full">
      <form className="block" onSubmit={handleSubmit}>
        {/* <AuctionLotList onChangeAuctionLotList={handleAuctionLotsChange} /> */}
        {/* <StringInput
            label="Seller Public Key Hash"
            inputId="sellerPkh"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.sellerPkh}
          />
          <StringInput
            label="Seller Verification Key"
            inputId="sellerVk"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.sellerVk}
          /> */}
        <div className="text-callout mb-1 text-gray-700">Delegates</div>
        <DropDown
          options={delegateGroup.delegates.map((delegate) => {
            return {
              label: delegate,
              accessor: delegate,
            };
          })}
          title="Delegates"
        />
        <NumberInput
          label="Auction Fee Per Delegate"
          inputId="auctionFeePerDelegate"
          onChange={handleAuctionInputChange}
          placeholder={
            auctionFormData.current.auctionTerms.auctionFeePerDelegate
          }
        />
        <div className="flex gap-4 my-8 flex-wrap">
          <DateTimeInput
            label="Bidding Start"
            inputId="biddingStart"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.biddingStart}
          />
          {/* TODO: Add validation on submit to make sure bidding end is after bidding start */}
          <DateTimeInput
            label="Bidding End"
            inputId="biddingEnd"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.biddingEnd}
          />
          {/* TODO: Add validation on submit to make sure purchase deadline is after bidding end */}
          <DateTimeInput
            label="Purchase Deadline"
            inputId="purchaseDeadline"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.purchaseDeadline}
          />
          <DateTimeInput
            label="Cleanup"
            inputId="cleanup"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.cleanup}
          />
        </div>

        <div className="flex flex-col gap-4">
          <NumberInput
            label="Starting Bid"
            inputId="startingBid"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.startingBid}
          />
          <NumberInput
            label="Min Bid Increment"
            inputId="minBidIncrement"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.minBidIncrement}
          />
          <NumberInput
            label="Min Deposit Amount"
            inputId="minDepositAmount"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.auctionTerms.minDepositAmount}
          />
        </div>

        <input type="submit" className="mt-8 submit-btn"></input>
      </form>
    </div>
  );
};
export default CreateAuctionForm;
