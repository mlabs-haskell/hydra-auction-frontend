import { useQuery } from '@tanstack/react-query';

const MOCK_SELLER_ADDRESS =
  '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c';
const SELLER_ADDRESS_QUERY_KEY = 'seller-address';

export const useSellerAddress = () => {
  const sellerSignatureQuery = useQuery({
    queryKey: [SELLER_ADDRESS_QUERY_KEY],
    queryFn: async () => {
      return MOCK_SELLER_ADDRESS;
    },
  });
  return sellerSignatureQuery;
};
