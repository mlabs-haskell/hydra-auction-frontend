import { useQuery } from '@tanstack/react-query';
import { ContractConfig, getWalletVk } from 'hydra-auction-offchain';
import { getValidContractResponse } from 'src/utils/contract';

 // useQuery refetch interval was not working. Do it manually instead.
let lastRequest = 0; // Track the last fetched time
let refetchInterval = 1000 * 60 * 2; 

const WALLET_VK_QUERY_KEY = 'wallet-vk';
export const useWalletVk = (config: ContractConfig, enabled: boolean) => {
  return useQuery({
    queryKey: [WALLET_VK_QUERY_KEY, config],
    queryFn: async () => {
      lastRequest = Date.now();
      const walletVkResponse = await getWalletVk(config);
      const walletVk = getValidContractResponse(walletVkResponse);
      return walletVk;
    },
    retry: false,
    enabled: !!config && !!enabled && Date.now() - lastRequest > refetchInterval, // Only refetch if enough time has passed
  });
};
