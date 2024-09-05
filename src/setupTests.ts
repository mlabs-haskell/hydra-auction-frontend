import '@testing-library/jest-dom';

//// Mocks loaded before tests ////

// mesh
const mockEnable = jest.fn().mockResolvedValue({
  getBalance: jest.fn().mockResolvedValue([]),
  getChangeAddress: jest.fn().mockResolvedValue('mockChangeAddress'),
  getCollateral: jest.fn().mockResolvedValue([]),
  getNetworkId: jest.fn().mockResolvedValue(1),
  getRewardAddresses: jest.fn().mockResolvedValue([]),
  getUnusedAddresses: jest.fn().mockResolvedValue([]),
  getUsedAddresses: jest.fn().mockResolvedValue(['mockWalletAddress']),
  getUtxos: jest.fn().mockResolvedValue([]),
  signData: jest.fn().mockResolvedValue({ signature: 'mockSignature' }),
  signTx: jest.fn().mockResolvedValue('mockSignedTx'),
  submitTx: jest.fn().mockResolvedValue('mockTxHash'),
  getUsedAddress: jest.fn().mockResolvedValue('mockUsedAddress'),
  getUsedCollateral: jest.fn().mockResolvedValue([]),
  getUsedUTxOs: jest.fn().mockResolvedValue([]),
  getAssets: jest.fn().mockResolvedValue([]),
  getLovelace: jest.fn().mockResolvedValue('mockLovelace'),
  getPolicyIdAssets: jest.fn().mockResolvedValue([]),
  getPolicyIds: jest.fn().mockResolvedValue([]),
});
jest.mock('@meshsdk/core', () => {
  // Define the mock implementation for enable

  // Mock BrowserWallet as a constructor
  const mockBrowserWallet = jest.fn(() => ({
    enable: mockEnable,
    getUsedAddresses: jest.fn().mockResolvedValue(['mockWalletAddress']),
  }));

  return {
    BrowserWallet: mockBrowserWallet,
    BlockfrostProvider: jest.fn(),
  };
});

jest.mock('@meshsdk/react', () => ({
  useAssets: jest.fn(),
  useWallet: jest.fn().mockReturnValue({
    name: 'Nami',
    connecting: false,
    connected: true,
    wallet: {
      getInstalledWallets: jest.fn().mockResolvedValue(['Nami']),
      enable: mockEnable,
      resolveInstance: jest.fn(),
      getUsedAddresses: jest.fn().mockResolvedValue(['mockUnusedAddress']),
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
    error: null,
  }),
}));

// offchain
jest.mock('hydra-auction-offchain', () => ({
  announceAuction: jest.fn(),
  enterAuction: jest.fn(),
}));

// needed libs
jest.mock('react-mixpanel-browser', () => ({
  useMixpanel: jest.fn(() => ({
    track: jest.fn(),
  })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// hooks
jest.mock('src/hooks/api/user', () => ({
  useWalletAddress: jest.fn().mockReturnValue({ data: 'mockWalletAddress' }),
}));

jest.mock('src/hooks/api/assets', () => ({
  useExtendedAssets: jest.fn().mockReturnValue({
    data: [
      {
        unit: 'mockAssetUnit',
        policyId: 'mockPolicyId',
        assetName: 'mockAssetName',
        fingerprint: 'mockFingerprint',
        quantity: 1,
      },
    ],
  }),
  useAssetMetadata: jest.fn().mockReturnValue({
    data: {
      unit: 'mockAssetUnit',
      image: 'mockImage',
      name: 'My NFT',
      description: 'Mock NFT Description 🐶',
    },
    isLoading: false,
  }),
}));

jest.mock('src/hooks/api/delegates', () => ({
  useDelegates: jest.fn().mockReturnValue({
    groupName: 'Cardano Foundation',
    groupURL: 'https://cardanofoundation.org',
    delegates: [
      '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c',
      '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9',
      '2bcc4ca387f39d2e792d7d08484c96d0d59b26cbfafc1fa4ffad486c',
    ],
  }),
}));

// utils
jest.mock('src/utils/formatting', () => ({
  removePolicyIdFromAssetUnit: jest.fn().mockReturnValue('mockAssetName'),
  removeSpecialCharsAssetName: jest.fn().mockReturnValue('mockAssetName'),
}));

jest.mock('src/utils/config', () => ({
  getConfig: jest.fn(() => ({
    tag: 'network',
    network: 'Preprod',
    blockfrostApiKey: 'mockBlockFrostApiKey',
    walletApp: 'Nami',
  })),
}));
