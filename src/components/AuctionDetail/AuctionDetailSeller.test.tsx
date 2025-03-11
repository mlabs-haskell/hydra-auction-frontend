import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionDetailSeller, {
  AuctionDetailSellerProps,
} from './AuctionDetailSeller';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { generateMockAuctionInfo } from 'src/mocks/announceAuction.mock';
import { getConfig } from 'src/utils/config';

const queryClient = new QueryClient();

describe('AuctionDetailSeller Component', () => {
  const defaultProps: AuctionDetailSellerProps = {
    config: getConfig('eternl'),
    auctionInfo: generateMockAuctionInfo(),
  };
  it('renders all child components', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuctionDetailSeller {...defaultProps} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('seller-detail')).toBeInTheDocument();
    expect(screen.getByText('Seller Options')).toBeInTheDocument();
    expect(screen.getByText('Bidders to authorize')).toBeInTheDocument();
    expect(screen.getByText('Start Bidding')).toBeInTheDocument();
    expect(screen.getByText('Move Bidding to L2')).toBeInTheDocument();
    expect(screen.getByText('Claim Auction Lot')).toBeInTheDocument();
  });
});
