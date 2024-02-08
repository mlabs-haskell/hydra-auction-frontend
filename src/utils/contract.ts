import {
  ContractOutput,
  TransactionHash,
  WalletApp,
  awaitTxConfirmed,
} from 'hydra-auction-offchain';

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
