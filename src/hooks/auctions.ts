import { useEffect, useState } from 'react';
import {
  AuctionInfo,
  queryAuctions,
  type WalletApp,
} from 'hydra-auction-offchain';
import { useWallet } from '@meshsdk/react';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const QUERY_AUCTIONS_QUERY_KEY = 'query-auctions';
// Make react query hook
export const useActiveAuctions = (): HookResponse => {
  const [data, setData] = useState<AuctionInfo[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { name: walletName } = useWallet();

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);

      try {
        const walletApp: WalletApp = walletName as WalletApp;
        const auctions = await queryAuctions(walletApp);

        if (auctions) {
          setData(auctions);
        } else {
          console.log({ auctions });
          setError('No auctions found');
        }
      } catch (err) {
        setError('Error fetching auctions');
      } finally {
        setLoading(false);
      }
    };
    if (walletName) fetchAuctions();
  }, [walletName]);

  return { data, isError: error, isLoading: loading };
};
