import { useWallet } from '@meshsdk/react';
import { useWalletAddress } from 'src/hooks/api/user';

export default function Test() {
  const { wallet, connected } = useWallet();
  console.log({ wallet });
  const { data: walletAddress } = useWalletAddress(wallet, connected);
  console.log({ walletAddress });
  return <div>test</div>;
}
