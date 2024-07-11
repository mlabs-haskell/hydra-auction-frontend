import { useQuery } from '@tanstack/react-query';
import { ContractConfig, getWalletVk } from 'hydra-auction-offchain';
import { getValidContractResponse } from 'src/utils/contract';
import { BASE_REFETCH_INTERVAL } from 'src/utils/refetch';

const WALLET_VK_QUERY_KEY = 'wallet-vk';
export const useWalletVk = (config: ContractConfig, enabled: boolean) => {
  return useQuery({
    queryKey: [WALLET_VK_QUERY_KEY, config],
    queryFn: async () => {
      const walletVkResponse = await getWalletVk(config);
      const walletVk = getValidContractResponse(walletVkResponse);
      return walletVk;
    },
    staleTime: BASE_REFETCH_INTERVAL,
    enabled: !!config && !!enabled,
  });
};
