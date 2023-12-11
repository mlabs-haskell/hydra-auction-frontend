import {
  AnnounceAuctionContractParams,
  AuctionInfo,
  ContractOutput,
  TransactionHash,
  ValueEntry,
  WalletApp,
} from 'public/dist/types';
import { useRef } from 'react';
import { MOCK_ANNOUNCE_AUCTION_PARAMS } from 'src/mocks/announceAuction.mock';
import { auctionFormSchema } from 'src/schemas/auctionFormSchema';
import { StringInput } from '../Inputs/StringInput';
import { NumberInput } from '../Inputs/NumberInput';
import { DateInput } from '../Inputs/DateInput';
import { AuctionLotList } from './AuctionLotList';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
  announceAuction?: (
    walletApp: WalletApp,
    params: AnnounceAuctionContractParams
  ) => Promise<ContractOutput<TransactionHash>>;
}

type AnnounceAuctionFormProps = {
  className?: string;
};

const AnnounceAuctionForm = ({ className }: AnnounceAuctionFormProps) => {
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

      // TODO: remove and replace with actual api functions
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

export default function AnnounceAuction() {
  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <h1 className="header text-center mb-3">Announce Auction</h1>
        <div className="flex items-center justify-center">
          <div className="border-b border-gray-400 w-32"></div>
        </div>
        <AnnounceAuctionForm />
      </div>
    </div>
  );
}
