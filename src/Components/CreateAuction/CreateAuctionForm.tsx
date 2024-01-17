import React, { useRef } from 'react';
import { NumberInput } from '../Inputs/NumberInput';
import { DateTimeInput } from '../Inputs/DateInput';
import { DropDown } from '../DropDown/DropDown';
import { auctionFormSchema } from 'src/schemas/auctionFormSchema';

import {
  AnnounceAuctionContractParams,
  WalletApp,
} from 'hydra-auction-offchain';

import { MOCK_ANNOUNCE_AUCTION_PARAMS } from 'src/mocks/announceAuction.mock';
import { getUrlParams } from 'src/utils/getUrlParams';
import { useExtendedAssets } from 'src/hooks/assets';
import { utf8ToHex } from 'src/utils/hex';
import { useAnnounceAuction } from 'src/hooks/announceAuction';
import { useWallet } from '@meshsdk/react';
import { useNavigate } from 'react-router-dom';
import { useDelegates } from 'src/hooks/delegates';

type CreateAuctionFormProps = {
  className?: string;
};
const CreateAuctionForm = ({ className }: CreateAuctionFormProps) => {
  const navigate = useNavigate();
  const { data: delegateGroup } = useDelegates();
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');

  const auctionFormData = useRef<AnnounceAuctionContractParams>(
    MOCK_ANNOUNCE_AUCTION_PARAMS
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
    return null;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auctionForm = auctionFormSchema
      .refine(
        (data) => data.auctionTerms.biddingEnd > data.auctionTerms.biddingStart,
        { message: 'Bidding end must be after bidding start' }
      )
      .refine(
        (data) =>
          data.auctionTerms.purchaseDeadline > data.auctionTerms.biddingEnd,
        { message: 'Purchase deadline must be after bidding end' }
      )
      .refine(
        (data) =>
          data.auctionTerms.cleanup > data.auctionTerms.purchaseDeadline,
        { message: 'Cleanup must be after purchase deadline' }
      )
      .refine((data) => Number(data.auctionTerms.minBidIncrement) > 0, {
        message: 'New bids must be larger than the standing bid',
      })
      .refine(
        (data) => Number(data.auctionTerms.auctionFeePerDelegate) > 2000000,
        {
          message:
            'The auction fee for each delegate must contain the min 2 ADA for the utxos that will be sent to the delegates during fee distribution',
        }
      )
      // totalAuctionFees :: AuctionTerms -> Integer
      // totalAuctionFees AuctionTerms {..} =
      // at'AuctionFeePerDelegate * length at'Delegates
      .refine(
        (data) =>
          Number(data.auctionTerms.startingBid) >
          Number(data.auctionTerms.auctionFeePerDelegate) *
            data.auctionTerms.delegates.length,
        {
          message: 'Starting bid must be greater than the total auction fees',
        }
      )
      .refine((data) => data.auctionTerms.delegates.length > 0, {
        message: 'Must have at least one delegate',
      })
      .safeParse(auctionFormData.current);

    if (!auctionForm.success) {
      console.log(auctionForm.error);
    } else {
      const auctionLot = {
        cs: assetToList.policyId,
        tn: utf8ToHex(assetToList.assetName),
        quantity: assetToList.quantity,
      };

      const params = {
        auctionTerms: {
          ...auctionForm.data.auctionTerms,
          auctionLot: [auctionLot],
        },
        additionalAuctionLotOrefs:
          MOCK_ANNOUNCE_AUCTION_PARAMS.additionalAuctionLotOrefs, // TODO: why do we pass this in instead of a form value (or a [] if no additional NFTs are included)
      };
      console.log({ announceAuctionParams: params });

      const announceAuctionResponse = announceAuction.mutate(params);
      console.log({ announceAuctionResponse });
      navigate('/auction-list');
    }
  };

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
    <div className="p-0 lg:p-3 mb-3 w-full">
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
