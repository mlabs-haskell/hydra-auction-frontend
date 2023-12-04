import { queryAuctions, announceAuction } from './index.js';

window.queryAuctions = async function () {
  return await queryAuctions('Nami');
};

window.announceAuction = async function (walletApp, params) {
  return await announceAuction(walletApp, params);
};
