import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlaceBidForm } from './PlaceBid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getConfig } from 'src/utils/config';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock the API hooks
jest.mock('src/hooks/api/placeBid', () => ({
  usePlaceBid: jest.fn(),
}));

// Mock utility functions
jest.mock('src/utils/currency', () => ({
  adaToLovelace: jest.fn((ada) => ada * 1000000),
  lovelaceToAda: jest.fn((lovelace) => lovelace / 1000000),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('PlaceBidForm Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('eternl');
  const auctionInfo = generateMockAuctionInfo();
  const sellerSignature = 'mockSellerSignature';
  const standingBid = '1000000'; // 1 ADA in lovelace

  it('submits bid with correct amount', async () => {
    const { usePlaceBid } = require('src/hooks/api/placeBid');
    const { adaToLovelace } = require('src/utils/currency');

    const mockMutate = jest.fn();
    usePlaceBid.mockReturnValue({ mutate: mockMutate, isPending: false });
    adaToLovelace.mockReturnValue(1500000); // Mock conversion of 1.5 ADA to lovelace

    render(
      <QueryClientProvider client={queryClient}>
        <PlaceBidForm
          config={config}
          auctionInfo={auctionInfo}
          sellerSignature={sellerSignature}
          standingBid={standingBid}
        />
      </QueryClientProvider>
    );

    // // Simulate user input
    const bidInput = screen.getByLabelText('Bid Amount');
    fireEvent.change(bidInput, { target: { value: '1.5' } });

    // Simulate form submission
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith('1500000'); // 1.5 ADA in lovelace
    });
  });

  it('disables submit button when a bid is pending', () => {
    const { usePlaceBid } = require('src/hooks/api/placeBid');

    usePlaceBid.mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(
      <QueryClientProvider client={queryClient}>
        <PlaceBidForm
          config={config}
          auctionInfo={auctionInfo}
          sellerSignature={sellerSignature}
          standingBid={standingBid}
        />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
