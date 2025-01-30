import React, { useCallback, useEffect, useState } from 'react';
import { NumberInput } from '../Inputs/NumberInput';
import { DateTimeInput } from '../Inputs/DateInput';
import { DropDown } from '../DropDown/DropDown';
import { AuctionTermsInput, DelegateInfo, WalletApp } from 'hydra-auction-offchain';
import { generateMockAnnounceAuctionParams } from 'src/mocks/announceAuction.mock';
import { getUrlParams } from 'src/utils/getUrlParams';
import { useExtendedAssets } from 'src/hooks/api/assets';
import { useAnnounceAuction } from 'src/hooks/api/announceAuction';
import { useWallet } from '@meshsdk/react';
import { useGetDelegates } from 'src/hooks/api/delegates';
import { auctionTermsInputSchema } from 'src/schemas/auctionTermsSchema';
import { removePolicyIdFromAssetUnit } from 'src/utils/formatting';
import { toast } from 'react-toastify';
import { ONE_DAY_MS, formatDate } from 'src/utils/date';
import { getConfig } from 'src/utils/config';
import { useWalletAddress } from 'src/hooks/api/user';
import { adaToLovelace, lovelaceToAda } from 'src/utils/currency';
import { BrowserWallet } from '@meshsdk/core';

const CreateAuctionForm = () => {
  const urlParams = getUrlParams();
  const assetUnit = urlParams.get('assetUnit');

  const mockAnnounceAuctionParams = generateMockAnnounceAuctionParams();
  const { name: walletName, wallet, connected } = useWallet();
  const config = getConfig('network', walletName as WalletApp);
  const { data: delegateGroups } = useGetDelegates(config);

  const [auctionFormData, setAuctionFormData] = useState<AuctionTermsInput & DelegateInfo>({
    ...mockAnnounceAuctionParams.auctionTerms,
    httpServers: delegateGroups ? delegateGroups[0]?.delegateGroupServers.httpServers : [],
    wsServers: delegateGroups ? delegateGroups[0]?.delegateGroupServers.wsServers : [],
  });


  const { data: address } = useWalletAddress(wallet as BrowserWallet, connected);

  const { data: assets, isError } = useExtendedAssets(walletName as WalletApp);
  const { mutate: announceAuction, isPending: isAnnounceAuctionPending } =
    useAnnounceAuction(config, address || '');

  const handleAuctionInputChange = useCallback((inputId: string, value: any) => {
    setAuctionFormData({
      ...auctionFormData,
      [inputId]: String(value),
    });
  }, [auctionFormData]);

  // Auto set the cleanup to two days after purchase deadline every time purchase deadline is set
  useEffect(() => {
    if (auctionFormData.purchaseDeadline) {
      handleAuctionInputChange(
        'cleanup',
        String(Number(auctionFormData.purchaseDeadline) + ONE_DAY_MS * 2)
      );
    }
  }, [handleAuctionInputChange, auctionFormData.purchaseDeadline]);

  if (isError) {
    return null;
  }
  const assetToList = assets?.find((asset) => asset.unit === assetUnit);
  if (!assetToList) {
    console.log('No asset found for this asset unit');
    toast.error('No asset found for this asset unit');

    return null;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auctionFormValidated = auctionTermsInputSchema
      .refine((data) => data.biddingEnd > data.biddingStart, {
        message: 'Bidding end must be after bidding start',
      })
      .refine((data) => data.purchaseDeadline > data.biddingEnd, {
        message: 'Purchase deadline must be after bidding end',
      })
      .refine((data) => data.cleanup > data.purchaseDeadline, {
        message: 'Cleanup must be after purchase deadline',
      })
      .refine((data) => Number(data.minBidIncrement) > 0, {
        message: 'New bids must be larger than the standing bid',
      })
      .refine((data) => Number(data.auctionFeePerDelegate) > 2000000, {
        message:
          'The auction fee for each delegate must contain the min 2 ADA for the utxos that will be sent to the delegates during fee distribution',
      })
      .refine(
        (data) =>
          Number(data.startingBid) >
          Number(data.auctionFeePerDelegate) * data.delegates.length,
        {
          message: 'Starting bid must be greater than the total auction fees',
        }
      )
      .refine((data) => data.delegates.length > 0, {
        message: 'Must have at least one delegate',
      })
      .safeParse(auctionFormData);

    if (!auctionFormValidated.success) {
      toast.error(
        `Error creating auction: ${auctionFormValidated.error.issues[0].message}`
      );
      console.log(auctionFormValidated.error);
    } else {
      // Using nft from the url to announce the auction
      const auctionLot = {
        cs: assetToList.policyId,
        tn: removePolicyIdFromAssetUnit(assetToList.unit),
        quantity: assetToList.quantity,
      };

      const params = {
        auctionTerms: {
          ...auctionFormValidated.data,
          auctionLot: [auctionLot],
          biddingStart:
            Number(auctionFormValidated.data.biddingStart) < Date.now() + 10000
              ? (Date.now() + 30000).toString()
              : auctionFormValidated.data.biddingStart,
        },
        additionalAuctionLotOrefs:
          mockAnnounceAuctionParams.additionalAuctionLotOrefs, // Empty array for now but can be implemented later
        delegateInfo: { wsServers: auctionFormData.wsServers, httpServers: auctionFormData.httpServers},
      };
      console.log({ announceAuctionParams: params });
      announceAuction(params);
      console.log('ANNOUNCE AUCTION MUTATION CALLED');
    }
  };

  // To allow for multiple auction lots once it is supported
  // const handleAuctionLotsChange = (auctionLots: ValueEntry[]) => {
  //   auctionFormData.current = {
  //     ...auctionFormData.current,
  //     auctionTerms: {
  //       ...auctionFormData.current.auctionTerms,
  //       auctionLot: auctionLots,
  //     },
  //   };
  // };

  return (
    <div className="p-0 lg:p-3 mb-3 w-full">
      <form className="block" onSubmit={handleSubmit}>
        {/* <AuctionLotList onChangeAuctionLotList={handleAuctionLotsChange} /> */}
        <div className="text-callout mb-1 text-gray-700">Delegates</div>
        <DropDown
          options={(delegateGroups || []).map((group) => {
            return {
              label: `${group.delegateGroupMetadata} (${group.delegateGroupId})`,
              accessor: group.delegateGroupId,
            };
          })}
          onChange={(index) => {
            handleAuctionInputChange('delegates', delegateGroups ? delegateGroups[index]?.delegateGroupMasterKeys : []);
          }}
          title="Delegates"
        />
        <NumberInput
          label="Auction Fee Per Delegate"
          inputId="auctionFeePerDelegate"
          onChange={(inputId, val) =>
            handleAuctionInputChange(inputId, adaToLovelace(val))
          }
          placeholder={String(
            lovelaceToAda(auctionFormData.auctionFeePerDelegate)
          )}
        />
        <div className="flex gap-4 my-8 flex-wrap">
          <DateTimeInput
            label="Bidding Start"
            inputId="biddingStart"
            onChange={handleAuctionInputChange}
            inputValue={
              auctionFormData.biddingStart
                ? formatDate(new Date(Number(auctionFormData.biddingStart)))
                : formatDate(new Date())
            }
          />
          <DateTimeInput
            label="Bidding End"
            inputId="biddingEnd"
            onChange={handleAuctionInputChange}
          />
          <DateTimeInput
            label="Purchase Deadline"
            inputId="purchaseDeadline"
            onChange={handleAuctionInputChange}
          />
          <DateTimeInput
            label="Cleanup"
            inputId="cleanup"
            onChange={handleAuctionInputChange}
            inputValue={
              auctionFormData.cleanup
                ? formatDate(new Date(Number(auctionFormData.cleanup)))
                : ''
            }
          />
        </div>

        <div className="flex flex-col gap-4">
          <NumberInput
            label="Starting Bid"
            inputId="startingBid"
            onChange={(inputId, val) =>
              handleAuctionInputChange(inputId, adaToLovelace(val))
            }
            placeholder={String(lovelaceToAda(auctionFormData.startingBid))}
          />
          <NumberInput
            label="Min Bid Increment"
            inputId="minBidIncrement"
            onChange={(inputId, val) =>
              handleAuctionInputChange(inputId, adaToLovelace(val))
            }
            placeholder={String(lovelaceToAda(auctionFormData.minBidIncrement))}
          />
          <NumberInput
            label="Min Deposit Amount"
            inputId="minDepositAmount"
            onChange={(inputId, val) =>
              handleAuctionInputChange(inputId, adaToLovelace(val))
            }
            placeholder={String(
              lovelaceToAda(auctionFormData.minDepositAmount)
            )}
          />
        </div>

        <input
          disabled={isAnnounceAuctionPending}
          type="submit"
          className={`mt-8 submit-btn disabled:border-none disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none`}
        ></input>
      </form>
    </div>
  );
};
export default CreateAuctionForm;
