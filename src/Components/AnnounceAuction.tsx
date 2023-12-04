// Announce auction params

import {
  AnnounceAuctionContractParams,
  AuctionInfo,
  ContractOutput,
  TransactionHash,
  ValueEntry,
  WalletApp,
} from 'public/dist/types';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
  announceAuction?: (
    walletApp: WalletApp,
    params: AnnounceAuctionContractParams
  ) => Promise<ContractOutput<TransactionHash>>;
}

const MOCK_AUCTION_PARAMS: AnnounceAuctionContractParams = {
  auctionTerms: {
    auctionLot: [
      {
        cs: 'c0f8644a01a6bf5db02f4afe30d604975e63dd274f1098a1738e561d',
        tn: '4d6f6e614c697361',
        quantity: '1',
      },
    ],
    sellerPkh: '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c',
    sellerVk:
      '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9',
    delegates: ['2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c'],
    biddingStart: '1764241203000',
    biddingEnd: '1764327603000',
    purchaseDeadline: '1764586803000',
    cleanup: '1764673203000',
    auctionFeePerDelegate: '5000000',
    startingBid: '6000000',
    minBidIncrement: '1000000',
    minDepositAmount: '3000000',
  },
  additionalAuctionLotOrefs: [],
};

type StringInputProps = {
  label: string;
  inputId: string;
  onChange?: (inputId: string, value: string) => void;
};
const StringInput = ({ label, inputId, onChange }: StringInputProps) => {
  return (
    <div className="mb-2">
      <div>
        <label htmlFor={inputId}>{label}</label>
      </div>
      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className=""
        type="text"
      />
    </div>
  );
};

type DateInputProps = {
  label: string;
  inputId: string;
  onChange?: (inputId: string, value: string) => void;
};

const DateInput = ({ label, inputId, onChange }: DateInputProps) => {
  return (
    <div className="mb-2">
      <div>
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className=""
        type="date"
      />
    </div>
  );
};

type NumberInputProps = {
  label: string;
  inputId: string;
  onChange?: (inputId: string, value: string) => void;
};

const NumberInput = ({ label, inputId, onChange }: NumberInputProps) => {
  return (
    <div className="mb-2">
      <div>
        <label htmlFor={inputId}>{label}</label>
      </div>

      <input
        onChange={(e) => onChange && onChange(inputId, e.target.value)}
        id={inputId}
        className=""
        type="number"
      />
    </div>
  );
};

type AnnounceAuctionFormProps = {
  className?: string;
};

const EMPTY_AUCTION_LOT: ValueEntry = {
  cs: '',
  tn: '',
  quantity: '',
};

type AuctionLotProps = {
  onChangeAuctionLot?: (auctionLot: ValueEntry) => void;
};

const AuctionLot = ({ onChangeAuctionLot }: AuctionLotProps) => {
  const [auctionLot, setAuctionLot] = useState<ValueEntry>(EMPTY_AUCTION_LOT);

  useEffect(() => {
    onChangeAuctionLot && onChangeAuctionLot(auctionLot);
  }, [auctionLot]);

  const handleAuctionLotInputChange = (inputId: string, value: any) => {
    setAuctionLot({
      ...auctionLot,
      [inputId]: inputId === 'quantity' ? value.toString() : value,
    });
  };

  return (
    <div className="">
      <div className="mb-2">
        <StringInput
          label="Currency Symbol"
          inputId="cs"
          onChange={handleAuctionLotInputChange}
        />
      </div>
      <div className="mb-2">
        <StringInput
          label="Token Name"
          inputId="tn"
          onChange={handleAuctionLotInputChange}
        />
      </div>
      <div className="mb-2">
        <NumberInput
          label="Quantity"
          inputId="quantity"
          onChange={handleAuctionLotInputChange}
        />
      </div>
    </div>
  );
};

type AuctionLotListProps = {
  onChangeAuctionLotList?: (auctionLots: ValueEntry[]) => void;
};

const AuctionLotList = ({ onChangeAuctionLotList }: AuctionLotListProps) => {
  const [auctionLots, setAuctionLots] = useState<ValueEntry[]>([
    EMPTY_AUCTION_LOT,
  ]);

  const handleAddAuctionLot = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuctionLots([...auctionLots, EMPTY_AUCTION_LOT]);
  };

  const handleRemoveAuctionLot = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setAuctionLots(auctionLots.filter((_, i) => i !== index));
  };

  const handleChangeAuctionLot = (index: number, auctionLot: ValueEntry) => {
    setAuctionLots(
      auctionLots.map((lot, i) => (i === index ? auctionLot : lot))
    );
  };

  useEffect(() => {
    onChangeAuctionLotList && onChangeAuctionLotList(auctionLots);
  }, [auctionLots]);

  return (
    <div className="flex">
      {auctionLots.map((_, index) => (
        <div key={index} className=" p-2 me-2">
          <div className="flex justify-between">
            <div className="leading-normal text-sm text-slate-600">
              Lot {index}
            </div>
            <button
              className=" font-bold px-2 text-red-300 "
              onClick={(e) => handleRemoveAuctionLot(e, index)}
            >
              X
            </button>
          </div>
          <AuctionLot
            onChangeAuctionLot={(auctionLot) =>
              handleChangeAuctionLot(index, auctionLot)
            }
          />
        </div>
      ))}
      <button
        className="text-xl font-bold text-green-500"
        onClick={handleAddAuctionLot}
      >
        +
      </button>
    </div>
  );
};
const AnnounceAuctionForm = ({ className }: AnnounceAuctionFormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auctionFormSchema = z.object({
      auctionTerms: z.object({
        auctionLot: z.array(
          z.object({
            cs: z.string(),
            quantity: z.string(),
            tn: z.string(),
          })
        ),
        biddingStart: z.string(),
        biddingEnd: z.string(),
        purchaseDeadline: z.string(),
        cleanup: z.string(),
        auctionFeePerDelegate: z.string(),
        delegates: z.array(z.string()),
        minBidIncrement: z.string(),
        minDepositAmount: z.string(),
        sellerPkh: z.string(),
        sellerVk: z.string(),
        startingBid: z.string(),
      }),
    });

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
          MOCK_AUCTION_PARAMS.additionalAuctionLotOrefs,
      };

      if (customWindow?.announceAuction) {
        const announceAuctionResponse = await customWindow.announceAuction(
          walletApp,
          params
        );
        console.log({ announceAuctionResponse });
      }
    }
  };

  const auctionFormData =
    useRef<AnnounceAuctionContractParams>(MOCK_AUCTION_PARAMS);

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
    <div className="p-3  mb-3 w-full">
      <div>
        <form className="block" onSubmit={handleSubmit}>
          <div className="border-b mb-2">Auction Lot</div>
          <AuctionLotList onChangeAuctionLotList={handleAuctionLotsChange} />

          <StringInput
            label="Seller Public Key Hash"
            inputId="sellerPkh"
            onChange={handleAuctionInputChange}
          />
          <StringInput
            label="Seller Verification Key"
            inputId="sellerVk"
            onChange={handleAuctionInputChange}
          />
          {/* <StringInput label="Delegates" inputId="" /> // */}

          <DateInput
            label="Bidding Start"
            inputId="biddingStart"
            onChange={handleAuctionInputChange}
          />
          <DateInput
            label="Bidding End"
            inputId="biddingEnd"
            onChange={handleAuctionInputChange}
          />
          <DateInput
            label="Purchase Deadline"
            inputId="purchaseDeadline"
            onChange={handleAuctionInputChange}
          />
          <DateInput
            label="Cleanup"
            inputId="cleanup"
            onChange={handleAuctionInputChange}
          />

          <NumberInput
            label="Auction Fee Per Delegate"
            inputId="auctionFeePerDelegate"
            onChange={handleAuctionInputChange}
          />
          <NumberInput
            label="Starting Bid"
            inputId="startingBid"
            onChange={handleAuctionInputChange}
          />
          <NumberInput
            label="Min Bid Increment"
            inputId="minBidIncrement"
            onChange={handleAuctionInputChange}
          />
          <NumberInput
            label="Min Deposit Amount"
            inputId="minDepositAmount"
            onChange={handleAuctionInputChange}
          />

          <input
            type="submit"
            className="mt-3 p-2 border border-gray-400 rounded-md w-40"
          ></input>
        </form>
      </div>
    </div>
  );
};

export default function AnnounceAuction() {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-[600px]">
        <h1 className="header">Announce Auction</h1>
        <AnnounceAuctionForm />
      </div>
    </div>
  );
}
