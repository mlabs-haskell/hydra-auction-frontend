import { BlockfrostProvider } from '@meshsdk/core';

// Blockfrost API key from the index.js of node_modules/hydra-auction-offchain/dist/index.js

const BLOCKFROST_API_KEY = process.env.REACT_APP_BLOCKFROST_API_KEY || '';
export const blockfrostProvider = new BlockfrostProvider(BLOCKFROST_API_KEY);
