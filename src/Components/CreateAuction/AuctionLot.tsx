import { ValueEntry } from 'hydra-auction-offchain';
import { useEffect, useState } from 'react';
import { StringInput } from '../Inputs/StringInput';
import { NumberInput } from '../Inputs/NumberInput';

export const MOCK_AUCTION_LOT: ValueEntry = {
  cs: 'c0f8644a01a6bf5db02f4afe30d604975e63dd274f1098a1738e561d',
  tn: '4d6f6e614c697361',
  quantity: '1',
};

type AuctionLotProps = {
  onChangeAuctionLot?: (auctionLot: ValueEntry) => void;
};

export const AuctionLot = ({ onChangeAuctionLot }: AuctionLotProps) => {
  const [auctionLot, setAuctionLot] = useState<ValueEntry>(MOCK_AUCTION_LOT);

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
          placeholder={auctionLot.cs}
        />
      </div>
      <div className="mb-2">
        <StringInput
          label="Token Name"
          inputId="tn"
          onChange={handleAuctionLotInputChange}
          placeholder={auctionLot.tn}
        />
      </div>
      <div className="mb-2">
        <NumberInput
          label="Quantity"
          inputId="quantity"
          onChange={handleAuctionLotInputChange}
          placeholder={auctionLot.quantity}
        />
      </div>
    </div>
  );
};
