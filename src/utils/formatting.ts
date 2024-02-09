import { POLICY_ID_LENGTH } from './contract';

const convert = (from: any, to: any) => (str: string) =>
  Buffer.from(str, from).toString(to);
export const utf8ToHex = convert('utf8', 'hex');
export const hexToUtf8 = convert('hex', 'utf8');

export const removeSpecialCharsAssetName = (assetName: string) => {
  return assetName.replace('\u0000\r�@', '');
};

export const removePolicyIdFromAssetUnit = (assetUnit: string) => {
  return assetUnit.slice(POLICY_ID_LENGTH);
};
