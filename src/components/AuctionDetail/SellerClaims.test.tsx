import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SellerClaims } from './SellerClaims';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaimAuctionLotSeller } from 'src/hooks/api/claim';
import { useWallet } from '@meshsdk/react';
import { getConfig } from 'src/utils/config';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock the necessary hooks
jest.mock('src/hooks/api/claim', () => ({
  useClaimAuctionLotSeller: jest.fn(),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('SellerClaims Component Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const auctionInfo = generateMockAuctionInfo();

  it('claims the auction lot when button is clicked', async () => {
    const mockClaimAuctionLotMutate = jest.fn();

    (useClaimAuctionLotSeller as jest.Mock).mockReturnValue({
      mutate: mockClaimAuctionLotMutate,
    });

    (useWallet as jest.Mock).mockReturnValue({
      name: 'mockWalletName',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SellerClaims auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    const claimButton = screen.getByRole('button', {
      name: /Claim Auction Lot/i,
    });

    fireEvent.click(claimButton);

    await waitFor(() => {
      expect(mockClaimAuctionLotMutate).toHaveBeenCalledWith(auctionInfo);
    });
  });

  it('handles missing wallet name gracefully', async () => {
    const mockClaimAuctionLotMutate = jest.fn();

    (useClaimAuctionLotSeller as jest.Mock).mockReturnValue({
      mutate: mockClaimAuctionLotMutate,
    });

    (useWallet as jest.Mock).mockReturnValue({
      name: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SellerClaims auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    const claimButton = screen.getByRole('button', {
      name: /Claim Auction Lot/i,
    });

    fireEvent.click(claimButton);

    await waitFor(() => {
      expect(mockClaimAuctionLotMutate).toHaveBeenCalledWith(auctionInfo);
    });
  });
});
