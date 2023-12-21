import { useEffect, useState } from 'react';
import {
  AuctionInfo,
  queryAuctions,
  type WalletApp,
} from 'hydra-auction-offchain';

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

const WALLET_APP = 'Nami';

export const useActiveAuctions = (): HookResponse => {
  const [data, setData] = useState<AuctionInfo[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);

      try {
        const walletApp: WalletApp = WALLET_APP;
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

    fetchAuctions();
  }, []);

  return { data, isError: error, isLoading: loading };
};
