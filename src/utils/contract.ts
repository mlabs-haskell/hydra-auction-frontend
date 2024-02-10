import {
  ContractOutput,
  TransactionHash,
  WalletApp,
  awaitTxConfirmed,
  type ContractOutputError,
  ByteArray,
  BidderInfoCandidate,
} from 'hydra-auction-offchain';
import { toast } from 'react-toastify';
import { contractOutputResultSchema } from 'src/schemas/contractOutputSchema';

export const POLICY_ID_LENGTH = 56;

// For testing validity of contract outputs and logging - copied from hydra-auction-offchain demo
export async function logConfirmContract<T extends { txHash: TransactionHash }>(
  label: string,
  walletApp: WalletApp,
  output: ContractOutput<T | TransactionHash | any>
): Promise<void> {
  console.log(label + ':', output);
  if (output.tag !== 'result') {
    throw new Error(label + ' contract failed.');
  }
  // My understanding is this awaits until the contract output can be verified on blockfrost
  await awaitTxConfirmed(walletApp, output.value.txHash ?? output.value);
}

type ToastContractLogger = {
  contractResponse: ContractOutput<any>;
  toastSuccessMsg: string;
  toastErrorMsg: string;
  onSuccess?: () => void;
};
export const logContractToast = ({
  contractResponse,
  toastSuccessMsg,
  toastErrorMsg,
}: ToastContractLogger) => {
  const contractResult = contractOutputResultSchema.safeParse(contractResponse);
  if (contractResult.success) {
    // TODO: If contract response is object or array then map keys/values and check for null/undefined for value
    if (
      contractResponse.value !== null &&
      contractResponse.value !== undefined
    ) {
      toast.success(`${toastSuccessMsg}`);
    } else {
      toast.error(`${toastErrorMsg} no value returned from contract.`);
    }
  } else {
    toast.error(
      `${toastErrorMsg} ${
        contractResponse.value.message ?? contractResponse.value.info
      }`
    );
  }
};
