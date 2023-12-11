import type { AnnounceAuctionContractParams, AuctionInfo, BigInt, ContractOutput, TokenName, TransactionHash, WalletApp } from "./types";
export declare const announceAuction: (walletApp: WalletApp, params: AnnounceAuctionContractParams) => Promise<ContractOutput<TransactionHash>>;
export declare const queryAuctions: (walletApp: WalletApp | null) => Promise<Array<AuctionInfo>>;
export declare const awaitTxConfirmed: (walletApp: WalletApp | null, txHash: TransactionHash) => Promise<void>;
export declare const mintTokenUsingAlwaysMints: (walletApp: WalletApp, tokenName: TokenName, quantity: BigInt) => Promise<TransactionHash>;
//# sourceMappingURL=api.d.ts.map