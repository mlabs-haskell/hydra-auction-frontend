import {
  AuctionInfo,
  VerificationKey,
  WalletApp,
} from 'hydra-auction-offchain';

import { useState } from 'react';
import { useAuthorizeBidders, useDiscoverBidders } from 'src/hooks/api/bidding';

// import { Button } from '@/components/ui/button';
import { DropdownMenuCheckboxItem } from '../shadcn/DropdownMenu';
import { Button } from '../shadcn/Button';
import { DropdownCheckbox } from '../DropdownCheckbox/DropdownCheckbox';

type DiscoverBidderProps = {
  walletApp: WalletApp;
  auctionInfo: AuctionInfo;
};

// TODO: should be a checkbox dropdown, to select all bidders, then a submit button to authorize
export const DiscoverBidders = ({
  walletApp,
  auctionInfo,
}: DiscoverBidderProps) => {
  const { data: bidders } = useDiscoverBidders(walletApp, auctionInfo);
  const authorizeBidders = useAuthorizeBidders(walletApp);
  const [selectedBidders, setSelectedBidders] = useState<VerificationKey[]>([]);

  const handleAuthorize = () => {
    const authorizeBiddersMutateResponse = authorizeBidders.mutate({
      auctionCs: auctionInfo.auctionTerms.auctionLot[0].cs,
      biddersToAuthorize: selectedBidders,
    });
    console.log({ authorizeBiddersMutateResponse });
  };

  const handleSelectBidder = (bidderVk: VerificationKey) => {
    setSelectedBidders((prev) => {
      if (prev.includes(bidderVk)) {
        return prev.filter((pkh) => pkh !== bidderVk);
      } else {
        return [...prev, bidderVk];
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <DropdownCheckbox label="Select bidders to authorize" subLabel="Bidders">
        {bidders?.map((bidder) => {
          return (
            <DropdownMenuCheckboxItem
              key={`${bidder.bidderVk}_auth_bidder_select`}
              checked={selectedBidders.includes(bidder.bidderVk)}
              onCheckedChange={() => handleSelectBidder(bidder.bidderVk)}
            >
              {bidder.bidderVk}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownCheckbox>
      <Button className="w-full" onClick={handleAuthorize}>
        Authorize
      </Button>
    </div>
  );
};
