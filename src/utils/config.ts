import { ContractConfig, WalletApp } from 'hydra-auction-offchain';

export function meshWalletAppToWalletApp(
  walletApp: string
): WalletApp {
  switch (walletApp) {
    case 'eternl': return 'Eternl';
    case 'Nami': return 'Nami';
    case 'lace': return 'Lace';
    case 'GeroWallet': return 'Gero';
    case 'Nufi': return 'NuFi'; // needs checking
  }

  return 'Eternl';
}

export const getConfig = (
  type: 'network' | 'plutip',
  wallet?: string
): ContractConfig => {
  if (type === 'network') {
    return {
      tag: 'network',
      network: 'Preprod',
      blockfrostApiKey: process.env.REACT_APP_BLOCKFROST_API_KEY || '',
      walletApp: meshWalletAppToWalletApp(wallet as string),
    };
  } else {
    return {
      tag: 'plutip',
      demoHostPort: 'localhost:8080',
      plutipEnvHostPort: 'localhost:8083',
    };
  }
};
