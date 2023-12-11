import { AuctionInfo } from 'public/dist/types';
import { useQuery } from '@tanstack/react-query';
import { MOCK_QUERY_AUCTIONS_RESPONSE } from 'src/mocks/queryAuctions.mock';
import { useEffect, useState } from 'react';

interface CustomWindow extends Window {
  queryAuctions?: () => Promise<AuctionInfo[] | undefined>;
}

export type QueryAuctionsResponse = {
  data: AuctionInfo[] | undefined;
  error?: string;
  loading: boolean;
};

const AUCTION_LIST_QUERY_KEY = 'auction-list';

export const useQueryAuctions = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: [AUCTION_LIST_QUERY_KEY],
    // TODO: replace with real queryAuctions query
    queryFn: async () => {
      return MOCK_QUERY_AUCTIONS_RESPONSE;
    },
  });
  // const [data, setData] = useState<AuctionInfo[] | undefined>(undefined);
  // const [isError, setError] = useState<string | undefined>(undefined);
  // const [isLoading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const fetchAuctions = async () => {
  //     try {
  //       const customWindow = window as CustomWindow;
  //       const auctions = await customWindow.queryAuctions?.();
  //       if (auctions) {
  //         setData(auctions);
  //       } else {
  //         setError('No auctions found');
  //       }
  //     } catch (err) {
  //       setError('Error fetching auctions');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAuctions();
  // }, []);

  return { data, isError, isLoading };
};
