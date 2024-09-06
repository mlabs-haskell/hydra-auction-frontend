import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionList from './AuctionList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@meshsdk/react';
import { useWalletAddress } from 'src/hooks/api/user';
import { useActiveAuctions } from 'src/hooks/api/auctions';
import {
  getAndStoreAssetMetadata,
  useAssetMetadata,
} from 'src/hooks/api/assets';
import { AuctionInfo } from 'hydra-auction-offchain';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock implementations of hooks and API calls
jest.mock('@meshsdk/react', () => ({
  useWallet: jest.fn(),
}));

jest.mock('src/hooks/api/user', () => ({
  useWalletAddress: jest.fn(),
}));

jest.mock('src/hooks/api/auctions', () => ({
  useActiveAuctions: jest.fn(),
}));

jest.mock('src/hooks/api/assets', () => ({
  getAndStoreAssetMetadata: jest.fn(),
  useAssetMetadata: jest.fn(),
}));

// Setup a QueryClient for testing
const queryClient = new QueryClient();

const auctionInfo = generateMockAuctionInfo();
describe('AuctionList Component', () => {
  const mockAuctionInfo: AuctionInfo = {
    ...auctionInfo,
    auctionId: '1',
    auctionTerms: {
      ...auctionInfo.auctionTerms,
      biddingStart: '2023-01-01T00:00:00Z',
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();

    // Mock useWallet
    (useWallet as jest.Mock).mockReturnValue({
      name: 'nami',
      wallet: {
        getUsedAddresses: jest.fn().mockResolvedValue(['addr1']),
      },
      connected: true,
    });

    // Mock useWalletAddress
    (useWalletAddress as jest.Mock).mockReturnValue({
      data: 'addr1',
    });

    // Mock useActiveAuctions
    (useActiveAuctions as jest.Mock).mockReturnValue({
      data: [mockAuctionInfo],
    });

    (useAssetMetadata as jest.Mock).mockReturnValue({
      data: {
        unit: 'mockAssetUnit',
        image: 'mockImage',
        name: 'Name 1',
        description: 'mockImageDescription',
      },
      isLoading: false,
    });
    // Mock getAndStoreAssetMetadata
    (getAndStoreAssetMetadata as jest.Mock).mockResolvedValue({
      image: 'mockImageURL',
    });
  });

  it('renders auction list and filters correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuctionList />
      </QueryClientProvider>
    );

    // Check initial render
    expect(screen.getByText('Query Auctions')).toBeInTheDocument();

    // Wait for auctions to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('1 Auctions')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Name 1')).toBeInTheDocument();
    });
  });
});
