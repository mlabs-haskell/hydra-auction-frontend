import { useWallet } from "@meshsdk/react";
import { RegisterDelegateGroupContractParams, WalletApp } from "hydra-auction-offchain";
import { useCallback, useState } from "react";
import { getConfig } from "src/utils/config";
import { StringInput } from "../Inputs/StringInput";
import { useRegisterDelegateGroup } from "src/hooks/api/registerDelegates";

const DelegatePortal = () => {

  const { name: walletName, wallet, connected } = useWallet();
  const config = getConfig('network', walletName as WalletApp)



  const [delegateGroupParams, setDelegateGroupParams] = useState<RegisterDelegateGroupContractParams>({
    delegateGroupServers: {
      httpServers: [],
      wsServers: []
    },
    delegateGroupMetadata: '',
  })

  const { mutate: reg, isPending: isRegisterDelegatesPending} = useRegisterDelegateGroup(config, delegateGroupParams)

  const handleFormInputChange = useCallback((inputId: string, value: any) => {
    if(inputId === 'httpServers' || inputId === 'wsServers') {
      setDelegateGroupParams((prev) => ({
        ...prev,
        delegateGroupServers: {
          ...prev.delegateGroupServers,
          [inputId]: value
        }
      }))
      return;
    }
    setDelegateGroupParams((prev) => ({
      ...prev,
      [inputId]: value}))
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-title1 mb-4">Register Delegate Group</h1>
        <hr className="border-b border-gray-400 w-32" />
      </div>
      <div className="p-0 lg:p-3 mb-3 w-full">
        <form className="block" onSubmit={handleSubmit}>
          <StringInput 
            label="Metadata" 
            inputId="metadata" 
            onChange={handleFormInputChange}
          />
          <input
            disabled={isRegisterDelegatesPending}
            type="submit"
            className={`mt-8 submit-btn disabled:border-none disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none`}
          ></input>
        </form>
      </div>
    </div>
  );
}

export default DelegatePortal;