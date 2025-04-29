import { render, screen } from '@testing-library/react';
import CreateAuction from './CreateAuction';
import { useAssets } from '@meshsdk/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mock useUrlParams to pass assetUnit and assetName
jest.mock('src/utils/useUrlParams', () => ({
  useUrlParams: jest.fn(
    () =>
      new URLSearchParams({
        assetUnit: 'mockUnit123',
        assetName: 'Mock Asset',
      })
  ),
}));

// React query client to wrap the component
const queryClient = new QueryClient();

describe('CreateAuction Component', () => {
  // Returning no asset to find
  it('renders error when assetUnit, assetName, or assetToList is missing', () => {
    (useAssets as jest.Mock).mockReturnValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <CreateAuction />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Error finding asset/i)).toBeInTheDocument();
  });

  // Rendering asset that matches urlParams
  it('renders the CreateAuction component with the correct data', () => {
    const mockAssets = [
      { unit: 'mockUnit123', name: 'Mock Asset', metadata: {} },
    ];

    (useAssets as jest.Mock).mockReturnValue(mockAssets);

    render(
      <QueryClientProvider client={queryClient}>
        <CreateAuction />
      </QueryClientProvider>
    );

    expect(screen.getByText(/List an NFT/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Asset/i)).toBeInTheDocument();
  });

  // Rendering the current listing and create auction tabs with asset from urlParams
  it('renders CurrentListing and CreateAuctionTabs components', () => {
    const mockAssets = [
      { unit: 'mockUnit123', name: 'Mock Asset', metadata: {} },
    ];

    (useAssets as jest.Mock).mockReturnValue(mockAssets);

    render(
      <QueryClientProvider client={queryClient}>
        <CreateAuction />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Current Listing/i)).toBeInTheDocument();
    expect(screen.getByText(/Auction Details/i)).toBeInTheDocument();
  });
});
