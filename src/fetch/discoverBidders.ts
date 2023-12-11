import { WalletApp } from 'public/dist/types';

export type VerificationKey = string;

const MOCK_DISCOVER_BIDDERS =
  '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9';

export const discoverBidders = async (
  walletApp: WalletApp | null
): Promise<Array<VerificationKey>> => {
  return [MOCK_DISCOVER_BIDDERS];
};
