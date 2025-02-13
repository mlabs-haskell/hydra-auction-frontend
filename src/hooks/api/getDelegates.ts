import { useQuery} from '@tanstack/react-query';
import { queryDelegateGroups, ContractConfig, DelegateGroupInfo } from 'hydra-auction-offchain';


const GET_DELEGATES_QUERY_KEY = 'get-delegates';

const mockDelegateGroups: DelegateGroupInfo[] = [
  {
    delegateGroupId: 'mockDelegateGroupId',
    delegateGroupMasterKeys: [],
    delegateGroupServers: {
      httpServers: ['http://localhost:3000'],
      wsServers: ['ws://localhost:3000'],
    },
    delegateGroupMetadata: 'Ikigai Technologies',
  },
  {
    delegateGroupId: 'mockDelegateGroupId2',
    delegateGroupMasterKeys: [],
    delegateGroupServers: {
      httpServers: ['http://localhost:3001'],
      wsServers: ['ws://localhost:3001'],
    },
    delegateGroupMetadata: 'MLabs',
  }
]

export const useGetDelegates = (config: ContractConfig) => {
  const delegatesQuery = useQuery({
    queryKey: [GET_DELEGATES_QUERY_KEY, config],
    queryFn: async () => {
      const groups = await queryDelegateGroups(config)
      return groups ?? mockDelegateGroups;
    },
  });
  return delegatesQuery;
};