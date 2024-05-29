import { ContractConfig, WalletApp } from 'hydra-auction-offchain';

export const getConfig = (
  type: 'network' | 'plutip',
  walletApp?: WalletApp
): ContractConfig => {
  if (type === 'network') {
    return {
      tag: 'network',
      network: 'Preprod',
      blockfrostApiKey: process.env.REACT_APP_BLOCKFROST_API_KEY || '',
      walletApp: walletApp || 'Nami',
    };
  } else {
    return {
      tag: 'plutip',
      demoHostPort: 'localhost:8080',
      plutipEnvHostPort: 'localhost:8083',
    };
  }
};
