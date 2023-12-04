import type {
  AnnounceAuctionContractParams,
  AuctionInfo,
  ContractOutput,
  TransactionHash,
  WalletApp,
} from '../api/types';
export declare const announceAuction: (
  walletApp: WalletApp,
  params: AnnounceAuctionContractParams
) => Promise<ContractOutput<TransactionHash>>;
export declare const queryAuctions: () => Promise<Array<AuctionInfo>>;
//# sourceMappingURL=api.d.ts.map
