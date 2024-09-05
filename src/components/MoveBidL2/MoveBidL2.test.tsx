import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoveBidL2 from './MoveBidL2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMoveBidL2 } from 'src/hooks/api/moveBidL2';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';
import { getConfig } from 'src/utils/config';

// Mock the necessary hooks
jest.mock('src/hooks/api/moveBidL2', () => ({
  useMoveBidL2: jest.fn(),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('MoveBidL2 Component Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('network', 'Nami');
  const auctionInfo = generateMockAuctionInfo();

  it('moves bidding to L2 when button is clicked', async () => {
    const mockMoveBidL2Mutate = jest.fn();

    (useMoveBidL2 as jest.Mock).mockReturnValue({
      mutate: mockMoveBidL2Mutate,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MoveBidL2 config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    const moveBidL2Button = screen.getByRole('button', {
      name: /Move Bidding to L2/i,
    });

    fireEvent.click(moveBidL2Button);

    await waitFor(() => {
      expect(mockMoveBidL2Mutate).toHaveBeenCalledWith({
        auctionCs: auctionInfo.auctionId,
        auctionTerms: auctionInfo.auctionTerms,
        delegateInfo: auctionInfo.delegateInfo,
      });
    });
  });

  it('disables the move bidding button when pending or disabled', () => {
    const mockMoveBidL2Mutate = jest.fn();

    (useMoveBidL2 as jest.Mock).mockReturnValue({
      mutate: mockMoveBidL2Mutate,
      isPending: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MoveBidL2 config={config} auctionInfo={auctionInfo} disabled={true} />
      </QueryClientProvider>
    );

    const moveBidL2Button = screen.getByRole('button', {
      name: /Move Bidding to L2/i,
    });

    expect(moveBidL2Button).toBeDisabled();
  });

  it('does not move bidding to L2 if delegateInfo is not available', async () => {
    const mockMoveBidL2Mutate = jest.fn();
    const auctionInfoWithoutDelegate = {
      ...auctionInfo,
      delegateInfo: null,
    };

    (useMoveBidL2 as jest.Mock).mockReturnValue({
      mutate: mockMoveBidL2Mutate,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MoveBidL2 config={config} auctionInfo={auctionInfoWithoutDelegate} />
      </QueryClientProvider>
    );

    const moveBidL2Button = screen.getByRole('button', {
      name: /Move Bidding to L2/i,
    });

    fireEvent.click(moveBidL2Button);

    await waitFor(() => {
      expect(mockMoveBidL2Mutate).not.toHaveBeenCalled();
    });
  });
});
