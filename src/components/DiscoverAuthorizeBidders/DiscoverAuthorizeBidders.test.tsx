import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DiscoverAuthorizeBidders } from './DiscoverAuthorizeBidders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getConfig } from 'src/utils/config';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';

// Mock the API hooks
jest.mock('src/hooks/api/discoverBidders', () => ({
  useDiscoverBidders: jest.fn().mockReturnValue({
    data: [
      { bidderInfo: { bidderVk: 'bidder1' }, isValid: true },
      { bidderInfo: { bidderVk: 'bidder2' }, isValid: true },
    ],
  }),
}));

jest.mock('src/hooks/api/authorizeBidders', () => ({
  useAuthorizeBidders: jest
    .fn()
    .mockReturnValue({ mutate: jest.fn(), isPending: false }),
}));

// Set up QueryClient for React Query
const queryClient = new QueryClient();

describe('DiscoverAuthorizeBidders Component Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const config = getConfig('eternl');
  const auctionInfo = generateMockAuctionInfo();
  it('renders dropdown and authorize button correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DiscoverAuthorizeBidders config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Bidders to authorize')).toBeInTheDocument();
    expect(screen.getByText('Authorize')).toBeInTheDocument();
  });

  it('displays the correct number of bidders', async () => {
    const { useDiscoverBidders } = require('src/hooks/api/discoverBidders');
    useDiscoverBidders.mockReturnValue({
      data: [
        { bidderInfo: { bidderVk: 'bidder1' }, isValid: true },
        { bidderInfo: { bidderVk: 'bidder2' }, isValid: true },
      ],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DiscoverAuthorizeBidders config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('allows selecting and authorizing bidders', async () => {
    const { useDiscoverBidders } = require('src/hooks/api/discoverBidders');
    const { useAuthorizeBidders } = require('src/hooks/api/authorizeBidders');

    useDiscoverBidders.mockReturnValue({
      data: [
        { bidderInfo: { bidderVk: 'bidder1' }, isValid: true },
        { bidderInfo: { bidderVk: 'bidder2' }, isValid: true },
      ],
    });

    const mockMutate = jest.fn();
    useAuthorizeBidders.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DiscoverAuthorizeBidders config={config} auctionInfo={auctionInfo} />
      </QueryClientProvider>
    );

    // Open the dropdown
    fireEvent.click(screen.getByText('Bidders to authorize'));

    // Select the first bidder
    const firstBidderCheckbox = screen.getByText('bidder1');
    fireEvent.click(firstBidderCheckbox);
    fireEvent.click(screen.getByText('Bidders to authorize'));
    // Submit the form
    fireEvent.click(screen.getByText('Authorize'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        auctionCs: auctionInfo.auctionId,
        biddersToAuthorize: ['bidder1'],
      });
    });
  });

  it('disables authorize button when pending or disabled', () => {
    const { useAuthorizeBidders } = require('src/hooks/api/authorizeBidders');

    useAuthorizeBidders.mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DiscoverAuthorizeBidders
          config={config}
          auctionInfo={auctionInfo}
          disabled={true}
        />
      </QueryClientProvider>
    );

    const authorizeButton = screen.getByText('Authorize');
    expect(authorizeButton).toBeDisabled();
  });
});
