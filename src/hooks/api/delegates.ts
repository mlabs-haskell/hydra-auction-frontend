import { useQuery } from '@tanstack/react-query';
import { MOCK_GET_DELEGATES } from 'src/mocks/getDelegates.mock';

const DELEGATES_QUERY_KEY = 'delegates';

export const useDelegates = () => {
  const delegatesQuery = useQuery({
    queryKey: [DELEGATES_QUERY_KEY],
    queryFn: async () => {
      return MOCK_GET_DELEGATES;
    },
  });
  return delegatesQuery;
};
