import { ByteArray, ContractOutput, CurrencySymbol } from 'public/dist/types';

export type VerificationKey = string;

const MOCK_SELLER_SIGNATURE =
  '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9';

export const discoverSellerSignature = async (
  auctionCs: CurrencySymbol,
  bidderVk: VerificationKey
): Promise<ContractOutput<ByteArray>> => {
  return {
    tag: 'result',
    value: MOCK_SELLER_SIGNATURE,
  };
};
