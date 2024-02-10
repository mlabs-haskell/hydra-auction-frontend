import React, { useRef } from 'react';
import {
  PlaceBidFormT,
  placeBidFormSchema,
} from 'src/schemas/placeBidFormSchema';

import { NumberInput } from '../Inputs/NumberInput';
import { usePlaceBid } from '../../hooks/api/bidding';
import { AuctionInfo } from 'hydra-auction-offchain';
import { WalletApp } from 'hydra-auction-offchain';

type PlaceBidFormProps = {
  auctionInfo: AuctionInfo;
  sellerSignature: string;
  standingBid: string;
  walletApp: WalletApp;
};

export const PlaceBidForm = ({
  auctionInfo,
  sellerSignature,
  standingBid,
  walletApp,
}: PlaceBidFormProps) => {
  console.log({ sellerSignature });
  const { mutate: placeBidMutation, isPending: isPlaceBidPending } =
    usePlaceBid(auctionInfo, sellerSignature, walletApp);

  const placeBidFormData = useRef<PlaceBidFormT>({
    bidAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // To uncomment once we can use standing bid to safe check the input
    // console.log({ placeBidFormData });
    // const placeBidForm = placeBidFormSchema
    //   .refine((data) => data.bidAmount > Number(standingBid), {
    //     message: 'Bid must be higher than the current bid',
    //   })
    //   .safeParse(placeBidFormData.current);

    // if (!placeBidForm.success) {
    //   // TODO: Show error to client
    //   console.log(placeBidForm.error);
    // } else {
    //   console.log('MUTATING PLACE BID');
    //   placeBid.mutate(String(placeBidForm.data.bidAmount));
    // }

    const placeBidResponse = placeBidMutation(
      String(placeBidFormData.current.bidAmount)
    );
    console.log({ placeBidResponse });
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <NumberInput
        label="Bid Amount"
        inputId="bidAmount"
        placeholder={String(placeBidFormData.current.bidAmount) || ''}
        onChange={(_, value) => {
          return (placeBidFormData.current = {
            ...placeBidFormData.current,
            bidAmount: Number(value),
          });
        }}
      />
      <input
        disabled={isPlaceBidPending}
        type="submit"
        className="submit-btn"
      ></input>
    </form>
  );
};
