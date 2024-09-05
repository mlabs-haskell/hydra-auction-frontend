import React, { useRef, useState } from 'react';
import { PlaceBidFormT } from 'src/schemas/placeBidFormSchema';

import { NumberInput } from '../Inputs/NumberInput';
import { usePlaceBid } from '../../hooks/api/placeBid';
import { AuctionInfo, ContractConfig } from 'hydra-auction-offchain';
import { useWallet } from '@meshsdk/react';
import { useWalletAddress } from 'src/hooks/api/user';
import { adaToLovelace, lovelaceToAda } from 'src/utils/currency';

type PlaceBidFormProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
  sellerSignature: string;
  standingBid: string;
};

export const PlaceBidForm = ({
  config,
  auctionInfo,
  sellerSignature,
  standingBid,
}: PlaceBidFormProps) => {
  const { wallet, connected } = useWallet();
  const { data: address } = useWalletAddress(wallet, connected);
  const { mutate: placeBidMutation, isPending: isPlaceBidPending } =
    usePlaceBid(config, auctionInfo, sellerSignature, address || '');

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
        placeholder={
          String(lovelaceToAda(placeBidFormData.current.bidAmount)) || ''
        }
        onChange={(_, value) => {
          return (placeBidFormData.current = {
            ...placeBidFormData.current,
            bidAmount: adaToLovelace(value),
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
