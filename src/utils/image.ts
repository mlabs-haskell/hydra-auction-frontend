import { resolveMedia } from '@meshsdk/react';
const IPFS_BASE_URL = 'https://ipfs.grabbit.market/ipfs/'; //'https://ipfs.io/ipfs/';

export const getImageUrl = (assetUnit: string) => {
  // Resolve IPFS image URL using resolveMedia

  //  const cid = url.replaceAll('ipfs://ipfs/', '').replaceAll('ipfs://', '');

  // if (PUBLIC_PINATA_GATEWAY_TOKEN) {
  //   return `${PUBLIC_IPFS_URL}${cid}?pinataGatewayToken=${PUBLIC_PINATA_GATEWAY_TOKEN}`;
  // } else {
  //   return `${PUBLIC_IPFS_URL}${cid}`;
  // }

  const ipfsHash = resolveMedia(assetUnit, IPFS_BASE_URL).toString();
  return ipfsHash ? `${IPFS_BASE_URL}${ipfsHash}` : '';
};
