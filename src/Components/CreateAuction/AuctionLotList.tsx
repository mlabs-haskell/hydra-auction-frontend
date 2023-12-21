import { ValueEntry } from 'public/dist/types';
import { AuctionLot, MOCK_AUCTION_LOT } from './AuctionLot';
import { useEffect, useState } from 'react';

type AuctionLotListProps = {
  onChangeAuctionLotList?: (auctionLots: ValueEntry[]) => void;
};

export const AuctionLotList = ({
  onChangeAuctionLotList,
}: AuctionLotListProps) => {
  const [auctionLots, setAuctionLots] = useState<ValueEntry[]>([
    MOCK_AUCTION_LOT,
  ]);

  const handleAddAuctionLot = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAuctionLots([...auctionLots, MOCK_AUCTION_LOT]);
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
    <div className="flex mb-3">
      {auctionLots.map((_, index) => (
        <div key={index} className="mr-2">
          <div className="grid grid-cols-2 items-center p-1 mb-2">
            <div className="text-sm text-gray-700">Auction Lot {index + 1}</div>
            <button
              className=" font-bold px-2 text-red-300 hover:text-red-500"
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
        className="text-2xl font-bold text-green-300 hover:text-green-500"
        onClick={handleAddAuctionLot}
      >
        +
      </button>
    </div>
  );
};
