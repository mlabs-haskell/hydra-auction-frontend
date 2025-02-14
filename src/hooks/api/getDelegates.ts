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

//hardcoded in for now. this could easily be made dynamic for access in an admin panel
const blacklist: string[] = [
  "2e719a96c631c0073927aad5b7e921a2f2118050eae0885d5ec874b7",
  "0c5537eaf2b75cc27972f3b4878c928e420841bc2831aae9dac0d746",
  "9ff4b8b97d182ac5a9b795bd705101dabf838935920c20efad9517f9",
  "62d07246c1ab4e0d4e9a1494a481a0f2bcd457d58c0295a4c918ea88",
  "94d810ad09938bff80a902526894704b86b78288704770b91fb5c685",
  "54b3234fbe87e1878a95d5e48a64f8f498c9eec14fbd1a81e124a9a7",
]

export const useGetDelegates = (config: ContractConfig) => {
  const delegatesQuery = useQuery({
    queryKey: [GET_DELEGATES_QUERY_KEY, config],
    queryFn: async () => {
      const groups = await queryDelegateGroups(config)

      const filteredGroups = groups.filter(group => !blacklist.includes(group.delegateGroupId))

      //console.log('filteredGroups', filteredGroups)

      return filteredGroups ?? mockDelegateGroups;
    },
  });
  return delegatesQuery;
};