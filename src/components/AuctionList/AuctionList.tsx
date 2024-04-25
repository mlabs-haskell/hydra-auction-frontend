import { useQueryClient } from '@tanstack/react-query';
import { useActiveAuctions } from '../../hooks/api/auctions';
import AuctionCard from '../AuctionCard/AuctionCard';
import { useWallet } from '@meshsdk/react';
import { AuctionInfo, WalletApp } from 'hydra-auction-offchain';

import { useEffect, useState } from 'react';
import {
  METADATA_QUERY_KEY,
  getAndStoreAssetMetadata,
} from 'src/hooks/api/assets';
import { getLocalStorageItem } from 'src/utils/localStorage';
import { getAuctionAssetUnit } from 'src/utils/auction';
import { useWalletAddress } from 'src/hooks/api/user';
import {
  AuctionListSortState,
  auctionListFilterOptions,
} from 'src/utils/auctionState';
import { DropDown } from '../DropDown/DropDown';
import { getConfig } from 'src/utils/config';

export default function AuctionList() {
  const { name: walletName, wallet, connected } = useWallet();
  const { data: walletAddress } = useWalletAddress(wallet, connected);
  const walletApp: WalletApp = walletName as WalletApp;
  const config = getConfig('network', walletApp);
  const { data: auctions } = useActiveAuctions(config, undefined, false);

  const queryClient = useQueryClient();

  const localMetadata = getLocalStorageItem('metadata');

  console.log({ walletApp });
  console.log({ auctions });
  console.log({ localMetadata });

  const [auctionsWithImage, setAuctionsWithImage] = useState<
    AuctionInfo[] | null
  >([]);

  const [filteredAuctions, setFilteredAuctions] = useState<
    AuctionInfo[] | undefined
  >([]);

  const [activeFilter, setActiveFilter] = useState<AuctionListSortState>(
    AuctionListSortState.ALL
  );

  const fetchAndFilterAuctionsByImage = async (auctions: AuctionInfo[]) => {
    const filteredAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const assetUnit = getAuctionAssetUnit(auction);

        await queryClient.prefetchQuery({
          queryKey: [METADATA_QUERY_KEY, assetUnit],
          queryFn: async () => await getAndStoreAssetMetadata(assetUnit),
        });

        const nftHasImage: any = queryClient.getQueryData([
          METADATA_QUERY_KEY,
          assetUnit,
        ]);

        return nftHasImage?.image !== undefined ? auction : null;
      })
    );

    // Auto sorted to most recently started auctions
    return filteredAuctions
      .filter(Boolean)
      ?.sort(
        (a: AuctionInfo | null, b: AuctionInfo | null) =>
          Number(b?.auctionTerms.biddingStart) -
          Number(a?.auctionTerms.biddingStart)
      );
  };

  useEffect(() => {
    async function getAuctionsWithImage(auctions: AuctionInfo[]) {
      const filteredAuctionsByImage = await fetchAndFilterAuctionsByImage(
        auctions
      );
      setAuctionsWithImage(filteredAuctionsByImage as AuctionInfo[]);
    }
    if (auctions) {
      getAuctionsWithImage(auctions);
    }
  }, [auctions]);

  useEffect(() => {
    if (auctionsWithImage) {
      switch (activeFilter) {
        case AuctionListSortState.ALL:
          setFilteredAuctions(auctionsWithImage);
          break;
        case AuctionListSortState.SELLER:
          setFilteredAuctions(
            auctionsWithImage?.filter(
              (auction) => auction.auctionTerms.sellerAddress === walletAddress
            )
          );
          break;
        case AuctionListSortState.NOT_SELLER:
          setFilteredAuctions(
            auctionsWithImage?.filter(
              (auction) => auction.auctionTerms.sellerAddress !== walletAddress
            )
          );
          break;
        default:
          setFilteredAuctions(auctionsWithImage);
      }
    }
  }, [activeFilter, auctions, auctionsWithImage]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-title1 text-center mb-3">Query Auctions</h1>
        <hr className="border-b border-gray-400 w-32 mb-4" />
      </div>
      <div>
        <div className="flex items-center gap-2 justify-between p-2 font-semibold">
          <div>{filteredAuctions?.length || 0} Auctions</div>
          <DropDown
            onChange={(index) => {
              setActiveFilter(auctionListFilterOptions[index].accessor);
            }}
            options={auctionListFilterOptions}
            title="Filter Auctions"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {filteredAuctions?.map((auctionInfo, index) => (
            <AuctionCard
              key={`${auctionInfo.auctionId}_${index}`}
              auctionInfo={auctionInfo}
            />
          ))}
        </div>
      </div>
    </>
  );
}
