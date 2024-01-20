import { CardanoWallet, useWallet } from '@meshsdk/react';
import { useEffect } from 'react';
import { setLocalStorageItem } from 'src/utils/localStorage';

type CustomWalletProps = {
  isDark: boolean;
};

export default function CustomWallet(
  { isDark }: CustomWalletProps = { isDark: false }
) {
  const { connect, name: walletName, connected } = useWallet();

  useEffect(() => {
    const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');
    if (lastConnectedWallet && !connected) {
      try {
        connect(JSON.parse(lastConnectedWallet).name);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  const storeConnection = () => {
    setLocalStorageItem('lastConnectedWallet', {
      name: walletName,
      timestamp: Date.now(),
    });
  };

  return (
    <div>
      <CardanoWallet isDark={isDark} onConnected={storeConnection} />
    </div>
  );
}
