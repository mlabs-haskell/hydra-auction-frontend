import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractConfig, RegisterDelegateGroupContractParams, registerDelegateGroup } from 'hydra-auction-offchain';
import { useMixpanel } from 'react-mixpanel-browser';
import { toast } from 'react-toastify';
import { getValidContractResponse } from 'src/utils/contract';
import { trackError } from 'src/utils/errorTracking';

const REG_DELEGATES_QUERY_KEY = 'register-delegates';

export const useRegisterDelegateGroup = (config: ContractConfig, params: RegisterDelegateGroupContractParams) => {
  const queryClient = useQueryClient();
  const mixPanel = useMixpanel();
  const registerDelegateGroupMutation = useMutation({
    mutationFn: async (params: RegisterDelegateGroupContractParams) => {
      toast.info('Registering delegate group...');
      const registerDelegateGroupResponse = await registerDelegateGroup(config, params);
      const registerDelegateGroupValidated = getValidContractResponse(registerDelegateGroupResponse);
      return registerDelegateGroupValidated;
    },
    onSuccess: async (registerDelegateGroupValidated) => {
      toast.success('Delegate group registered');
      mixPanel?.track('DelegateGroupRegisterSucceeded', {
        delegateGroupId: registerDelegateGroupValidated?.delegateGroupInfo.delegateGroupId,
        delegateGroupServers: registerDelegateGroupValidated?.delegateGroupInfo.delegateGroupServers,
        delegateGroupMetadata: registerDelegateGroupValidated?.delegateGroupInfo.delegateGroupMetadata,
      });
      queryClient.invalidateQueries({queryKey: [REG_DELEGATES_QUERY_KEY, config]});
    },
    onError: (error: Error, params) => {
      trackError(error, 'registerDelegates', mixPanel, params);
      toast.error(`Register Delegate Group failed: ${error.message}`);
      console.error('Error registering delegates', error);
    },
  })

  return registerDelegateGroupMutation;
}