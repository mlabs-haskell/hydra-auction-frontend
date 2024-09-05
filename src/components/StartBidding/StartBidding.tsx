import { useWallet } from '@meshsdk/react';
import { AuctionDetailSellerProps } from '../AuctionDetail/AuctionDetailSeller';
import { Button } from '../shadcn/Button';
import { useStartBidding } from 'src/hooks/api/startBidding';
import { useEffect, useState } from 'react';

type StartBiddingProps = AuctionDetailSellerProps & {
  disabled?: boolean;
};
export default function StartBidding({
  config,
  auctionInfo,
  disabled,
}: StartBiddingProps) {
  const { wallet } = useWallet();

  const [address, setAddress] = useState('');
  const { mutate: startBidding, isPending: isStartBiddingPending } =
    useStartBidding(config, address);

  const handleStartBidding = () => {
    if (address) {
      startBidding({
        auctionInfo: auctionInfo,
      });
    }
  };

  useEffect(() => {
    if (wallet) {
      const usedWalletAddresses = wallet.getUsedAddresses();
      usedWalletAddresses?.then(
        (addresses) => addresses?.length > 0 && setAddress(addresses[0])
      );
    }
  }, [wallet]);
  return (
    <Button
      disabled={isStartBiddingPending || disabled}
      className="w-full"
      onClick={handleStartBidding}
    >
      Start Bidding
    </Button>
  );
}
