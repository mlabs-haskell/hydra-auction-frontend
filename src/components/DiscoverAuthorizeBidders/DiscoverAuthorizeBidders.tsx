import {
  AuctionInfo,
  ContractConfig,
  VerificationKey,
  WalletApp,
} from 'hydra-auction-offchain';

import { useState } from 'react';

import { DropdownMenuCheckboxItem } from '../shadcn/DropdownMenu';
import { Button } from '../shadcn/Button';
import { DropdownCheckbox } from '../DropdownCheckbox/DropdownCheckbox';
import { useDiscoverBidders } from 'src/hooks/api/discoverBidders';
import { useAuthorizeBidders } from 'src/hooks/api/authorizeBidders';

type DiscoverAuthorizeBiddersProps = {
  config: ContractConfig;
  auctionInfo: AuctionInfo;
  disabled?: boolean;
};

// TODO: should be a checkbox dropdown, to select all bidders, then a submit button to authorize
export const DiscoverAuthorizeBidders = ({
  config,
  auctionInfo,
  disabled,
}: DiscoverAuthorizeBiddersProps) => {
  const { data: bidders } = useDiscoverBidders(config, auctionInfo);
  const { mutate: authorizeBidders, isPending: isAuthorizeBiddersPending } =
    useAuthorizeBidders(config, auctionInfo.auctionId);
  const [selectedBidders, setSelectedBidders] = useState<VerificationKey[]>([]);

  // Only list bidders that have a valid deposit amount
  const bidderKeys = bidders
    ?.filter((bidder) => bidder.isValid)
    .map((bidder) => bidder.bidderInfo.bidderVk);
  const uniqueBidders = [...new Set(bidderKeys)];

  const handleAuthorize = () => {
    const authorizeBiddersMutateResponse = authorizeBidders({
      auctionCs: auctionInfo.auctionId,
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
    <>
      <div className={'flex flex-col gap-6 justify-center items-center w-full'}>
        <DropdownCheckbox
          disabled={disabled || isAuthorizeBiddersPending}
          label={
            <div className="flex justify-between items-center w-full">
              <span>Bidders to authorize</span>
              <span className="text-black font-bold">
                {bidders?.length || 0}
              </span>
            </div>
          }
          subLabel="Bidders"
        >
          {uniqueBidders?.map((bidderVk: VerificationKey, index: number) => {
            return (
              <DropdownMenuCheckboxItem
                key={`${bidderVk}_auth_bidder_select_${index}`}
                checked={selectedBidders.includes(bidderVk)}
                onCheckedChange={() => handleSelectBidder(bidderVk)}
              >
                {bidderVk}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownCheckbox>

        <Button
          disabled={isAuthorizeBiddersPending || disabled}
          className={`w-full`}
          onClick={handleAuthorize}
          type="submit"
        >
          Authorize
        </Button>
      </div>
    </>
  );
};
