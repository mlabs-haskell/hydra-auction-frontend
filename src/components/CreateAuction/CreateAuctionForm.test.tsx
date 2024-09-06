import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAuctionForm from './CreateAuctionForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ONE_DAY_MS, ONE_HOUR_MS } from 'src/utils/date';

// Mock the announce auction mutation
const mockAnnounceAuctionMutate = jest.fn();
jest.mock('src/hooks/api/announceAuction', () => ({
  useAnnounceAuction: jest.fn(() => ({
    mutate: mockAnnounceAuctionMutate,
  })),
}));

// Mock the assetUnit from url params
jest.mock('src/utils/getUrlParams', () => ({
  getUrlParams: jest.fn(() => new URLSearchParams('assetUnit=mockAssetUnit')),
}));

// Mock functions from hooks
const mockUseExtendedAssets = jest.fn();
const mockUseDelegates = jest.fn();
const mockUseWallet = jest.fn();
const mockUseWalletAddress = jest.fn();

// React query client to wrap the component
const queryClient = new QueryClient();

describe('CreateAuctionForm Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Render and submit form with zod valid data  to confirm mutation is called
  it('renders and submits the form with correct data', async () => {
    mockUseDelegates.mockReturnValue({
      data: { delegates: ['delegate1', 'delegate2'] },
    });

    mockUseExtendedAssets.mockReturnValue({
      data: [
        {
          unit: 'mockAssetUnit',
          name: 'Mock Asset',
          quantity: 1,
          policyId: 'mockPolicyId',
        },
      ],
      isError: false,
    });

    mockUseWallet.mockReturnValue({
      name: 'mockWallet',
      wallet: {} as any,
      connected: true,
    });

    mockUseWalletAddress.mockReturnValue('mockAddress');

    render(
      <QueryClientProvider client={queryClient}>
        <CreateAuctionForm />
      </QueryClientProvider>
    );

    // Fill out the form
    // Dates based on current date
    fireEvent.change(screen.getByLabelText(/Bidding Start/i), {
      target: {
        value: new Date(Date.now() + ONE_HOUR_MS).toISOString().split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Bidding End/), {
      target: {
        value: new Date(Date.now() + 2 * ONE_HOUR_MS)
          .toISOString()
          .split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Purchase Deadline/i), {
      target: {
        value: new Date(Date.now() + ONE_DAY_MS).toISOString().split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Cleanup/i), {
      target: {
        value: new Date(Date.now() + ONE_DAY_MS * 2)
          .toISOString()
          .split('.')[0],
      },
    });

    // Default valid values for input fields
    fireEvent.change(screen.getByLabelText(/Auction Fee Per Delegate/i), {
      target: { value: 5000000 },
    });

    fireEvent.change(screen.getByLabelText(/Starting Bid/i), {
      target: { value: 12000000 },
    });

    fireEvent.change(screen.getByLabelText(/Min Bid Increment/i), {
      target: { value: 1000000 },
    });

    fireEvent.change(screen.getByLabelText(/Min Deposit Amount/i), {
      target: { value: 3000000 },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Mutation should be reached if it passes all validation
    expect(mockAnnounceAuctionMutate).toHaveBeenCalledTimes(1);
  });

  it('shows error messages when form validation fails', async () => {
    // Mock delegates
    mockUseDelegates.mockReturnValue({
      data: { delegates: ['delegate1', 'delegate2'] },
    });

    // Mock asset details
    mockUseExtendedAssets.mockReturnValue({
      data: [
        {
          unit: 'mockAssetUnit',
          name: 'Mock Asset',
          quantity: 1,
          policyId: 'mockPolicyId',
        },
      ],
      isError: false,
    });

    // Mock wallet & address
    mockUseWallet.mockReturnValue({
      name: 'mockWallet',
      wallet: {} as any,
      connected: true,
    });

    mockUseWalletAddress.mockReturnValue({
      data: 'mockAddress',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CreateAuctionForm />
      </QueryClientProvider>
    );

    // Fill out the form with invalid data
    fireEvent.change(screen.getByLabelText(/Bidding Start/i), {
      target: {
        value: new Date(Date.now() + ONE_HOUR_MS).toISOString().split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Bidding End/), {
      target: {
        value: new Date(Date.now() + 2 * ONE_HOUR_MS)
          .toISOString()
          .split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Purchase Deadline/i), {
      target: {
        value: new Date(Date.now() + ONE_DAY_MS).toISOString().split('.')[0],
      },
    });

    // Here we are setting the cleanup date to be the same as the purchase deadline to trigger zod error -  cleanup must be after purchase deadline
    fireEvent.change(screen.getByLabelText(/Cleanup/i), {
      target: {
        value: new Date(Date.now() + ONE_DAY_MS).toISOString().split('.')[0],
      },
    });

    fireEvent.change(screen.getByLabelText(/Auction Fee Per Delegate/i), {
      target: { value: 5000000 },
    });

    fireEvent.change(screen.getByLabelText(/Starting Bid/i), {
      target: { value: 12000000 },
    });

    fireEvent.change(screen.getByLabelText(/Min Bid Increment/i), {
      target: { value: 1000000 },
    });

    fireEvent.change(screen.getByLabelText(/Min Deposit Amount/i), {
      target: { value: 3000000 },
    });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Check if error message is shown by toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Error creating auction')
      );
    });
  });
});
