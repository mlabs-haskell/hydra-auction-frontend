import { queryAuctions, announceAuction } from './index.js';

window.queryAuctions = async function () {
  return await queryAuctions('Nami');
};

window.announceAuction = announceAuction;

// const run = async function () {
//   const auc = await queryAuctions('Nami');
//   //  console.log(auc);
// };
// run();
