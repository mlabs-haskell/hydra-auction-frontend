import {
  ContractOutput,
  TransactionHash,
  awaitTxConfirmed,
  ContractConfig,
} from 'hydra-auction-offchain';
import {
  contractOutputErrorSchema,
  contractOutputResultSchema,
} from 'src/schemas/contractOutputSchema';

export const POLICY_ID_LENGTH = 56;

// For testing validity of contract outputs and logging - copied from hydra-auction-offchain demo
export async function logConfirmContract<T extends { txHash: TransactionHash }>(
  label: string,
  config: ContractConfig,
  output: ContractOutput<T | TransactionHash | any>
): Promise<void> {
  console.log(label + ':', output);
  if (output.tag !== 'result') {
    throw new Error(label + ' contract failed.');
  }
  await awaitTxConfirmed(config, output.value.txHash ?? output.value);
}

export const getValidContractResponse = <T>(
  contractResponse: ContractOutput<T>
): T | null => {
  const contractSchemaValidated =
    contractOutputResultSchema.safeParse(contractResponse);
  const contractErrorSchemaValidated =
    contractOutputErrorSchema.safeParse(contractResponse);
  if (contractSchemaValidated.success) {
    return contractSchemaValidated.data.value;
  } else if (contractErrorSchemaValidated.success) {
    throw new Error(contractErrorSchemaValidated.data.value.message);
  }
  return null;
};
