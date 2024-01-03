const convert = (from: any, to: any) => (str: string) =>
  Buffer.from(str, from).toString(to);
const utf8ToHex = convert('utf8', 'hex');
const hexToUtf8 = convert('hex', 'utf8');
export { utf8ToHex, hexToUtf8 };
