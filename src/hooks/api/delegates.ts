import { useQuery } from '@tanstack/react-query';
import { queryDelegateGroups, ContractConfig, DelegateGroupInfo } from 'hydra-auction-offchain';

const DELEGATES_QUERY_KEY = 'delegates';

export const useGetDelegates = (config: ContractConfig) => {
  const delegatesQuery = useQuery({
    queryKey: [DELEGATES_QUERY_KEY, config],
    queryFn: async () => {
      const delegateGroups: DelegateGroupInfo[] = await queryDelegateGroups(config);
      return delegateGroups;
    },
  });
  return delegatesQuery;
};
