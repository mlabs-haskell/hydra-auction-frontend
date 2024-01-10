import {
  ContractOutput,
  CurrencySymbol,
  TransactionHash,
} from 'hydra-auction-offchain';

export type VerificationKey = string;

const MOCK_AUTHORIZE_BIDDERS =
  '400d8729d8be39372f3bc6241af2f0e44892a4e065848d39c1006d2329e64db9';

export const authorizeBidders = async (
  auctionCs: CurrencySymbol,
  biddersToAuthorize: Array<VerificationKey>
): Promise<ContractOutput<TransactionHash>> => {
  return {
    tag: 'result',
    value: MOCK_AUTHORIZE_BIDDERS,
  };
};
