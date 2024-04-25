import React, { useRef } from 'react';
import { PlaceBidFormT } from 'src/schemas/placeBidFormSchema';

import { NumberInput } from '../Inputs/NumberInput';

import {
  AuctionTerms,
  ByteArray,
  ContractConfig,
  CurrencySymbol,
  DelegateInfo,
} from 'hydra-auction-offchain';
import { usePlaceBidL2 } from 'src/hooks/api/placeBidL2';

type PlaceBidL2FormProps = {
  config: ContractConfig;
  auctionCs: CurrencySymbol;
  auctionTerms: AuctionTerms;
  delegateInfo: DelegateInfo | null;
  sellerSignature: ByteArray;
};

export const PlaceBidL2Form = ({
  config,
  auctionCs,
  auctionTerms,
  delegateInfo,
  sellerSignature,
}: PlaceBidL2FormProps) => {
  const { mutate: placeBidL2Mutation, isPending } = usePlaceBidL2(config);

  const placeBidL2FormData = useRef<PlaceBidFormT>({
    bidAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (delegateInfo) {
      const placeBidL2Response = placeBidL2Mutation({
        auctionCs,
        auctionTerms,
        delegateInfo,
        sellerSignature,
        bidAmount: String(placeBidL2FormData.current.bidAmount),
      });
      console.log({ placeBidL2Response });
    }
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <NumberInput
        label="Bid Amount"
        inputId="bidAmount"
        placeholder={String(placeBidL2FormData.current.bidAmount) || ''}
        onChange={(_, value) => {
          return (placeBidL2FormData.current = {
            ...placeBidL2FormData.current,
            bidAmount: Number(value),
          });
        }}
      />
      <input disabled={isPending} type="submit" className="submit-btn"></input>
    </form>
  );
};
