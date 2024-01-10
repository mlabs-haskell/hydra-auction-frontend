import {
  BigInt,
  ByteArray,
  ContractOutput,
  CurrencySymbol,
  TransactionHash,
} from 'hydra-auction-offchain';

const MOCK_PLACE_BID_RESPONSE = '0x0000';

export const placeBid = async (
  auctionCs: CurrencySymbol,
  bidAmount: BigInt,
  sellerSignature: ByteArray
): Promise<ContractOutput<TransactionHash>> => {
  return {
    tag: 'result',
    value: MOCK_PLACE_BID_RESPONSE,
  };
};
