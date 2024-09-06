import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionDetail from './AuctionDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock getUrlParams utility
jest.mock('src/utils/getUrlParams', () => ({
  getUrlParams: jest.fn(() => new URLSearchParams('auctionId=mockAuctionId')),
}));

// Mock the module where useActiveAuctions is defined
jest.mock('src/hooks/api/auctions', () => ({
  useActiveAuctions: jest.fn(),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

const auctionInfo = generateMockAuctionInfo();

describe('AuctionDetail Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders auction details as bidder', async () => {
    // Mock return values for hooks
    const { useActiveAuctions } = require('src/hooks/api/auctions');
    useActiveAuctions.mockReturnValue({
      data: [
        {
          auctionId: 'mockAuctionId',
          seller: 'mockSellerAddress',
          auctionTerms: {
            auctionLot: [
              {
                cs: 'mockAssetUnit',
                tn: 'mockAssetName',
                quantity: 1,
              },
            ],
          },
          // Other auction details...
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuctionDetail />
      </QueryClientProvider>
    );

    // Check that auction details are rendered correctly
    expect(screen.getByText('My NFT')).toBeInTheDocument();
    expect(screen.getByText('Mock NFT Description 🐶')).toBeInTheDocument();
    expect(screen.getByTestId('bidder-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('seller-detail')).not.toBeInTheDocument();
  });

  it('renders auction details as seller', async () => {
    // Mock return values for hooks
    require('src/utils/getUrlParams').getUrlParams.mockImplementationOnce(
      () => new URLSearchParams('auctionId=mockAuctionId')
    );
    const { useActiveAuctions } = require('src/hooks/api/auctions');

    useActiveAuctions.mockReturnValue({
      data: [
        {
          auctionId: 'mockAuctionId',
          auctionTerms: {
            auctionLot: [
              {
                cs: 'mockAssetUnit',
                tn: 'mockAssetName',
                quantity: 1,
              },
            ],
            sellerAddress: 'mockWalletAddress',
          },
        },
      ],
      isLoading: false,
      isError: false,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AuctionDetail />
        </QueryClientProvider>
      );
    });

    // Check that auction details are rendered correctly
    expect(screen.getByText('My NFT')).toBeInTheDocument();
    expect(screen.getByText('Mock NFT Description 🐶')).toBeInTheDocument();
    expect(screen.getByTestId('seller-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('bidder-detail')).not.toBeInTheDocument();
  });

  it('renders error messages when auction data fails to load', async () => {
    // Mock error state
    require('src/utils/getUrlParams').getUrlParams.mockImplementationOnce(
      () => new URLSearchParams('auctionId=anotherMockAuctionId')
    );

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AuctionDetail />
        </QueryClientProvider>
      );
    });

    // Check for error message
    expect(screen.getByText('Error finding auction...')).toBeInTheDocument();
  });

  it('shows loading state while data is being fetched', async () => {
    // Mock loading state
    const { useActiveAuctions } = require('src/hooks/api/auctions');
    useActiveAuctions.mockReturnValue({
      data: [
        {
          auctionId: 'mockAuctionId',
          seller: 'mockSellerAddress',
          auctionTerms: {
            auctionLot: [
              {
                cs: 'mockAssetUnit',
                tn: 'mockAssetName',
                quantity: 1,
              },
            ],
          },
        },
      ],
      isLoading: true,
      isError: false,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <AuctionDetail />
        </QueryClientProvider>
      );
    });

    // Check for loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
