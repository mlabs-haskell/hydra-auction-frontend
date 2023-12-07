import { useEffect, useState } from 'react';
import { AuctionInfo } from 'public/dist/types';

// import {
//   announceAuction,
//   awaitTxConfirmed,
//   mintTokenUsingAlwaysMints,
//   queryAuctions
// } from "hydra-auction-offchain";
// import type {
//   AnnounceAuctionContractParams,
//   ContractOutput,
//   POSIXTime,
//   TokenName,
//   TransactionHash,
//   WalletApp
// } from "hydra-auction-offchain";

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
}

export type QueryAuctionsResponse = {
  data: AuctionInfo[] | undefined;
  error?: string;
  loading: boolean;
};

export const useQueryAuctions = (): QueryAuctionsResponse => {
  const [data, setData] = useState<AuctionInfo[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const customWindow = window as CustomWindow;
        const auctions = await customWindow.queryAuctions?.();
        if (auctions) {
          setData(auctions);
        } else {
          setError('No auctions found');
        }
      } catch (err) {
        setError('Error fetching auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return { data, error, loading };
};
