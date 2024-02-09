import React, { useRef } from 'react';
import { NumberInput } from '../Inputs/NumberInput';
import { DateTimeInput } from '../Inputs/DateInput';
import { DropDown } from '../DropDown/DropDown';
import { AuctionTermsInput, WalletApp } from 'hydra-auction-offchain';
import { generateMockAnnounceAuctionParams } from 'src/mocks/announceAuction.mock';
import { getUrlParams } from 'src/utils/getUrlParams';
import { useExtendedAssets } from 'src/hooks/api/assets';
import { useAnnounceAuction } from 'src/hooks/api/announceAuction';
import { useWallet } from '@meshsdk/react';
import { useDelegates } from 'src/hooks/api/delegates';
import { auctionTermsInputSchema } from 'src/schemas/auctionTermsSchema';
import { removePolicyIdFromAssetUnit } from 'src/utils/formatting';
import { toast } from 'react-toastify';

type CreateAuctionFormProps = {
  className?: string;
};
const CreateAuctionForm = ({ className }: CreateAuctionFormProps) => {
  const { data: delegateGroup } = useDelegates();
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');

  const mockAnnounceAuctionParams = generateMockAnnounceAuctionParams();
  const auctionFormData = useRef<AuctionTermsInput>(
    mockAnnounceAuctionParams.auctionTerms
  );

  const { name: walletApp } = useWallet();
  const { data: assets, isError } = useExtendedAssets(walletApp as WalletApp);
  const announceAuction = useAnnounceAuction(walletApp);
  if (isError) {
    return null;
  }
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);
  if (!assetToList) {
    console.log('No asset found for this asset unit');
    toast.error('No asset found for this asset unit');

    return null;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ assetName: assetToList.assetName });

    const auctionFormValidated = auctionTermsInputSchema
      .refine((data) => data.biddingEnd > data.biddingStart, {
        message: 'Bidding end must be after bidding start',
      })
      .refine((data) => data.purchaseDeadline > data.biddingEnd, {
        message: 'Purchase deadline must be after bidding end',
      })
      .refine((data) => data.cleanup > data.purchaseDeadline, {
        message: 'Cleanup must be after purchase deadline',
      })
      .refine((data) => Number(data.minBidIncrement) > 0, {
        message: 'New bids must be larger than the standing bid',
      })
      .refine((data) => Number(data.auctionFeePerDelegate) > 2000000, {
        message:
          'The auction fee for each delegate must contain the min 2 ADA for the utxos that will be sent to the delegates during fee distribution',
      })
      .refine(
        (data) =>
          Number(data.startingBid) >
          Number(data.auctionFeePerDelegate) * data.delegates.length,
        {
          message: 'Starting bid must be greater than the total auction fees',
        }
      )
      .refine((data) => data.delegates.length > 0, {
        message: 'Must have at least one delegate',
      })
      .safeParse(auctionFormData.current);

    if (!auctionFormValidated.success) {
      toast.error(
        `Error creating auction: ${auctionFormValidated.error.issues[0].message}`
      );
      console.log(auctionFormValidated.error);
    } else {
      // Using nft from the url to announce the auction
      const auctionLot = {
        cs: assetToList.policyId,
        tn: removePolicyIdFromAssetUnit(assetToList.unit),
        quantity: assetToList.quantity,
      };
      const params = {
        auctionTerms: {
          ...auctionFormValidated.data,
          auctionLot: [auctionLot],
        },
        additionalAuctionLotOrefs:
          mockAnnounceAuctionParams.additionalAuctionLotOrefs, // Empty array for now but can be implemented
      };
      console.log({ announceAuctionParams: params });
      announceAuction.mutate(params);
    }
  };

  const handleAuctionInputChange = (inputId: string, value: any) => {
    auctionFormData.current = {
      ...auctionFormData.current,
      [inputId]: value,
    };
  };

  // To allow for multiple auction lots once it is supported
  // const handleAuctionLotsChange = (auctionLots: ValueEntry[]) => {
  //   auctionFormData.current = {
  //     ...auctionFormData.current,
  //     auctionTerms: {
  //       ...auctionFormData.current.auctionTerms,
  //       auctionLot: auctionLots,
  //     },
  //   };
  // };

  return (
    <div className="p-0 lg:p-3 mb-3 w-full">
      <form className="block" onSubmit={handleSubmit}>
        {/* <AuctionLotList onChangeAuctionLotList={handleAuctionLotsChange} /> */}
        <div className="text-callout mb-1 text-gray-700">Delegates</div>
        <DropDown
          options={delegateGroup?.delegates.map((delegate) => {
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
          placeholder={auctionFormData.current.auctionFeePerDelegate}
        />
        <div className="flex gap-4 my-8 flex-wrap">
          <DateTimeInput
            label="Bidding Start"
            inputId="biddingStart"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.biddingStart}
          />
          <DateTimeInput
            label="Bidding End"
            inputId="biddingEnd"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.biddingEnd}
          />
          <DateTimeInput
            label="Purchase Deadline"
            inputId="purchaseDeadline"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.purchaseDeadline}
          />
          <DateTimeInput
            label="Cleanup"
            inputId="cleanup"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.cleanup}
          />
        </div>

        <div className="flex flex-col gap-4">
          <NumberInput
            label="Starting Bid"
            inputId="startingBid"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.startingBid}
          />
          <NumberInput
            label="Min Bid Increment"
            inputId="minBidIncrement"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.minBidIncrement}
          />
          <NumberInput
            label="Min Deposit Amount"
            inputId="minDepositAmount"
            onChange={handleAuctionInputChange}
            placeholder={auctionFormData.current.minDepositAmount}
          />
        </div>

        <input type="submit" className="mt-8 submit-btn"></input>
      </form>
    </div>
  );
};
export default CreateAuctionForm;
