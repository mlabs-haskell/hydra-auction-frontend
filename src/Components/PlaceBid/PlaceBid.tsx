import React, { useRef } from 'react';
import {
  PlaceBidFormT,
  placeBidFormSchema,
} from 'src/schemas/placeBidFormSchema';

import { NumberInput } from '../Inputs/NumberInput';
import { usePlaceBid } from '../../hooks/api/bidding';

export const PlaceBidForm = ({
  auctionCs,
  sellerSignature,
  standingBid,
}: {
  auctionCs: string;
  sellerSignature: string;
  standingBid: string;
}) => {
  const placeBid = usePlaceBid(auctionCs, sellerSignature);

  const placeBidFormData = useRef<PlaceBidFormT>({
    bidAmount: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ placeBidFormData });
    const placeBidForm = placeBidFormSchema
      .refine((data) => data.bidAmount > Number(standingBid), {
        message: 'Bid must be higher than the current bid',
      })
      .safeParse(placeBidFormData.current);
    if (!placeBidForm.success) {
      // TODO: Show error to client
      console.log(placeBidForm.error);
    } else {
      placeBid.mutate(String(placeBidForm.data.bidAmount));
    }
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
      <input type="submit" className="submit-btn"></input>
    </form>
  );
};
