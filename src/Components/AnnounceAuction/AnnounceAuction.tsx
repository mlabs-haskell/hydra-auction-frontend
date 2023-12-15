import {
  AnnounceAuctionContractParams,
  AuctionInfo,
  ContractOutput,
  TransactionHash,
  ValueEntry,
  WalletApp,
} from 'public/dist/types';
import { useRef, useState } from 'react';
import { MOCK_ANNOUNCE_AUCTION_PARAMS } from 'src/mocks/announceAuction.mock';
import { auctionFormSchema } from 'src/schemas/auctionFormSchema';
import { StringInput } from '../Inputs/StringInput';
import { NumberInput } from '../Inputs/NumberInput';
import { DateInput } from '../Inputs/DateInput';
import { AuctionLotList } from './AuctionLotList';
import WalletNfts from '../WalletNfts/WalletNfts';
import { TimeRemaining } from '../Time/TimeRemaining';
import { getUrlParams } from 'src/utils/getUrlParams';
import AnnounceAuctionTabs from '../AnnounceTabs/AnnounceTabs';
import { useAssets } from '@meshsdk/react';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
  announceAuction?: (
    walletApp: WalletApp,
    params: AnnounceAuctionContractParams
  ) => Promise<ContractOutput<TransactionHash>>;
}

type AnnounceAuctionFormProps = {
  selectedNft: string;
  className?: string;
};

const AnnounceAuctionForm = ({
  selectedNft,
  className,
}: AnnounceAuctionFormProps) => {
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
      console.log(params);
      // TODO: Replace window function with npm package, and use api function in react query
      if (customWindow?.announceAuction) {
        const announceAuctionResponse = await customWindow.announceAuction(
          walletApp,
          params
        );
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

  const handleAuctionLotsChange = (auctionLots: ValueEntry[]) => {
    auctionFormData.current = {
      ...auctionFormData.current,
      auctionTerms: {
        ...auctionFormData.current.auctionTerms,
        auctionLot: auctionLots,
      },
    };
  };

  return (
    <div className="p-3 mb-3 w-full">
      <form className="block" onSubmit={handleSubmit}>
        {selectedNft}
        <AuctionLotList onChangeAuctionLotList={handleAuctionLotsChange} />

        <StringInput
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
        />
        {/* <StringInput label="Delegates" inputId="" /> // */}

        <DateInput
          label="Bidding Start"
          inputId="biddingStart"
          onChange={handleAuctionInputChange}
          placeholder={auctionFormData.current.auctionTerms.biddingStart}
        />
        <DateInput
          label="Bidding End"
          inputId="biddingEnd"
          onChange={handleAuctionInputChange}
          placeholder={auctionFormData.current.auctionTerms.biddingEnd}
        />
        <DateInput
          label="Purchase Deadline"
          inputId="purchaseDeadline"
          onChange={handleAuctionInputChange}
          placeholder={auctionFormData.current.auctionTerms.purchaseDeadline}
        />
        <DateInput
          label="Cleanup"
          inputId="cleanup"
          onChange={handleAuctionInputChange}
          placeholder={auctionFormData.current.auctionTerms.cleanup}
        />

        <NumberInput
          label="Auction Fee Per Delegate"
          inputId="auctionFeePerDelegate"
          onChange={handleAuctionInputChange}
          placeholder={
            auctionFormData.current.auctionTerms.auctionFeePerDelegate
          }
        />
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

        <input type="submit" className="submit-btn"></input>
      </form>
    </div>
  );
};

const CurrentListing = ({
  name,
  price,
  biddingEnd,
}: {
  name: string;
  price: number;
  biddingEnd?: string;
}) => {
  const priceUsd = price;
  return (
    <div className="w-[342px]">
      <div className="mb-4 text-start text-body font-semibold">
        Current Listing:
      </div>
      <img
        className="blur-sm"
        width={342}
        alt=""
        src="/images/sample_nft.png"
      />
      <div className="font-bold">{name}</div>
      <div className="text-end font-bold">{price} ADA</div>
      <div className="text-end text-dim">${priceUsd}</div>
      <div className="flex justify-center items-center">
        <TimeRemaining endDate={Number(biddingEnd) || 0} />
      </div>
    </div>
  );
};

export default function AnnounceAuction() {
  // Use url params to get the assetUnit
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');

  //TODO: which details we need to pass to the tabs
  const assets = useAssets();
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);
  return (
    <div className="flex items-center justify-center">
      <div className="container grid grid-cols-2">
        <div></div>
        <div className="text-title2 font-bold mb-6">List an nft</div>
        <CurrentListing name="My Nft" price={100} />

        <AnnounceAuctionTabs assetToList={assetToList} />
      </div>
    </div>
  );
}
