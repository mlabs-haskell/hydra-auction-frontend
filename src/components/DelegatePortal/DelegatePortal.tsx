import { useWallet } from "@meshsdk/react";
import { RegisterDelegateGroupContractParams, WalletApp } from "hydra-auction-offchain";
import { FormEvent, useCallback, useState } from "react";
import { getConfig } from "src/utils/config";
import { StringInput } from "../Inputs/StringInput";
import { useRegisterDelegateGroup } from "src/hooks/api/registerDelegates";
import { MultiStringInput } from "../Inputs/MultiStringInput";
import { DelegateInfoSchema } from "src/schemas/delegatesSchema";
import { toast } from "react-toastify";

const DelegatePortal = () => {

  const { name: walletName, wallet, connected } = useWallet();
  const config = getConfig('network', walletName as WalletApp)

  const [delegateGroupParams, setDelegateGroupParams] = useState<RegisterDelegateGroupContractParams>({
    delegateGroupServers: {
      httpServers: [""],
      wsServers: [""]
    },
    delegateGroupMetadata: '',
  })

  const { mutate: registerDelegates, isPending: isRegisterDelegatesPending} = useRegisterDelegateGroup(config, delegateGroupParams)

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const registerDelegatesFormValidated = DelegateInfoSchema
      .refine((data) => data.delegateGroupServers.wsServers.length > 0, {
        message: "At least one websocket server is required",
      })
      .refine((data) => data.delegateGroupServers.httpServers.length > 0, {
        message: "At least one http server is required",
      })
      .refine((data) => data.delegateGroupMetadata.length > 0, {
        message: "Delegate group metadata is required",
      })
      .safeParse(delegateGroupParams);

    if (!registerDelegatesFormValidated.success) {
      toast.error(`Error creating delegate group: ${registerDelegatesFormValidated.error.issues[0].message}`);
      console.log(registerDelegatesFormValidated.error.format());
    } else {
      registerDelegates(delegateGroupParams);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-title1 mb-4">Register Delegate Group</h1>
        <hr className="border-b border-gray-400 w-32" />
      </div>
      <div className="p-0 lg:p-3 mb-3 w-full">
        <form className="block" onSubmit={handleSubmit}>
          <StringInput 
            label="Delegate Group Metadata (Name)" 
            inputId="delegateGroupMetadata" 
            onChange={handleFormInputChange}
          />
          <MultiStringInput 
            label="Websocket Servers"
            inputId="wsServers"
            values={delegateGroupParams.delegateGroupServers.wsServers}
            onChange={handleFormInputChange}
          />
          <MultiStringInput 
            label="HTTP Servers"
            inputId="httpServers"
            values={delegateGroupParams.delegateGroupServers.httpServers}
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