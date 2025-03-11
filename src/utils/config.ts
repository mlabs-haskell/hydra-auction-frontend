import { ContractConfig, WalletApp } from 'hydra-auction-offchain';

export function meshWalletAppToWalletApp(
  walletApp: string
): WalletApp {
  switch (walletApp) {
    case 'eternl': return 'Eternl';
    case 'lace': return 'Lace';
    case 'GeroWallet': return 'Gero';
    case 'Nufi': return 'NuFi'; // needs checking
  }

  return 'Eternl';
}

export const getConfig = (
  wallet?: string
): ContractConfig => {
    return {
      network: 'Preprod',
      blockfrostApiKey: process.env.REACT_APP_BLOCKFROST_API_KEY || '',
      walletApp: meshWalletAppToWalletApp(wallet as string),
    };
};
