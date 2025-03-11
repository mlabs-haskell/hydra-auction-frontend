import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlaceBidL2Form } from './PlaceBidL2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getConfig } from 'src/utils/config';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock the API hooks
jest.mock('src/hooks/api/placeBidL2', () => ({
  usePlaceBidL2: jest
    .fn()
    .mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

// Mock utility functions
jest.mock('src/utils/currency', () => ({
  adaToLovelace: jest.fn((ada) => ada * 1000000),
  lovelaceToAda: jest.fn((lovelace) => lovelace / 1000000),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('PlaceBidL2Form Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('eternl');
  const auctionCs = 'mockCurrencySymbol';
  const auctionInfo = generateMockAuctionInfo();
  const auctionTerms = auctionInfo.auctionTerms;
  const delegateInfo = auctionInfo.delegateInfo;
  const sellerSignature = 'mockSellerSignature';

  it('renders form elements correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlaceBidL2Form
          config={config}
          auctionCs={auctionCs}
          auctionTerms={auctionTerms}
          delegateInfo={delegateInfo}
          sellerSignature={sellerSignature}
        />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText('Bid Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits bid with correct amount and parameters', async () => {
    const { usePlaceBidL2 } = require('src/hooks/api/placeBidL2');
    const { adaToLovelace } = require('src/utils/currency');

    const mockMutate = jest.fn();
    usePlaceBidL2.mockReturnValue({ mutate: mockMutate, isPending: false });
    adaToLovelace.mockReturnValue(1500000); // Mock conversion of 1.5 ADA to lovelace

    render(
      <QueryClientProvider client={queryClient}>
        <PlaceBidL2Form
          config={config}
          auctionCs={auctionCs}
          auctionTerms={auctionTerms}
          delegateInfo={delegateInfo}
          sellerSignature={sellerSignature}
        />
      </QueryClientProvider>
    );

    // Simulate user input
    const bidInput = screen.getByLabelText('Bid Amount');
    fireEvent.change(bidInput, { target: { value: '1.5' } });

    // Simulate form submission
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        auctionCs,
        auctionTerms,
        delegateInfo,
        sellerSignature,
        bidAmount: '1500000', // 1.5 ADA in lovelace
      });
    });
  });

  it('disables submit button when a bid is pending', () => {
    const { usePlaceBidL2 } = require('src/hooks/api/placeBidL2');

    usePlaceBidL2.mockReturnValue({ mutate: jest.fn(), isPending: true });

    render(
      <QueryClientProvider client={queryClient}>
        <PlaceBidL2Form
          config={config}
          auctionCs={auctionCs}
          auctionTerms={auctionTerms}
          delegateInfo={delegateInfo}
          sellerSignature={sellerSignature}
        />
      </QueryClientProvider>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
