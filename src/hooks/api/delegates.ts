import { useQuery } from '@tanstack/react-query';
import { queryDelegateGroups, ContractConfig } from 'hydra-auction-offchain';

const DELEGATES_QUERY_KEY = 'delegates';

export const useGetDelegates = (config: ContractConfig) => {
  const delegatesQuery = useQuery({
    queryKey: [DELEGATES_QUERY_KEY, config],
    queryFn: async () => {
      return await queryDelegateGroups(config);
    },
  });
  return delegatesQuery;
};
