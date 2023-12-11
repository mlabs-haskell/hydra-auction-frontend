import {
  BigInt,
  ByteArray,
  ContractOutput,
  CurrencySymbol,
  TransactionHash,
} from 'public/dist/types';

const MOCK_PLACE_BID_RESPONSE = '0x0000';

export const placeBid = async (
  auctionCs: CurrencySymbol,
  bidAmount: BigInt,
  sellerSignature: ByteArray
): Promise<ContractOutput<TransactionHash>> => {
  return MOCK_PLACE_BID_RESPONSE;
};
