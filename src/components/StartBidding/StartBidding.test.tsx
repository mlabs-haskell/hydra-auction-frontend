import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StartBidding from './StartBidding';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWallet } from '@meshsdk/react';
import { useStartBidding } from 'src/hooks/api/startBidding';
import { getConfig } from 'src/utils/config';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

jest.mock('src/hooks/api/startBidding', () => ({
  useStartBidding: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
  }),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('StartBidding Component Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('eternl');
  const auctionInfo = generateMockAuctionInfo();

  it('fetches wallet address on mount and starts bidding when button is clicked', async () => {
    const mockGetUsedAddresses = jest.fn().mockResolvedValue(['testAddress']);
    const mockWallet = { getUsedAddresses: mockGetUsedAddresses };
    const mockStartBiddingMutate = jest.fn();
    (useWallet as jest.Mock).mockReturnValue({
      wallet: mockWallet,
    });

    (useStartBidding as jest.Mock).mockReturnValue({
      mutate: mockStartBiddingMutate,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StartBidding config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockGetUsedAddresses).toHaveBeenCalled();
    });

    const startBiddingButton = screen.getByRole('button', {
      name: /Start Bidding/i,
    });

    fireEvent.click(startBiddingButton);

    await waitFor(() => {
      expect(mockStartBiddingMutate).toHaveBeenCalledWith({
        auctionInfo: auctionInfo,
      });
    });
  });

  it('disables the start bidding button when pending or disabled', () => {
    const mockStartBiddingMutate = jest.fn();
    (useWallet as jest.Mock).mockReturnValue({
      wallet: { getUsedAddresses: jest.fn() },
    });

    (useStartBidding as jest.Mock).mockReturnValue({
      mutate: mockStartBiddingMutate,
      isPending: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StartBidding
          config={config}
          auctionInfo={auctionInfo}
          disabled={true}
        />
      </QueryClientProvider>
    );

    const startBiddingButton = screen.getByRole('button', {
      name: /Start Bidding/i,
    });

    expect(startBiddingButton).toBeDisabled();
  });

  it('does not start bidding if no wallet address is available', async () => {
    const mockStartBiddingMutate = jest.fn();
    const mockGetUsedAddresses = jest.fn().mockResolvedValue([]);
    const mockWallet = { getUsedAddresses: mockGetUsedAddresses };
    (useWallet as jest.Mock).mockReturnValue({
      wallet: mockWallet,
    });

    (useStartBidding as jest.Mock).mockReturnValue({
      mutate: mockStartBiddingMutate,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <StartBidding config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockGetUsedAddresses).toHaveBeenCalled();
    });

    const startBiddingButton = screen.getByRole('button', {
      name: /Start Bidding/i,
    });

    fireEvent.click(startBiddingButton);

    await waitFor(() => {
      expect(mockStartBiddingMutate).not.toHaveBeenCalled();
    });
  });
});
