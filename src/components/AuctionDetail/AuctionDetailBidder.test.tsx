import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionDetailBidder from './AuctionDetailBidder';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';
import { getConfig } from 'src/utils/config';

// Mock the API hooks
jest.mock('src/hooks/api/discoverSellerSignature', () => ({
  useDiscoverSellerSignature: jest.fn(),
}));

jest.mock('src/hooks/api/walletVk', () => ({
  useWalletVk: jest.fn(),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('AuctionDetailBidder Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('eternl');
  const auctionInfo = generateMockAuctionInfo();
  const walletAddress = 'mockWalletAddress';

  it('renders BiddingView when seller signature is present', async () => {
    // Mock return values for hooks
    const { useWalletVk } = require('src/hooks/api/walletVk');
    const {
      useDiscoverSellerSignature,
    } = require('src/hooks/api/discoverSellerSignature');

    useWalletVk.mockReturnValue({ data: 'mockWalletVk' });
    useDiscoverSellerSignature.mockReturnValue({ data: 'mockSellerSignature' });

    render(
      <QueryClientProvider client={queryClient}>
        <AuctionDetailBidder
          config={config}
          auctionInfo={auctionInfo}
          walletAddress={walletAddress}
        />
      </QueryClientProvider>
    );

    // Check that BiddingView is rendered

    expect(screen.getByTestId('bidding-view')).toBeInTheDocument();

    expect(screen.queryByText('EnterAuction')).not.toBeInTheDocument();
  });

  it('renders EnterAuction when seller signature is not present', async () => {
    // Mock return values for hooks
    const { useWalletVk } = require('src/hooks/api/walletVk');
    const {
      useDiscoverSellerSignature,
    } = require('src/hooks/api/discoverSellerSignature');

    useWalletVk.mockReturnValue({ data: '' });
    useDiscoverSellerSignature.mockReturnValue({ data: '' });

    render(
      <QueryClientProvider client={queryClient}>
        <AuctionDetailBidder
          config={config}
          auctionInfo={auctionInfo}
          walletAddress={walletAddress}
        />
      </QueryClientProvider>
    );

    // Check that EnterAuction is rendered

    expect(screen.getByText('Enter Auction')).toBeInTheDocument();
    expect(screen.queryByTestId('bidding-view')).not.toBeInTheDocument();
  });
});
