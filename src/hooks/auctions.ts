import { useEffect, useState } from 'react';
import { AuctionInfo } from 'public/dist/index';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
}

export type HookResponse = {
  data: AuctionInfo[] | undefined;
  isError?: string;
  isLoading: boolean;
};

export const useActiveAuctions = (): HookResponse => {
  const [data, setData] = useState<AuctionInfo[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const retryFetch = async (
    fn: () => Promise<AuctionInfo[] | undefined>,
    retries: number,
    delayMs: number
  ): Promise<AuctionInfo[] | undefined> => {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        await delay(delayMs);
        return retryFetch(fn, retries - 1, delayMs);
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);

      try {
        const customWindow = window as CustomWindow;
        // Provide a default function if testAuctions is undefined
        const safeTestAuctions =
          customWindow.queryAuctions || (() => Promise.resolve(undefined));

        // Use retryFetch with 3 retries and a delay of 500ms
        const auctions = await retryFetch(safeTestAuctions, 5, 500);

        if (auctions) {
          setData(auctions);
        } else {
          // console.log({ auctions });
          // setError('No auctions found');
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
