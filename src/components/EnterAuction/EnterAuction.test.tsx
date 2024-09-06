import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { EnterAuctionForm } from './EnterAuction';
import { AuctionInfo } from 'hydra-auction-offchain';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';
import { toast } from 'react-toastify';

const mockEnterAuctionMutate = jest.fn();
jest.mock('src/hooks/api/enterAuction', () => ({
  useEnterAuction: jest.fn(() => ({
    mutate: mockEnterAuctionMutate,
  })),
  isPending: false,
}));

describe('EnterAuctionForm Integration Test', () => {
  const auction = generateMockAuctionInfo() as AuctionInfo;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const mockUseWallet = jest.fn();
  const mockUseWalletAddress = jest.fn();

  // React query client to wrap the component
  const queryClient = new QueryClient();

  it('renders and submits the form with correct data', async () => {
    // Mock implementations
    mockUseWallet.mockReturnValue({
      name: 'mockWallet',
      wallet: {} as any,
      connected: true,
    });

    mockUseWalletAddress.mockReturnValue({
      data: 'mockWalletAddress',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EnterAuctionForm auction={auction} />
      </QueryClientProvider>
    );

    // Check if the input is rendered with the correct placeholder
    expect(
      screen.getByPlaceholderText(/Minimum Deposit: 3 ADA/i)
    ).toBeInTheDocument();

    // Change the deposit amount
    fireEvent.change(screen.getByLabelText(/Deposit amount/i), {
      target: { value: 15 }, // 15 ADA
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check if the mutation was called with the correct data
    await waitFor(() => {
      expect(mockEnterAuctionMutate).toHaveBeenCalledWith({
        enterAuctionParams: {
          auctionInfo: auction,
          depositAmount: '15000000',
        },
        walletAddress: 'mockWalletAddress',
      });
    });
  });

  it('fails if data does not pass zod safeParse', async () => {
    // Mock implementations
    mockUseWallet.mockReturnValue({
      name: 'mockWallet',
      wallet: {} as any,
      connected: true,
    });

    mockUseWalletAddress.mockReturnValue({
      data: 'mockWalletAddress',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EnterAuctionForm auction={auction} />
      </QueryClientProvider>
    );

    // Check if the input is rendered with the correct placeholder
    expect(
      screen.getByPlaceholderText(/Minimum Deposit: 3 ADA/i)
    ).toBeInTheDocument();

    // Change the deposit amount - the minimum is 3 ADA
    fireEvent.change(screen.getByLabelText(/Deposit amount/i), {
      target: { value: 2 }, // 2 ADA
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check if error message is shown by toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Entering auction failed:')
      );
    });
  });
});
